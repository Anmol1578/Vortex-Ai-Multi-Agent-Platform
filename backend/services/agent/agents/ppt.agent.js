import { getModel } from "../config/llmModels.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

// Strip ```json fences etc. — LLMs frequently wrap JSON even when told not to.
const parseModelJson = (raw) => {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(cleaned);
};

const emitStep = async (state, step) => {
  if (typeof state.onStep === "function") {
    await state.onStep(step);
  }
};

export const pptAgent = async (state) => {
  const startedAt = Date.now();
  const trace = [];

  const logStep = async (label, status = "done") => {
    trace.push({ label, status });
    await emitStep(state, { label, status, elapsedMs: Date.now() - startedAt });
  };

  try {
    await logStep("Reading your request", "done");

    const llm = await getModel("ppt");

    const prompt = `
Create a concise PowerPoint presentation about the topic below.

Return ONLY valid JSON, no markdown fences, no preamble.

{
  "title": "Presentation title",
  "subtitle": "Optional subtitle",
  "slides": [
    {
      "title": "Slide title",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "stat": "Optional — a single big number/metric for a highlight slide",
      "statLabel": "Optional — one line explaining the stat",
      "quote": "Optional — use instead of bullets for a callout/quote slide",
      "attribution": "Optional — who said the quote"
    }
  ]
}

Rules:
- 5-8 slides
- Keep bullets short (under ~12 words each)
- Avoid repetition and filler
- Start with an introduction
- End with a conclusion
- Use "stat" or "quote" on at most 1-2 slides where it genuinely fits — most slides should use "bullets"
- Use only relevant information

Topic:
${state.prompt}
`;

    await logStep("Structuring the outline", "in_progress");
    const res = await llm.invoke(prompt);
    const data = parseModelJson(res.content);
    await logStep("Structuring the outline", "done");

    await logStep("Designing slides & theme", "in_progress");
    const ppt = await generatePpt(data);
    await logStep("Designing slides & theme", "done");

    await logStep("Rendering .pptx", "in_progress");
    const buffer = await ppt.write({ outputType: "nodebuffer" });
    if (!buffer || buffer.length === 0) {
      throw new Error("PPT generated an empty buffer");
    }
    await logStep("Rendering .pptx", "done");

    await logStep("Uploading deck", "in_progress");
    const filename = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);
    if (!downloadUrl) {
      throw new Error("Failed to generate PPT download URL");
    }
    await logStep("Uploading deck", "done");

    const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
    const outline = (data.slides || [])
      .map((s, i) => `${i + 1}. ${s.title}`)
      .join("\n");

    console.log("[pptAgent] PPT generated:", filename);

    return {
      ...state,
      agent: "ppt",
      pptData: data,
      pptUrl: downloadUrl,
      pptFilename: filename,
      pptTrace: trace,
      artifacts: [],
      images: [],
      aiResponse:
        `## ✨ Presentation Generated\n\n` +
        `### 📊 ${data.title}\n\n` +
        `${data.subtitle ? `${data.subtitle}\n\n` : ""}` +
        `Your **${data.slides?.length || 0}-slide deck** is ready. Here's what it covers:\n\n` +
        `${outline}\n\n` +
        `⏱️ **Generated in ${elapsedSec}s**\n\n` +
        `🚀 [Download Presentation](${downloadUrl})\n\n` +
        `⚠️ **This download link will expire in 24 hours.** Please download your presentation before the link expires.\n\n` +
        `Hope this helps! Let me know if you'd like me to create another presentation.`,
    };
  } catch (error) {
    console.error("[pptAgent] Error:", error);

    return {
      ...state,
      agent: "ppt",
      pptData: null,
      pptUrl: null,
      pptFilename: null,
      pptTrace: trace,
      artifacts: [],
      images: [],
      aiResponse:
        "Hit an issue putting the deck together — didn't want to hand you a broken file. " +
        "Want me to retry, or try a narrower topic?",
      error: error.message,
    };
  }
};
