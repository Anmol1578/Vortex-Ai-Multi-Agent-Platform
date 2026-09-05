import { getModel } from "../config/llmModels.js";

const INTENTS = [
  "CODE_GENERATION",
  "PROGRAM_GENERATION",
  "CODE_REVIEW",
  "CODE_EXPLANATION",
  "DEBUGGING",
  "OPTIMIZATION",
  "CONVERSION",
  "DOCUMENTATION",
];

const FILE_INTENTS = new Set([
  "CODE_GENERATION",
  "PROGRAM_GENERATION",
  "DEBUGGING",
  "OPTIMIZATION",
  "CONVERSION",
]);

/* -------------------------------------------------------------------------- */
/* UI DETECTION                                                               */
/* -------------------------------------------------------------------------- */

const WEB_HINT =
  /\b(website|webpage|web app|web application|frontend|front-end|ui|interface|landing page|dashboard|navbar|hero section|browser|html page|css design|responsive website)\b/i;

const STANDALONE_HINT =
  /\b(program|script|console app|console application|algorithm|snippet|standalone|terminal|cli|command line)\b/i;

const HTML_HINT =
  /\b(html|css|javascript website|javascript web|browser app|dom|frontend)\b/i;

/* -------------------------------------------------------------------------- */
/* CORE                                                                       */
/* -------------------------------------------------------------------------- */

const CORE =
  "You are a senior software engineer in Vortex, a multi-agent coding platform. " +
  "The Vortex UI, Sidebar, Chat, Artifact Panel, and preview system already exist. " +
  "Never rebuild or explain Vortex itself.";

/* -------------------------------------------------------------------------- */
/* WEB BUILD                                                                  */
/* -------------------------------------------------------------------------- */

const WEB_BUILD =
  "This request is a WEB PROJECT. " +
  "Generate a browser-based project using vanilla HTML, CSS, and JavaScript unless the user explicitly names a framework. " +
  "Use exactly these files for a normal web project: index.html, style.css, script.js. " +
  "index.html must link style.css using a relative path and load script.js using a relative path. " +
  "Keep these exact filenames because Vortex live preview expects them. " +
  "All functionality described by the user must actually work in the browser. " +
  "Keep the generated code concise. " +
  "Do not add unnecessary libraries, components, comments, animations, " +
  "or features that were not requested.";

/* -------------------------------------------------------------------------- */
/* PROGRAM BUILD                                                              */
/* -------------------------------------------------------------------------- */

const PROGRAM_BUILD =
  "This request is a STANDALONE PROGRAM. " +
  "Generate only the source code needed for the requested program. " +
  "DO NOT create HTML. " +
  "DO NOT create CSS. " +
  "DO NOT create a frontend. " +
  "DO NOT create index.html. " +
  "DO NOT create style.css. " +
  "DO NOT create browser UI. " +
  "Do not create multiple files unless the task genuinely requires multiple source files. " +
  "For a simple JavaScript program, create exactly ONE JavaScript file. " +
  "The program should run as a normal JavaScript/Node.js program from the terminal unless the user explicitly requests browser JavaScript.";

/* -------------------------------------------------------------------------- */
/* DESIGN                                                                     */
/* -------------------------------------------------------------------------- */

const DESIGN =
  "Create a polished, distinctive visual design. " +
  "Use a small color system, clear typography, consistent spacing, responsive layout, " +
  "subtle shadows, useful hover/focus states, and lightweight transitions. " +
  "Keep CSS concise and avoid unnecessary decorative code.";

/* -------------------------------------------------------------------------- */
/* RULES                                                                     */
/* -------------------------------------------------------------------------- */

const RULES =
  "Write complete, working code. " +
  "Do not use placeholders or pseudocode. " +
  "Every feature mentioned must actually exist. " +
  "Handle relevant errors and invalid input. " +
  "Keep simple programming tasks simple instead of unnecessarily creating large architectures.";

/* -------------------------------------------------------------------------- */
/* JSON CONTRACT                                                              */
/* -------------------------------------------------------------------------- */

const JSON_ONLY = `
OUTPUT CONTRACT:

Return ONLY one valid JSON object.

STRICT RULES:

- Do NOT use markdown code fences.
- Do NOT write \`\`\`json.
- Do NOT write text before the JSON.
- Do NOT write text after the JSON.
- The first character must be {
- The last character must be }
- The response must be parseable by JSON.parse().
- Generate complete working files.
- Every file must contain real code.
- Never include markdown inside file content unless the requested file itself is markdown.
`;

/* -------------------------------------------------------------------------- */
/* MESSAGE GUIDES                                                             */
/* -------------------------------------------------------------------------- */

const MESSAGE_GUIDE = {
  CODE_GENERATION:
    "Concise Markdown describing what was built, the files created, and how it works.",

  PROGRAM_GENERATION:
    "Concise Markdown describing the standalone program, its file, and how to run it.",

  DEBUGGING: "Concise Markdown with Root cause, Fix, and How to verify.",

  OPTIMIZATION: "Concise Markdown with What changed and any tradeoffs.",

  CONVERSION:
    "Concise Markdown describing what was converted and anything that did not map 1:1.",

  CODE_REVIEW: "Concise Markdown review with issues, causes, and fixes.",

  CODE_EXPLANATION:
    "Concise Markdown walkthrough explaining execution order and data flow.",

  DOCUMENTATION: "Concise Markdown summary of the documentation.",
};

/* -------------------------------------------------------------------------- */
/* SCHEMAS                                                                    */
/* -------------------------------------------------------------------------- */

const webSchema = () => `{
  "intent": "CODE_GENERATION",
  "message": "Concise description of the website.",
  "files": [
    {
      "path": "index.html",
      "language": "html",
      "content": "complete HTML"
    },
    {
      "path": "style.css",
      "language": "css",
      "content": "complete CSS"
    },
    {
      "path": "script.js",
      "language": "javascript",
      "content": "complete JavaScript"
    }
  ]
}`;

const programSchema = (language = "javascript") => `{
  "intent": "PROGRAM_GENERATION",
  "message": "Concise explanation of the standalone program.",
  "files": [
    {
      "path": "<meaningful filename.${language === "javascript" ? "js" : language === "python" ? "py" : language === "cpp" ? "cpp" : language}>",
      "language": "${language}",
      "content": "<complete working standalone source code>"
    }
  ]
}`;

const chatSchema = (intent) => `{
  "intent": "${intent}",
  "message": "${MESSAGE_GUIDE[intent]}"
}`;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const clip = (s = "", n = 500) => (s.length > n ? s.slice(0, n) + "…" : s);

/* -------------------------------------------------------------------------- */
/* LOCAL INTENT DETECTION                                                     */
/* -------------------------------------------------------------------------- */

function detectExplicitMode(userPrompt = "") {
  const prompt = userPrompt.toLowerCase();

  const asksForWeb = WEB_HINT.test(prompt);
  const asksForStandalone = STANDALONE_HINT.test(prompt);

  // Standalone programming request wins.
  if (asksForStandalone) {
    return "PROGRAM";
  }

  // Explicit web request.
  if (asksForWeb) {
    return "WEB";
  }

  // Explicit HTML/CSS/browser request.
  if (HTML_HINT.test(prompt)) {
    return "WEB";
  }

  return null;
}
/* -------------------------------------------------------------------------- */
/* BUILD PROMPT                                                              */
/* -------------------------------------------------------------------------- */

const buildPrompt = (intent, userPrompt, history = []) => {
  const parts = [CORE];

  const explicitMode = detectExplicitMode(userPrompt);

  /* ------------------------------------------------------------------------ */
  /* PROGRAM                                                                  */
  /* ------------------------------------------------------------------------ */

  if (intent === "PROGRAM_GENERATION" || explicitMode === "PROGRAM") {
    parts.push(PROGRAM_BUILD);
    parts.push(RULES);
    parts.push(JSON_ONLY);

    parts.push(
      "IMPORTANT PROGRAM RULES:\n" +
        "- Generate ONLY the requested program.\n" +
        "- Prefer ONE source file for simple tasks.\n" +
        "- Do not generate HTML/CSS unless explicitly requested.\n" +
        "- Do not generate a UI.\n" +
        "- Do not generate index.html.\n" +
        "- If the user asks for JavaScript, use a .js file.\n" +
        "- If the user asks for Python, use a .py file.\n" +
        "- If the user asks for C++, use a .cpp file.\n" +
        "- Choose a meaningful filename based on the task.",
    );

    parts.push("Schema:\n" + programSchema(detectLanguage(userPrompt)));
  } else if (intent === "CODE_GENERATION" && explicitMode === "WEB") {
    /* ------------------------------------------------------------------------ */
    /* WEB                                                                      */
    /* ------------------------------------------------------------------------ */
    parts.push(WEB_BUILD);
    parts.push(DESIGN);
    parts.push(RULES);
    parts.push(JSON_ONLY);

    parts.push("Schema:\n" + webSchema("CODE_GENERATION"));
  } else if (intent === "CODE_GENERATION") {
    /* ------------------------------------------------------------------------ */
    /* CODE GENERATION WITHOUT EXPLICIT WEB REQUEST                             */
    /* ------------------------------------------------------------------------ */
    parts.push(
      "This is a general code generation request. " +
        "Do NOT assume that it is a web project. " +
        "Only generate HTML/CSS/browser UI if the user explicitly asks for a web interface.",
    );

    parts.push(RULES);
    parts.push(JSON_ONLY);

    parts.push("Schema:\n" + programSchema(detectLanguage(userPrompt)));
  } else if (FILE_INTENTS.has(intent)) {
    /* ------------------------------------------------------------------------ */
    /* OTHER FILE INTENTS                                                       */
    /* ------------------------------------------------------------------------ */
    parts.push(RULES);
    parts.push(JSON_ONLY);

    parts.push(
      "The user requested a coding task. " +
        "Do not create HTML/CSS unless the request explicitly requires a web interface.",
    );

    parts.push("Schema:\n" + programSchema(detectLanguage(userPrompt)));
  } else {
    /* ------------------------------------------------------------------------ */
    /* CHAT INTENTS                                                             */
    /* ------------------------------------------------------------------------ */
    parts.push(JSON_ONLY);

    parts.push("Schema:\n" + chatSchema(intent));
  }

  /* ------------------------------------------------------------------------ */
  /* HISTORY                                                                  */
  /* ------------------------------------------------------------------------ */
  if (history.length) {
    const recent = history
      .slice(-2)
      .map((h) => `${h.role}: ${clip(h.content, 250)}`)
      .join("\n");

    parts.push("Relevant recent context:\n" + recent);
  }

  parts.push("Request:\n" + userPrompt);

  return parts.join("\n\n");
};

/* -------------------------------------------------------------------------- */
/* LANGUAGE DETECTION                                                         */
/* -------------------------------------------------------------------------- */

function detectLanguage(prompt = "") {
  const p = prompt.toLowerCase();

  if (/\bpython\b/.test(p)) {
    return "python";
  }

  if (/\bc\+\+\b|\bcpp\b/.test(p)) {
    return "cpp";
  }

  if (/\bjava\b/.test(p) && !/\bjavascript\b/.test(p)) {
    return "java";
  }

  if (/\btypescript\b|\bts\b/.test(p)) {
    return "typescript";
  }

  return "javascript";
}

/* -------------------------------------------------------------------------- */
/* JSON SANITIZER                                                             */
/* -------------------------------------------------------------------------- */

function sanitizeJson(raw) {
  if (typeof raw !== "string") {
    return null;
  }

  let cleaned = raw.trim();

  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first === -1 || last === -1 || last <= first) {
    return null;
  }

  cleaned = cleaned.slice(first, last + 1);

  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    return null;
  }
}

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

/* -------------------------------------------------------------------------- */
/* MODEL FALLBACK                                                             */
/* -------------------------------------------------------------------------- */

async function invokeCodingModel(prompt) {
  const primary = getModel("coding");

  try {
    console.log("[codingAgent] using primary coding model");

    return await primary.invoke(prompt);
  } catch (error) {
    if (!isTemporaryModelError(error)) {
      throw error;
    }

    console.warn("[codingAgent] primary unavailable, switching to fallback");

    const fallback = getModel("codingFallback");

    console.log("[codingAgent] using Gemini coding fallback");

    return await fallback.invoke(prompt);
  }
}

/* -------------------------------------------------------------------------- */
/* CODING AGENT                                                               */
/* -------------------------------------------------------------------------- */

export const codingAgent = async (state) => {
  try {
    const userPrompt = state.prompt;

    /* ---------------------------------------------------------------------- */
    /* Explicit mode first                                                     */
    /* ---------------------------------------------------------------------- */

    const explicitMode = detectExplicitMode(userPrompt);

    /* ---------------------------------------------------------------------- */
    /* LLM intent classification                                               */
    /* ---------------------------------------------------------------------- */

    let intent;

    if (explicitMode === "PROGRAM") {
      intent = "PROGRAM_GENERATION";

      console.log("[codingAgent] explicit standalone program detected");
    } else if (explicitMode === "WEB") {
      /*
       * Explicit web request.
       */
      intent = "CODE_GENERATION";

      console.log("[codingAgent] explicit web project detected");
    } else {
      /*
       * Otherwise ask the intent model.
       */
      const intentLlm = getModel("intent");

      const intentRes = await intentLlm.invoke(
        `Classify the coding request.

Reply with ONE exact value and nothing else:

${INTENTS.join("\n")}

Important:
- PROGRAM_GENERATION = standalone program, script, algorithm, function, console application.
- CODE_GENERATION = website, webpage, frontend, UI, HTML/CSS project.
- Do NOT classify a standalone program as CODE_GENERATION.

Request:
${userPrompt}`,
      );

      const rawIntent = intentRes.content?.trim().toUpperCase();

      intent = INTENTS.includes(rawIntent) ? rawIntent : "PROGRAM_GENERATION";
    }

    console.log(`[codingAgent] intent=${intent}`);

    /* ---------------------------------------------------------------------- */
    /* Build prompt                                                            */
    /* ---------------------------------------------------------------------- */

    const prompt = buildPrompt(intent, userPrompt, state.history);

    /* ---------------------------------------------------------------------- */
    /* Invoke model                                                            */
    /* ---------------------------------------------------------------------- */

    const result = await invokeCodingModel(prompt);

    const rawContent =
      typeof result.content === "string"
        ? result.content
        : JSON.stringify(result.content);

    /* ---------------------------------------------------------------------- */
    /* Parse                                                                   */
    /* ---------------------------------------------------------------------- */

    const clean = sanitizeJson(rawContent);

    if (!clean) {
      console.error("[codingAgent] invalid JSON from model", {
        intent,
        length: rawContent?.length,
        start: rawContent?.slice(0, 500),
        end: rawContent?.slice(-500),
      });

      return {
        aiResponse:
          "I generated a response, but its format was invalid. Please try again.",

        artifacts: [],

        routerMeta: {
          ...(state.routerMeta ?? {}),
          codingIntent: intent,
          parseError: true,
        },
      };
    }

    const parsed = JSON.parse(clean);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Coding model returned invalid response object");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate files                                                          */
    /* ---------------------------------------------------------------------- */

    let files = Array.isArray(parsed.files)
      ? parsed.files.filter(
          (file) =>
            file &&
            typeof file.path === "string" &&
            typeof file.content === "string",
        )
      : [];

    /* ---------------------------------------------------------------------- */
    /* Safety correction                                                       */
    /* ---------------------------------------------------------------------- */

    /*
     * If this is a standalone program, NEVER allow
     * the model to sneak index.html/style.css into the artifact.
     */
    if (intent === "PROGRAM_GENERATION") {
      files = files.filter((file) => {
        const name = file.path.toLowerCase();

        const forbiddenWebFiles = [
          "index.html",
          "style.css",
          "styles.css",
          "script.html",
        ];

        return !forbiddenWebFiles.includes(name);
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Build artifact                                                          */
    /* ---------------------------------------------------------------------- */

    const artifacts = files.length
      ? [
          {
            id: Date.now(),
            type: intent,
            files: files.map((file) => ({
              name: file.path,
              content: file.content,
            })),
          },
        ]
      : [];

    console.log(`[codingAgent] success intent=${intent} files=${files.length}`);

    return {
      aiResponse: parsed.message || "Code generated successfully.",

      artifacts,

      routerMeta: {
        ...(state.routerMeta ?? {}),
        codingIntent: intent,
        parseError: false,
      },
    };
  } catch (error) {
    console.error("[codingAgent] fatal error:", error);

    return {
      aiResponse:
        "The coding agent is temporarily unavailable. Please try again in a moment.",

      artifacts: [],

      routerMeta: {
        ...(state.routerMeta ?? {}),
        codingError: true,
        errorStatus: error?.status ?? error?.statusCode ?? error?.code ?? null,
      },
    };
  }
};
