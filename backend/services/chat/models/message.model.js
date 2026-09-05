import mongoose from "mongoose";

// ============================================================
// FILE SCHEMA
// ============================================================

const fileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "text",
    },

    content: {
      type: String,
      default: "",
    },

    // S3 URL
    url: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);
// ============================================================
// ARTIFACT SCHEMA
// ============================================================

const artifactSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "project",
    },

    title: {
      type: String,
      default: "Code Artifact",
    },

    description: {
      type: String,
      default: "",
    },

    files: {
      type: [fileSchema],
      default: [],
    },

    dependencies: {
      type: [String],
      default: [],
    },

    commands: {
      type: [String],
      default: [],
    },

    notes: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

// ============================================================
// MESSAGE SCHEMA
// ============================================================

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
    },

    content: {
      type: String,
      default: "",
    },

    // ========================================================
    // IMAGES
    // ========================================================

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },

          description: {
            type: String,
            default: "",
          },
        },
      ],

      default: [],
    },

    // ========================================================
    // ARTIFACTS
    // ========================================================

    artifacts: {
      type: [artifactSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

// ============================================================
// INDEXES
// ============================================================

messageSchema.index({ conversationId: 1, createdAt: 1 });

// ============================================================
// MODEL
// ============================================================

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
