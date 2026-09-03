import { getModel } from "../config/llmModels.js";
import { generatePdf } from "../utils/generatePdf.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";

const VALID_TYPES = ["heading", "paragraph", "bullets", "numbered"];
const MAX_PAGES = 12;
const WORDS_PER_PAGE = 300;

const detectPages = (topic) => {
  const t = topic.toLowerCase();

  const n = t.match(/\b(\d{1,2})\s*(?:printed\s*)?pages?\b/);
  if (n) return Math.min(Math.max(+n[1], 1), MAX_PAGES);

  const nums = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
  };

  const word = t.match(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*pages?\b/,
  );

  if (word) return nums[word[1]];

  if (/\b(very detailed|extensive|exhaustive|full report|deep dive)\b/.test(t))
    return MAX_PAGES;

  if (/\b(detailed|in-depth|thorough|comprehensive|expand|longer)\b/.test(t))
    return 5;

  return 1;
};

const detectType = (topic) => {
  const t = topic.toLowerCase();

  if (/\broadmap|timeline|milestone|phase|quarter\b/.test(t)) return "roadmap";

  if (/\bplan|strategy|action items?\b/.test(t)) return "plan";

  if (/\bguide|how-to|tutorial|steps?|walkthrough\b/.test(t)) return "guide";

  if (/\bbrief|executive summary|overview\b/.test(t)) return "brief";

  if (/\breport|analysis|findings|research|study\b/.test(t)) return "report";

  return "general";
};

const buildPrompt = (topic) => {
  const pages = detectPages(topic);
  const type = detectType(topic);
  const words = pages * WORDS_PER_PAGE;

  return `The text below is a user's raw request. It may be phrased as an instruction
("write a report about X", "make me a pdf on Y", "I need 3 pages covering Z") rather than
a bare subject. First identify the actual subject matter the user wants written about —
ignore meta-phrasing like "create a pdf", "write a document", "make me a report", page-count
requests, and similar instruction language. Then write a ${type} about that subject only.
Do not describe or restate the request itself anywhere in the output — the output should read
like a real document on the subject, as if the request had never been shown to the reader.

Length: ~${words} words, ${pages} page${pages > 1 ? "s" : ""}.
Use concise, specific, useful content. Avoid filler and repetition.
Use headings, paragraphs, bullets or numbered steps where appropriate.
Return ONLY valid JSON.

{
"title":"...",
"subtitle":"...",
"blocks":[
{"type":"heading","text":"..."},
{"type":"paragraph","text":"..."},
{"type":"bullets","items":["..."]},
{"type":"numbered","items":["..."]}
]}

User's raw request:
${topic}`;
};

const stripFences = (raw) =>
  raw
    .toString()
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const validate = (data) => {
  if (!data || typeof data !== "object") throw new Error("Invalid PDF data");

  if (!Array.isArray(data.blocks) || !data.blocks.length)
    throw new Error("No PDF blocks");

  const blocks = data.blocks.filter((b) => {
    if (!b || !VALID_TYPES.includes(b.type)) return false;

    if (b.type === "bullets" || b.type === "numbered")
      return Array.isArray(b.items) && b.items.length;

    return typeof b.text === "string" && b.text.trim();
  });

  if (!blocks.length) throw new Error("No valid PDF blocks");

  return {
    title: String(data.title || "Untitled Document").trim(),
    subtitle: String(data.subtitle || "").trim(),
    blocks,
  };
};

const generatePdfData = async (llm, topic) => {
  const res = await llm.invoke(buildPrompt(topic));
  const raw = stripFences(res?.content ?? res?.text ?? "");

  if (!raw) throw new Error("Empty LLM response");

  try {
    return validate(JSON.parse(raw));
  } catch {
    // One short retry only if JSON is malformed.
    const retry = await llm.invoke(
      `Return ONLY valid JSON for this topic. Use the required PDF schema.\n${topic}`,
    );

    const retryRaw = stripFences(retry?.content ?? retry?.text ?? "");
    return validate(JSON.parse(retryRaw));
  }
};

export const pdfAgent = async (params) => {
  try {
    const llm = await getModel("pdf");
    const pdfData = await generatePdfData(llm, params.prompt);

    const pdfBuffer = await generatePdf(pdfData);

    if (!pdfBuffer?.length) throw new Error("Empty PDF");

    const safeTitle = pdfData.title
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const filename = `${safeTitle || "document"}-${Date.now()}.pdf`;

    await uploadToS3(filename, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    if (!downloadUrl) throw new Error("Failed to create S3 URL");

    return {
      ...params,
      agent: "pdf",
      artifacts: [],
      images: [],
      pdfData,
      pdfUrl: downloadUrl,
      pdfFilename: filename,
      aiResponse: `## ✨ PDF Ready

### 📄 ${pdfData.title}

Your document has been successfully generated and is ready to view.

> **Status:** ✅ Completed  
> **Format:** PDF  
> **Generated by:** VortexAI

[📥 Open PDF](${downloadUrl})

_Your download link will remain available for 24 hours._`,
    };
  } catch (error) {
    console.error("[pdfAgent]", error);

    return {
      ...params,
      agent: "pdf",
      aiResponse: "Failed to generate PDF. Please try again.",
      artifacts: [],
      images: [],
      pdfData: null,
      pdfUrl: null,
      pdfFilename: null,
      error: error.message,
    };
  }
};
