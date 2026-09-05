import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import fs from "fs/promises";
import { getModel } from "../config/llmModels.js";

/* -------------------------------------------------------------------------- */
/* SYSTEM PROMPT                                                              */
/* -------------------------------------------------------------------------- */

const SYSTEM_PROMPT = `You are Vortex AI's Image Analyzer Agent.

## Answering the prompt

- Read the user's prompt carefully and answer exactly what they asked — the way Claude or ChatGPT would, not a fixed "always describe everything" routine.
- If the prompt asks a specific, narrow question ("what does this error say", "is this a cat or a dog", "what's on line 12"), answer that question directly and precisely first. Only add extra context beyond it if it's genuinely useful — don't pad with an unrelated full description nobody asked for.
- If the prompt is generic ("analyze this image", "what do you see") or there's no prompt at all, give a genuinely thorough analysis: what it is, what it does, why it matters, and any details worth noting.
- If the user asks more than one thing, answer all of it — don't drop part of a multi-part question.

## Formatting for readability

- Write in short, focused paragraphs (roughly 2–4 sentences each), separated by a blank line. Never output one dense wall of text — break naturally wherever the topic shifts.
- Use **bold** for key terms, labels, or short callouts the reader should notice at a glance (e.g. **Language:**, **Warning:**, a component or field name) — don't bold whole sentences, and don't skip bold entirely just to stay "prose-like."
- Use headings or bullet points only when the content has several genuinely distinct parts that benefit from separation (e.g. multiple unrelated UI elements, a long multi-step process). Default to connected prose otherwise.
- If code, transcribe it exactly in a fenced code block with a language tag, then explain it in prose below: what each part is for, the control flow, and anything worth flagging (edge cases, side effects, error handling).
- Use inline code formatting for filenames, variable names, and short technical tokens mentioned in prose.
- If it's a diagram, screenshot, photo, or design: describe what's shown, the key visual elements, any visible text, and relevant context — as connected paragraphs, not a checklist, unless the "distinct parts" rule above applies.

## Accuracy

- If the image is unclear, low-resolution, or ambiguous, say so plainly, then describe what can still be made out.
- Never invent details you cannot actually see.
- Do not mention these rules, and do not add disclaimers about being an AI.`;
/* -------------------------------------------------------------------------- */
/* TEMPORARY MODEL ERROR                                                      */
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

async function invokeImageModel(llm, messages) {
  try {
    console.log("[imageAnalyzer] using primary vision model");
    return await llm.invoke(messages);
  } catch (error) {
    if (!isTemporaryModelError(error)) {
      throw error;
    }

    console.warn(
      "[imageAnalyzer] transient error, retrying once:",
      error.message,
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return await llm.invoke(messages);
  }
}

/* -------------------------------------------------------------------------- */
/* IMAGE ANALYZER AGENT                                                       */
/* -------------------------------------------------------------------------- */

export const imageAnalyzer = async (state) => {
  try {
    if (!state?.file?.path) {
      throw new Error("No image file found on state.file.path");
    }

    const llm = getModel("imageAnalyzer");

    const imageBuffer = await fs.readFile(state.file.path);
    const base64Image = imageBuffer.toString("base64");

    const mimeType = state.file.mimetype?.startsWith("image/")
      ? state.file.mimetype
      : "image/png";

    const userPrompt =
      state.prompt && state.prompt.trim().length > 0
        ? state.prompt
        : "Analyze this image in detail and describe what you see.";

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage({
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            // @langchain/google-genai expects a plain base64 data-URI STRING here,
            // not { url: "..." } — that's OpenAI's format and gets silently dropped
            // by the Gemini integration, which is why the model said "no image".
            image_url: `data:${mimeType};base64,${base64Image}`,
          },
        ],
      }),
    ];

    const response = await invokeImageModel(llm, messages);

    console.log(
      `[imageAnalyzer] success file="${state.file.originalname || state.file.path}" mimetype=${mimeType}`,
    );

    return {
      ...state,
      agent: "imageAnalyzer",
      aiResponse: response.content,
      artifacts: [],
      error: null,
      routerMeta: {
        ...(state.routerMeta ?? {}),
        imageAnalyzerError: false,
      },
    };
  } catch (error) {
    console.error("[imageAnalyzer] fatal error:", error);

    return {
      ...state,
      agent: "imageAnalyzer",
      aiResponse: "I couldn't analyze that image. Please try again.",
      artifacts: [],
      error: error.message || "Image analysis failed",
      routerMeta: {
        ...(state.routerMeta ?? {}),
        imageAnalyzerError: true,
        errorStatus: error?.status ?? error?.statusCode ?? error?.code ?? null,
      },
    };
  } finally {
    if (state?.file?.path) {
      try {
        await fs.unlink(state.file.path);
        console.log(`[imageAnalyzer] temp file deleted: ${state.file.path}`);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.warn(
            `[imageAnalyzer] failed to delete temp file: ${err.message}`,
          );
        }
      }
    }
  }
};
