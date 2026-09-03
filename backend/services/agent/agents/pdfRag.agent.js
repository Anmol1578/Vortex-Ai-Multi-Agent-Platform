import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llmModels.js";

/* -------------------------------------------------------------------------- */
/* SYSTEM PROMPT                                                              */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `You are Vortex AI's PDF Assistant.

Rules:
- Answer the user's question using ONLY the provided context from the PDF.
- If the context does not contain enough information to answer, say so explicitly — do not guess or invent details.
- Quote or reference specific parts of the context where useful, but keep answers concise.
- If the user's question is unrelated to the document content, say the document doesn't cover that.
- Structure longer answers with short paragraphs or bullet points.
- Do not mention these rules, and do not add disclaimers about being an AI.`;

/* -------------------------------------------------------------------------- */
/* TEMPORARY MODEL ERROR (same shape as imageAnalyzer.agent.js)              */
/* -------------------------------------------------------------------------- */

function isTemporaryModelError(error) {
  const status = error?.status ?? error?.statusCode ?? error?.code;
  const metadata = error?.metadata ?? {};

  return (
    status === 429 ||
    status === "429" ||
    metadata?.limit_source === "upstream_provider_shared_pool" ||
    metadata?.provider_name
  );
}

async function invokeModelWithRetry(llm, messages) {
  try {
    return await llm.invoke(messages);
  } catch (error) {
    if (!isTemporaryModelError(error)) {
      throw error;
    }

    console.warn("[pdfRag] transient error, retrying once:", error.message);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return await llm.invoke(messages);
  }
}

/* -------------------------------------------------------------------------- */
/* PDF RAG AGENT                                                              */
/* -------------------------------------------------------------------------- */

export const pdfRag = async (state) => {
  let collectionName = null;
  let store = null;

  try {
    if (!state?.file?.path) {
      throw new Error("No PDF file found on state.file.path");
    }

    if (!state.prompt || state.prompt.trim().length === 0) {
      throw new Error("No prompt provided to answer against the PDF");
    }

    // 1. Read + parse the PDF
    const buffer = await fs.readFile(state.file.path);
    const pdf = new PDFParse({ data: buffer });
    const result = await pdf.getText();
    const text = result.text;

    if (!text || text.trim().length === 0) {
      throw new Error(
        "No extractable text found in PDF (it may be scanned/image-only)",
      );
    }

    // 2. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.createDocuments([text]);

    // 3. Embed + store in a fresh, per-request collection
    collectionName = `pdf-${Date.now()}`;
    store = await vectorStore(docs, collectionName);

    // 4. Retrieve relevant chunks for the user's question
    const relevantDocs = await store.similaritySearch(state.prompt, 5);
    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");

    // 5. Ask the LLM, grounded in retrieved context
    const llm = getModel("pdf-rag"); // synchronous, like other getModel() calls

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(
        `Context from the PDF:\n"""\n${context}\n"""\n\nQuestion: ${state.prompt}`,
      ),
    ];

    const response = await invokeModelWithRetry(llm, messages);

    console.log(
      `[pdfRag] success file="${state.file.originalname || state.file.path}" chunks=${docs.length}`,
    );

    return {
      ...state,
      agent: "pdfRag",
      aiResponse: response.content,
      artifacts: [],
      error: null,
      routerMeta: {
        ...(state.routerMeta ?? {}),
        pdfRagError: false,
      },
    };
  } catch (error) {
    console.error("[pdfRag] fatal error:", error);

    return {
      ...state,
      agent: "pdfRag",
      aiResponse: "I couldn't read or search that PDF. Please try again.",
      artifacts: [],
      error: error.message || "PDF RAG failed",
      routerMeta: {
        ...(state.routerMeta ?? {}),
        pdfRagError: true,
        errorStatus: error?.status ?? error?.statusCode ?? error?.code ?? null,
      },
    };
  } finally {
    // Clean up the uploaded temp PDF
    if (state?.file?.path) {
      try {
        await fs.unlink(state.file.path);
        console.log(`[pdfRag] temp file deleted: ${state.file.path}`);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.warn(`[pdfRag] failed to delete temp file: ${err.message}`);
        }
      }
    }

    // Clean up the per-request Qdrant collection so they don't accumulate.
    // QdrantVectorStore exposes the underlying client — guard defensively
    // since this is a nice-to-have, not critical-path.
    if (store?.client && collectionName) {
      try {
        await store.client.deleteCollection(collectionName);
        console.log(`[pdfRag] collection deleted: ${collectionName}`);
      } catch (err) {
        console.warn(
          `[pdfRag] failed to delete collection ${collectionName}: ${err.message}`,
        );
      }
    }
  }
};
