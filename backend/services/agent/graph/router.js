import { getModel } from "../config/llmModels.js";

const VALID_AGENTS = [
  "chat",
  "search",
  "coding",
  "pdf",
  "ppt",
  "vision",
  "pdfRag",
  "imageAnalyzer",
];

const AGENT_DESCRIPTIONS = `
- chat
  Use for:
  - General conversation
  - Greetings
  - Explanations
  - Brainstorming
  - Writing emails, blogs, essays, captions
  - Translation
  - Summarization (of text the user pastes directly, not a file)
  - Any request that does not fit another agent

- search
  Use for:
  - Current events
  - Latest news
  - Weather
  - Sports scores
  - Stock prices
  - Internet research
  - Finding information on the web
  - Requests that require web search or up-to-date information

    IMPORTANT:
  - Do NOT use search when the user explicitly requests
    creation of a PDF or PowerPoint.
  - The requested output format takes priority over the topic.

- coding
  Use for:
  - Programming
  - Debugging
  - Code generation
  - Code explanation
  - APIs
  - Databases
  - DevOps
  - Software architecture
  - Technical interview questions

- pdf
  Use for:
  - Creating a brand-new PDF
  - Generating a PDF report FROM SCRATCH or from pasted text
  - Turning research/notes into a downloadable PDF
  - Exporting content as a PDF

    IMPORTANT:
  - Only choose "pdf" when the user wants a NEW PDF produced.
  - If a PDF was uploaded and the user wants it read, summarized,
    or queried, use "pdfRag" instead, even though the topic is
    still "PDF".
  - If a PDF was uploaded AND the user wants a NEW PDF generated
    (e.g. "turn this report into a slide-ready one-pager PDF" or
    "regenerate this as a cleaner formatted PDF"), still choose
    "pdf" — the uploaded file is a source, not something to be
    queried in place.

- pdfRag
  Use for:
  - Reading an uploaded PDF
  - Summarizing an uploaded PDF
  - Extracting text/tables from an uploaded PDF
  - Answering questions about the content of an uploaded PDF
  - Any request that acts ON an already-uploaded PDF without
    asking for a new PDF file to be produced

    IMPORTANT:
  - Only valid when a PDF is actually attached to this message.
  - If the user's prompt is empty or purely generic ("look at this",
    "check this out") with a PDF attached, default here — reading/
    analyzing is the safe default over generating.

- ppt
  Use for:
  - Creating PowerPoint presentations
  - Generating PPT/PPTX files
  - Editing presentations
  - Designing slide decks
  - Converting notes into presentation slides

    IMPORTANT:
  - If the user asks to create, generate, make, export, or
    produce a PowerPoint/PPT/PPTX/presentation/slides,
    ALWAYS choose ppt.

- vision
  Use for:
  - Generating a new image
  - Editing/transforming an uploaded image into something new
    (style transfer, "turn this into...", background removal, etc.)

    IMPORTANT:
  - Choose "vision" when the user wants a NEW or MODIFIED image
    as output, even if an image was uploaded as a reference.

- imageAnalyzer
  Use for:
  - Analyzing an uploaded image
  - OCR / reading text out of an uploaded image
  - Visual question answering about an uploaded image
    ("what's in this picture", "how many people are in this photo")

    IMPORTANT:
  - Only valid when an image is actually attached to this message.
  - If the user's prompt is empty or purely generic with an image
    attached, default here — analysis is the safe default over
    generation/editing.
`;

// Few-shot examples to disambiguate agents that commonly get confused.
const FEW_SHOT_EXAMPLES = `
Examples:

Query: "Summarize the news about the Fed's rate decision"
Reasoning: current event -> needs up-to-date info
Answer: {"agent": "search", "fallback": "chat"}

Query: "Summarize this document" (attached file: application/pdf)
Reasoning: acting on an uploaded PDF, no new file requested -> pdfRag
Answer: {"agent": "pdfRag", "fallback": "chat"}

Query: "" (attached file: application/pdf, no text)
Reasoning: no intent signal, PDF attached -> default to reading it
Answer: {"agent": "pdfRag", "fallback": "chat"}

Query: "Turn this report into a cleaner, reformatted PDF" (attached file: application/pdf)
Reasoning: user wants a NEW PDF produced from the uploaded one -> pdf, not pdfRag
Answer: {"agent": "pdf", "fallback": "pdfRag"}

Query: "Create a PDF about NASA"
Reasoning: explicit PDF output request, no source file -> pdf agent
Answer: {"agent": "pdf", "fallback": "search"}

Query: "What's in this screenshot?" (attached file: image/png)
Reasoning: visual question answering on an uploaded image -> imageAnalyzer
Answer: {"agent": "imageAnalyzer", "fallback": "chat"}

Query: "" (attached file: image/png, no text)
Reasoning: no intent signal, image attached -> default to analyzing it
Answer: {"agent": "imageAnalyzer", "fallback": "chat"}

Query: "Turn this photo into a watercolor painting" (attached file: image/png)
Reasoning: user wants a NEW/edited image produced -> vision, not imageAnalyzer
Answer: {"agent": "vision", "fallback": "imageAnalyzer"}

Query: "Turn my notes into a 10-slide deck about Q3 results"
Reasoning: explicit request to create a presentation
Answer: {"agent": "ppt", "fallback": "chat"}

Query: "Write a Python function to reverse a linked list"
Reasoning: code generation
Answer: {"agent": "coding", "fallback": "chat"}

Query: "What's the weather in Kanpur tomorrow?"
Reasoning: requires current/live data
Answer: {"agent": "search", "fallback": "chat"}

Query: "Explain how transformers work in machine learning"
Reasoning: conceptual explanation, no code/file/live-data needed
Answer: {"agent": "chat", "fallback": "search"}
`;

const buildPrompt = (state) => {
  const fileHint = state.file?.mimetype
    ? `\nAttached file: ${state.file.mimetype}${
        state.file.originalname ? ` (${state.file.originalname})` : ""
      }`
    : "";

  const attachmentHint = state.attachments?.length
    ? `\nOther attachments: ${state.attachments
        .map((a) => a.type || a.name || "unknown")
        .join(", ")}`
    : "";

  const historyHint = state.history?.length
    ? `\nRecent conversation context: ${state.history
        .slice(-3)
        .map((h) => `${h.role}: ${h.content}`)
        .join(" | ")}`
    : "";

  return `
You are an intelligent AI router for a multi-agent system.

Analyze the user's latest message and decide which specialized agent should handle it.

Available agents:
${AGENT_DESCRIPTIONS}

Tie-break rule: if a PDF or image is attached, the file establishes the
DOMAIN (pdf-family vs image-family), but the user's wording decides
whether they want the existing file READ/ANALYZED (pdfRag / imageAnalyzer)
or a NEW file GENERATED/EDITED (pdf / vision). If the prompt gives no
clear intent, default to READ/ANALYZE.

${FEW_SHOT_EXAMPLES}

Respond with ONLY a JSON object, no markdown fences, no explanation, in
exactly this shape:
{"agent": "<one of: ${VALID_AGENTS.join(", ")}>", "fallback": "<one of: ${VALID_AGENTS.join(", ")}>"}

The "fallback" field is your second-best guess, used only if the primary
agent cannot process the request.

User Query:
${state.prompt}${fileHint}${attachmentHint}${historyHint}
`;
};

// Pulls a JSON object out of a response even if wrapped in prose or
// markdown fences.
const extractJson = (text) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const match = candidate.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

const sanitizeAgent = (value) => (VALID_AGENTS.includes(value) ? value : null);

// If there's no real prompt text to signal intent, the file itself is the
// only signal we have — default deterministically to the "read/analyze"
// agent rather than paying for an LLM call to decide the obvious.
const deterministicFileDefault = (state) => {
  const hasPrompt = state.prompt && state.prompt.trim().length > 0;
  if (hasPrompt) return null;

  if (state.file?.mimetype === "application/pdf") return "pdfRag";
  if (state.file?.mimetype?.startsWith("image/")) return "imageAnalyzer";
  return null;
};

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    const clean = sanitizeAgent(state.agent);
    if (clean) {
      return {
        ...state,
        agent: clean,
        agentFallback: clean,
        routerMeta: { source: "explicit", routedAt: new Date().toISOString() },
      };
    }
  }

  // No prompt text at all — file type alone decides, no need for an LLM call.
  const deterministic = deterministicFileDefault(state);
  if (deterministic) {
    return {
      ...state,
      agent: deterministic,
      agentFallback: deterministic,
      routerMeta: {
        source: "file-default",
        routedAt: new Date().toISOString(),
      },
    };
  }

  const llm = getModel("router");
  const prompt = buildPrompt(state);

  let agent = "chat";
  let fallback = "chat";
  let source = "default";

  try {
    const response = await llm.invoke(prompt);
    const raw = response?.content ?? "";
    const parsed = extractJson(raw);

    if (parsed) {
      agent = sanitizeAgent(parsed.agent) ?? "chat";
      fallback = sanitizeAgent(parsed.fallback) ?? "chat";
      source = "llm";
    } else {
      // Model ignored JSON instructions — fall back to loose text matching.
      const lower = raw.trim().toLowerCase();
      agent = VALID_AGENTS.find((a) => lower.includes(a)) ?? "chat";
      source = "llm-loose-parse";
    }
  } catch (err) {
    console.error("[router] LLM call failed, defaulting to chat:", err);
    source = "error-default";

    // Even on LLM failure, don't lose the file signal entirely if we can
    // salvage a reasonable default.
    if (state.file?.mimetype === "application/pdf") agent = "pdfRag";
    else if (state.file?.mimetype?.startsWith("image/"))
      agent = "imageAnalyzer";
    fallback = agent;
  }

  console.log(
    `[router] query="${state.prompt?.slice(0, 80)}" -> agent=${agent} fallback=${fallback} source=${source}`,
  );

  return {
    ...state,
    agent,
    agentFallback: fallback,
    routerMeta: {
      source,
      routedAt: new Date().toISOString(),
    },
  };
};
