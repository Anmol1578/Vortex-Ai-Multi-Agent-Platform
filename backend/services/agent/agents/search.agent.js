import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
    });

    // Tavily returns images as plain strings (or occasionally {url, description}
    // objects depending on config). Normalize to match the Message schema shape.
    const normalizedImages = (results.images || [])
      .map((img) => {
        if (typeof img === "string") {
          return { url: img, description: "" };
        }
        // already an object — make sure it at least has a url
        return {
          url: img?.url ?? "",
          description: img?.description ?? "",
        };
      })
      .filter((img) => img.url);

    return {
      ...state,
      searchResults: results,
      images: normalizedImages,
    };
  } catch (error) {
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
