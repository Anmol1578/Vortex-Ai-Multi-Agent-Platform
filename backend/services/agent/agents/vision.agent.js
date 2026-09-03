import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const visionAgent = async (state) => {
  try {
    // const llm = await getModel("image");
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

    const prompt = (res?.content ?? res?.text ?? "").toString().trim();

    if (!prompt) {
      throw new Error("visionAgent: LLM returned an empty image prompt");
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

    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(imageRes.data);

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
    console.error("[visionAgent] failed:", error);

    return {
      ...state,
      aiResponse: "Failed to generate image. Please try again.",
      agent: "vision",
      images: [],
    };
  }
};
