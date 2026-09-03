import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    console.log("Creating conversation for:", userId);

    const conversation = await Conversation.create({
      userId,
    });

    console.log("Created:", conversation);

    return res.status(200).json(conversation);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    console.log("userId", userId);

    const conversations = await Conversation.find({
      userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({
      message: `get conversation error ${error}`,
    });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      {
        title,
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({
      message: `update conversation error ${error}`,
    });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const {
      conversationId,
      role,
      content,
      images = [],
      artifacts = [],
    } = req.body;

    // ============================================================
    // NORMALIZE IMAGES
    // ============================================================

    const normalizedImages = (images || [])
      .map((img) => {
        // Tavily / old format
        if (typeof img === "string") {
          return {
            url: img,
            description: "",
          };
        }

        // Vision agent / object format
        if (img && typeof img === "object") {
          return {
            url: img.url || "",
            description: img.description || "",
          };
        }

        return null;
      })
      .filter((img) => img && img.url);

    // ============================================================
    // NORMALIZE ARTIFACTS
    // ============================================================

    const normalizedArtifacts = (artifacts || []).map((artifact) => ({
      id: artifact.id || `artifact-${Date.now()}`,

      type: artifact.type || "project",

      title: artifact.title || "Artifact",

      description: artifact.description || "",

      dependencies: artifact.dependencies || [],

      commands: artifact.commands || [],

      notes: artifact.notes || [],

      // ========================================================
      // FILES
      // ========================================================

      files: (artifact.files || []).map((file) => {
        const filename = file.path || file.name || "";

        const ext = filename.split(".").pop()?.toLowerCase();

        const languageMap = {
          js: "javascript",
          jsx: "jsx",
          ts: "typescript",
          tsx: "tsx",
          py: "python",
          html: "markup",
          css: "css",
          json: "json",
          md: "markdown",
          sh: "bash",
          pdf: "pdf",
        };

        return {
          // ==================================================
          // FILE PATH
          // ==================================================

          path: filename,

          // ==================================================
          // OLD NAME SUPPORT
          // ==================================================

          name: file.name || filename,

          // ==================================================
          // LANGUAGE
          // ==================================================

          language: file.language || languageMap[ext] || "text",

          // ==================================================
          // FILE CONTENT
          // ==================================================

          content: file.content || "",

          // ==================================================
          // IMPORTANT:
          // PDF / IMAGE / OTHER FILE URL
          // ==================================================

          url: file.url || "",
        };
      }),
    }));

    // ============================================================
    // DEBUG
    // ============================================================

    // console.log(
    //   "[saveMessage] normalized artifacts:",
    //   JSON.stringify(
    //     normalizedArtifacts,
    //     null,
    //     2
    //   )
    // );

    // ============================================================
    // SAVE MESSAGE
    // ============================================================

    const message = await Message.create({
      conversationId,
      role,
      content,
      images: normalizedImages,
      artifacts: normalizedArtifacts,
    });

    // ============================================================
    // UPDATE CONVERSATION
    // ============================================================

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    // ============================================================
    // RESPONSE
    // ============================================================

    return res.status(200).json(message);
  } catch (error) {
    console.error("[saveMessage] Error:", error);

    return res.status(500).json({
      message: `save message error: ${error.message}`,
    });
  }
};

// export const getMessages = async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     }).sort({
//       createdAt: 1,
//     });

//     return res.status(200).json(messages);
//   } catch (error) {
//     return res.status(500).json({
//       message: `get messages error ${error}`,
//     });
//   }
// };

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({
      createdAt: 1,
    });

    res.set("Cache-Control", "no-store");

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: `get messages error ${error}`,
    });
  }
};