import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

// Pollinations occasionally 500s under load, or rejects long/edge-case prompts.
// Small retry with backoff, and we decode the actual error body instead of
// logging the raw Axios error object (which is what was flooding the console).
async function fetchImageWithRetry(url, { retries = 2, timeoutMs = 20000 } = {}) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: timeoutMs,
      });
      return Buffer.from(res.data);
    } catch (err) {
      lastErr = err;

      let bodyText = err.message;
      if (err.response?.data) {
        bodyText = Buffer.isBuffer(err.response.data)
          ? err.response.data.toString("utf-8")
          : JSON.stringify(err.response.data);
      }

      console.error(
        `[visionAgent] pollinations attempt ${attempt + 1}/${retries + 1} failed ` +
          `(status ${err.response?.status ?? "n/a"}):`,
        bodyText,
      );

      // Don't bother retrying on 4xx (bad prompt, auth, etc.) — only on
      // 5xx / timeout / network errors, where a retry might actually help.
      const status = err.response?.status;
      const isRetryable = !status || status >= 500;
      if (!isRetryable || attempt === retries) break;

      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw lastErr;
}

export const visionAgent = async (state) => {
  try {
    const llm = getModel("vision");

    const res = await llm.invoke(`
You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}
`);

    let prompt = (res?.content ?? res?.text ?? "").toString().trim();

    if (!prompt) {
      throw new Error("visionAgent: LLM returned an empty image prompt");
    }

    // Pollinations' GET endpoint embeds the prompt in the URL. Very long
    // prompts (400+ words, like the flowery ones this LLM tends to write)
    // can push the encoded URL past what some edge/proxy layers accept
    // cleanly and correlate with intermittent 500s. Cap it defensively.
    const MAX_PROMPT_CHARS = 800;
    if (prompt.length > MAX_PROMPT_CHARS) {
      console.warn(
        `[visionAgent] prompt is ${prompt.length} chars, truncating to ${MAX_PROMPT_CHARS}`,
      );
      prompt = prompt.slice(0, MAX_PROMPT_CHARS);
    }

    console.log("[visionAgent] generated prompt:", prompt);

    const params = new URLSearchParams({
      width: "1536",
      height: "1536",
      model: "flux",
      nologo: "true",
      enhance: "true",
    });

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

    console.log("[visionAgent] fetching image from pollinations:", imageUrl);

    const buffer = await fetchImageWithRetry(imageUrl, { retries: 2, timeoutMs: 20000 });

    if (!buffer || buffer.length === 0) {
      throw new Error(
        "visionAgent: received an empty image buffer from pollinations",
      );
    }

    console.log(`[visionAgent] received image buffer: ${buffer.length} bytes`);

    const filename = `image-${Date.now()}.png`;

    console.log(`[visionAgent] uploading "${filename}" to S3`);

    await uploadToS3(filename, buffer, "image/png");

    const EXPIRY_SECONDS = 24 * 60 * 60;
    const downloadUrl = await getFromS3(filename, EXPIRY_SECONDS);

    console.log("[visionAgent] upload complete, signed URL generated");

    return {
      ...state,
      agent: "vision",
      aiResponse:
        `## ✨ Image Generated\n\n` +
        `Your image has been successfully created and is ready to view.\n\n` +
        `🖼️ [Open / Download Image](${downloadUrl})\n\n` +
        `⏳ _Link expires in 24 hours._\n\n` +
        `_Hope you like it! Want to create another image?_`,
      images: [
        {
          url: downloadUrl,
          description: "",
        },
      ],
    };
  } catch (error) {
    // Log a clean, decoded error instead of dumping the raw Axios object.
    const bodyText = error.response?.data
      ? Buffer.isBuffer(error.response.data)
        ? error.response.data.toString("utf-8")
        : error.response.data
      : error.message;

    console.error("[visionAgent] failed:", bodyText);

    return {
      ...state,
      aiResponse: "Failed to generate image. Please try again.",
      agent: "vision",
      images: [],
    };
  }
};