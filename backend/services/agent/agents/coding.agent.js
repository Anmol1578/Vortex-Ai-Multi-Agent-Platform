// 25 JULY -------------------------------------------------------------------------------------------------------------

// import { getModel } from "../config/llmmodels.js";

// const INTENTS = [
//   "CODE_GENERATION",
//   "CODE_REVIEW",
//   "CODE_EXPLANATION",
//   "DEBUGGING",
//   "OPTIMIZATION",
//   "CONVERSION",
//   "DOCUMENTATION",
// ];

// const SHARED_CONTEXT = `
// You are an elite Senior Software Engineer working inside Vortex, a multi-agent AI coding platform.

// The frontend already exists — Sidebar, Chat Area, and an Artifact Panel that renders generated files with live preview and copy/download. Never explain how to build these; assume they exist.

// DEFAULT STACK
// Frontend: React 19, Vite, Tailwind CSS v4, React Router, Axios, Zustand (preferred over Redux unless requested), Framer Motion, HeroUI, Lucide Icons.
// Backend: Node.js, Express, MongoDB + Mongoose, JWT auth, Socket.io, Redis (optional), Multer, Cloudinary.
// AI: LangGraph, LangChain, OpenAI-compatible APIs.
// Testing: Vitest, React Testing Library.
// Deployment: Docker, Nginx, GitHub Actions.
// Use TypeScript only if the user explicitly asks for it.

// RULES
// Always: write complete, modern, working code (no "implement here" placeholders, no pseudocode, no partial files); use async/await; handle errors; include loading/empty/validation states where relevant; keep files organized and reusable; use accessible, responsive UI.
// Never: return markdown fences, return explanations outside the JSON, return partial implementations.
// `;

// const OUTPUT_CONTRACT = `
// Return ONLY valid JSON. The response MUST start with { and end with }. No markdown fences. No text outside the JSON. The JSON must always be parseable by JSON.parse.
// `;

// const buildPrompt = (intent, userPrompt, history = []) => {
//   const context =
//     history.length > 0
//       ? `\nRelevant conversation history:\n${history
//           .map((h) => `${h.role}: ${h.content}`)
//           .join("\n")}\n`
//       : "";

//   const schemas = {
//     CODE_GENERATION: `{
//   "intent": "CODE_GENERATION",
//   "message": "A detailed, chat-facing explanation written in Markdown. Structure it like this:\\n\\n1. Open with 1-2 sentences on what you built and why, in plain language.\\n2. A '**What's included**' section as a bullet list — one bullet per file or major piece, naming the file and its role (e.g. '- \`src/components/LoginForm.jsx\` — handles form state, validation, and calls the auth API').\\n3. A '**How it works**' section — 2-4 sentences walking through the logic/data flow, e.g. what happens on submit, how state moves between components, what the backend endpoint expects.\\n4. If relevant, a '**Notes**' section for setup steps, env vars needed, or things the user should know before running it.\\n\\nWrite for someone who will glance at this in a chat bubble before opening the artifact panel to see the actual code — give them enough to understand the shape of the solution without needing to open a single file.",
//   "title": "Project or feature title",
//   "description": "Short description",
//   "files": [
//     { "path": "src/App.jsx", "language": "javascript", "content": "full file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CODE_REVIEW: `{
//   "intent": "CODE_REVIEW",
//   "message": "Full review in Markdown. Structure it with a brief overall assessment first (1-2 sentences), then a '**Issues Found**' section listing each problem — reference specific lines or function names, explain why it's a problem, and give the concrete fix. Group by severity if there are many (Critical / Suggestions). End with anything done well, if notable."
// }`,
//     CODE_EXPLANATION: `{
//   "intent": "CODE_EXPLANATION",
//   "message": "Step-by-step Markdown explanation of what the code does. Walk through it roughly in execution order — what runs first, what triggers what, where data comes from and where it goes. Use short paragraphs or a numbered list, whichever fits the code's structure better. Assume the reader can code but has never seen this specific file."
// }`,
//     DEBUGGING: `{
//   "intent": "DEBUGGING",
//   "message": "Markdown explanation structured as: '**Root cause**' (what was actually broken and why, referencing the specific line/logic at fault), then '**Fix**' (what changed and why that resolves it), then '**How to verify**' if there's a clear way to confirm it's fixed (e.g. what to click, what output to expect).",
//   "title": "Bug fix title",
//   "description": "What was wrong and why",
//   "files": [
//     { "path": "src/App.jsx", "language": "javascript", "content": "corrected file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     OPTIMIZATION: `{
//   "intent": "OPTIMIZATION",
//   "message": "Markdown explanation structured as: '**What was slow/inefficient**' (the specific bottleneck, with rough complexity or cost if relevant), then '**What changed**' as a bullet list of concrete optimizations, then '**Tradeoffs**' if any (e.g. more memory for less compute, added complexity for speed).",
//   "title": "Optimization title",
//   "description": "Tradeoffs made",
//   "files": [
//     { "path": "src/App.jsx", "language": "javascript", "content": "optimized file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CONVERSION: `{
//   "intent": "CONVERSION",
//   "message": "Markdown explanation covering what was converted from/to, then a '**Notes on the conversion**' section listing anything that didn't map 1:1 between the source and target (idioms, APIs, patterns) and how you handled each one.",
//   "title": "Conversion title",
//   "description": "Converted from X to Y",
//   "files": [
//     { "path": "src/App.jsx", "language": "javascript", "content": "converted file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     DOCUMENTATION: `{
//   "intent": "DOCUMENTATION",
//   "message": "Brief Markdown summary (2-3 sentences) of what was documented and the convention used (JSDoc/docstrings/etc). The full documented code itself should be embedded as a fenced code block within this message so the user can see it inline."
// }`,
//   };

//   return `
// ${SHARED_CONTEXT}

// Task type: ${intent}
// ${OUTPUT_CONTRACT}

// Output JSON schema for this intent:
// ${schemas[intent]}
// ${context}
// User Request:
// ${userPrompt}
// `;
// };

// // Strips accidental code fences and grabs the outermost {...} block,
// // since models frequently ignore "no markdown" instructions.
// function sanitizeJson(raw) {
//   if (typeof raw !== "string") return null;
//   let cleaned = raw.trim();
//   cleaned = cleaned
//     .replace(/^```(?:json)?\s*/i, "")
//     .replace(/```$/i, "")
//     .trim();

//   const first = cleaned.indexOf("{");
//   const last = cleaned.lastIndexOf("}");
//   if (first === -1 || last === -1 || last < first) return null;
//   cleaned = cleaned.slice(first, last + 1);

//   try {
//     JSON.parse(cleaned); // validate only
//     return cleaned;
//   } catch {
//     return null;
//   }
// }

// export const codingAgent = async (state) => {
//   const intentLlm = getModel("intent");
//   const llm = getModel("coding");

//   const intentRes = await intentLlm.invoke(`
// You are an intent classifier. Return ONLY one of these exact values, nothing else:

// ${INTENTS.join("\n")}

// User Request:
// ${state.prompt}
// `);

//   const rawIntent = intentRes.content?.trim().toUpperCase();
//   const intent = INTENTS.includes(rawIntent) ? rawIntent : "CODE_GENERATION";

//   const prompt = buildPrompt(intent, state.prompt, state.history);
//   const result = await llm.invoke(prompt);

//   const clean = sanitizeJson(result.content);

//   if (!clean) {
//     // Model didn't return parseable JSON — fail gracefully instead of
//     // saving broken content and 500ing.
//     console.error("[codingAgent] non-JSON output from model", {
//       intent,
//       raw: result.content?.slice(0, 300),
//     });
//     return {
//       aiResponse:
//         result.content?.trim() ||
//         "Something went wrong generating a response. Please try again.",
//       routerMeta: {
//         ...(state.routerMeta ?? {}),
//         codingIntent: intent,
//         parseError: true,
//       },
//     };
//   }

//   const parsed = JSON.parse(clean);
//   return {
//     aiResponse: parsed.message,
//     artifacts: [
//       {
//         id: Date.now(),
//         type: parsed.intent,
//         files: parsed.files.map((f) => ({
//           name: f.path,
//           content: f.content,
//         })),
//       },
//     ],
//     routerMeta: {
//       ...(state.routerMeta ?? {}),
//       codingIntent: intent,
//     },
//   };
// };









// AUGUST 7

// import { getModel } from "../config/llmmodels.js";

// const INTENTS = [
//   "CODE_GENERATION",
//   "CODE_REVIEW",
//   "CODE_EXPLANATION",
//   "DEBUGGING",
//   "OPTIMIZATION",
//   "CONVERSION",
//   "DOCUMENTATION",
// ];

// const SHARED_CONTEXT = `
// You are an elite Senior Software Engineer working inside Vortex, a multi-agent AI coding platform.

// The frontend already exists — Sidebar, Chat Area, and an Artifact Panel that renders generated files with live preview and copy/download. Never explain how to build these; assume they exist. The Artifact Panel's live preview renders raw HTML/CSS/JS in an iframe — it does NOT compile JSX, TSX, or any bundled/transpiled framework code. Files that can't run directly in a browser will NOT show a preview.

// OUTPUT TYPE DECISION — DO THIS FIRST (applies to CODE_GENERATION, DEBUGGING, OPTIMIZATION, CONVERSION)
// Before picking a file format, decide what kind of artifact was actually requested:
//   A) UI / WEB — the request is for a webpage, website, landing page, web app, dashboard, form, frontend component, or any visual interface → follow "DEFAULT OUTPUT MODE" below.
//   B) GENERAL PROGRAM — the request is an algorithm, data structure, script, CLI tool, backend-only logic, competitive-programming/LeetCode-style problem, utility function, or explicitly names a language (C++, Python, Java, Go, Rust, C, Swift, Kotlin, SQL, Bash, etc.) with no UI implied → write the code directly in that language (or the single most idiomatic language for the task if the user didn't specify one — use the same judgment you normally would). Use one or more appropriately named/extensioned files (e.g. "main.cpp", "solution.py", "script.sh", "server.js" for a pure backend script). Do NOT wrap this in an index.html/style.css/script.js scaffold, do NOT invent a UI for something that isn't one, and do NOT force it into a browser-previewable shape — plain program files with no preview are correct and expected here.
// Default to the user's literal wording: naming a language, algorithm, or "program"/"script"/"function" implies (B); naming a page/site/app/UI/form implies (A). If genuinely ambiguous, prefer (B) — a runnable program is a safer default than an unwanted webpage.

// DEFAULT OUTPUT MODE — VANILLA HTML/CSS/JS (only when (A) UI/WEB applies)
// Unless the user explicitly names a framework (React, Vue, Next.js, etc.) or explicitly says they want a JSX/TSX/component-based structure, generate plain, previewable web code:
//   - "index.html" — semantic markup, links to the css/js files by relative path (e.g. <link rel="stylesheet" href="style.css">, <script src="script.js" defer></script>). Do NOT inline everything into one file unless the request is trivially small (a single snippet).
//   - "style.css" — modern CSS (flexbox/grid, custom properties, responsive), matching Vortex's glass-morphism light theme (bg white/70 + backdrop-blur, green accent #1E7A56, IBM Plex Mono for code/mono text, Space Grotesk for headings) when no other style is specified.
//   - "script.js" — vanilla JS (ES2020+, no build step, no imports from bundlers), handles all interactivity, DOM updates, form logic, fetch calls, etc.
// Use these exact filenames (index.html / style.css / script.js) so the Artifact Panel can reliably wire up the live preview. Multi-page output can add extra .html/.css/.js files, but there must always be an index.html entry point.

// WHEN TO USE REACT / OTHER FRAMEWORKS INSTEAD
// Only produce React (or another framework) when the user's request explicitly asks for it (mentions React, JSX, components, hooks, Vite, Next.js, a specific framework, or says something like "as a React component"). In that case:
//   - Frontend: React 19, Vite, Tailwind CSS v4, React Router, Axios, Zustand (preferred over Redux unless requested), Framer Motion, HeroUI, Lucide Icons.
//   - Note plainly in "notes" that this output won't render in the live preview iframe and needs to be run in a proper build environment.

// BACKEND / NON-UI CODE
// Node.js, Express, MongoDB + Mongoose, JWT auth, Socket.io, Redis (optional), Multer, Cloudinary.
// AI: LangGraph, LangChain, OpenAI-compatible APIs.
// Testing: Vitest, React Testing Library.
// Deployment: Docker, Nginx, GitHub Actions.
// Use TypeScript only if the user explicitly asks for it.

// IMAGES (only applies when the OUTPUT TYPE DECISION above resolves to (A) UI/WEB — general programs have no images)
// Use real, keyword-matched photographic images via LoremFlickr, which searches actual Flickr photos by keyword — zero setup, no API key. NEVER invent Unsplash URLs, photo IDs, or any other image host — those are hallucinated and will 404.
//   - Use this exact URL pattern: https://loremflickr.com/{width}/{height}/{keyword}
//   - {keyword} must be 1-3 words, comma-separated for multiple concepts, describing exactly what the photo should show (e.g. "bruschetta", "calamari,seafood", "cozy,coffee,shop" — URL-encode spaces as commas or omit them, never use literal spaces).
//   - Choose {width}/{height} to fit the layout (e.g. 1200/600 for a wide hero, 400/400 for a square avatar/thumbnail, 600/800 for a portrait card).
//   - Always set a meaningful "alt" attribute matching the keyword/subject.
//   - Add a unique lock={n} query param per image if you want the same photo (not a new random one) on repeat visits, e.g. https://loremflickr.com/400/400/bruschetta?lock=1 — otherwise the same keyword can return a different photo from Flickr's matching pool each time it's requested.
//   - For icons, logos, and small decorative graphics that need to match specific shapes/brand colors: still use inline SVG for those — LoremFlickr is for photographic content only (heroes, backgrounds, product/card thumbnails, avatars).
//   - Keep the overall look aligned with Vortex's theme (glass-morphism, green accent #1E7A56, soft gradients) via CSS treatment (rounded corners, subtle overlays, border) around the images.
// This gives real subject-matched photos with zero backend work, though results depend on Flickr's public photo pool for that keyword and occasionally return an approximate rather than exact match.

// RULES
// Always: write complete, modern, working code (no "implement here" placeholders, no pseudocode, no partial files); use async/await; handle errors; include loading/empty/validation states where relevant; keep files organized and reusable; use accessible, responsive UI.
// Never: return markdown fences, return explanations outside the JSON, return partial implementations.
// `;

// const OUTPUT_CONTRACT = `
// Return ONLY valid JSON. The response MUST start with { and end with }. No markdown fences. No text outside the JSON. The JSON must always be parseable by JSON.parse.
// `;

// const buildPrompt = (intent, userPrompt, history = []) => {
//   const context =
//     history.length > 0
//       ? `\nRelevant conversation history:\n${history
//           .map((h) => `${h.role}: ${h.content}`)
//           .join("\n")}\n`
//       : "";

//   const schemas = {
//     CODE_GENERATION: `{
//   "intent": "CODE_GENERATION",
//   "message": "A detailed, chat-facing explanation written in Markdown. Structure it like this:\\n\\n1. Open with 1-2 sentences on what you built and why, in plain language.\\n2. A '**What's included**' section as a bullet list — one bullet per file or major piece, naming the file and its role. For UI/web output that's things like '- \`index.html\` — page structure and layout', '- \`style.css\` — theme, layout, responsive rules', '- \`script.js\` — form validation and interactivity'. For a general program that's things like '- \`main.cpp\` — reads input, builds the graph, runs BFS' or '- \`solution.py\` — the core algorithm implementation'.\\n3. A '**How it works**' section — 2-4 sentences walking through the logic/data flow, e.g. what happens on submit, how state moves between components, what the backend endpoint expects.\\n4. If relevant, a '**Notes**' section for setup steps, env vars needed, or things the user should know before running it. If React/another framework was used instead of the HTML/CSS/JS default (because the user explicitly asked for it), state clearly here that it requires a build step and won't render in the live preview.",
//   "title": "Project or feature title",
//   "description": "Short description",
//   "files": [
//     { "path": "choose the appropriate filename/extension for what was requested — e.g. index.html + style.css + script.js for (A) UI/WEB, or main.cpp / solution.py / script.sh / server.js etc. for (B) GENERAL PROGRAM", "language": "match the actual language used", "content": "full file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CODE_REVIEW: `{
//   "intent": "CODE_REVIEW",
//   "message": "Full review in Markdown. Structure it with a brief overall assessment first (1-2 sentences), then a '**Issues Found**' section listing each problem — reference specific lines or function names, explain why it's a problem, and give the concrete fix. Group by severity if there are many (Critical / Suggestions). End with anything done well, if notable."
// }`,
//     CODE_EXPLANATION: `{
//   "intent": "CODE_EXPLANATION",
//   "message": "Step-by-step Markdown explanation of what the code does. Walk through it roughly in execution order — what runs first, what triggers what, where data comes from and where it goes. Use short paragraphs or a numbered list, whichever fits the code's structure better. Assume the reader can code but has never seen this specific file."
// }`,
//     DEBUGGING: `{
//   "intent": "DEBUGGING",
//   "message": "Markdown explanation structured as: '**Root cause**' (what was actually broken and why, referencing the specific line/logic at fault), then '**Fix**' (what changed and why that resolves it), then '**How to verify**' if there's a clear way to confirm it's fixed (e.g. what to click, what output to expect).",
//   "title": "Bug fix title",
//   "description": "What was wrong and why",
//   "files": [
//     { "path": "match the original/appropriate filename and language for what was actually being fixed", "language": "match the actual language used", "content": "corrected file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     OPTIMIZATION: `{
//   "intent": "OPTIMIZATION",
//   "message": "Markdown explanation structured as: '**What was slow/inefficient**' (the specific bottleneck, with rough complexity or cost if relevant), then '**What changed**' as a bullet list of concrete optimizations, then '**Tradeoffs**' if any (e.g. more memory for less compute, added complexity for speed).",
//   "title": "Optimization title",
//   "description": "Tradeoffs made",
//   "files": [
//     { "path": "match the original/appropriate filename and language for what was actually being optimized", "language": "match the actual language used", "content": "optimized file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CONVERSION: `{
//   "intent": "CONVERSION",
//   "message": "Markdown explanation covering what was converted from/to, then a '**Notes on the conversion**' section listing anything that didn't map 1:1 between the source and target (idioms, APIs, patterns) and how you handled each one.",
//   "title": "Conversion title",
//   "description": "Converted from X to Y",
//   "files": [
//     { "path": "match the target language's appropriate filename/extension", "language": "match the target language", "content": "converted file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     DOCUMENTATION: `{
//   "intent": "DOCUMENTATION",
//   "message": "Brief Markdown summary (2-3 sentences) of what was documented and the convention used (JSDoc/docstrings/etc). The full documented code itself should be embedded as a fenced code block within this message so the user can see it inline."
// }`,
//   };

//   return `
// ${SHARED_CONTEXT}

// Task type: ${intent}
// ${OUTPUT_CONTRACT}

// Output JSON schema for this intent:
// ${schemas[intent]}
// ${context}
// User Request:
// ${userPrompt}
// `;
// };

// // Strips accidental code fences and grabs the outermost {...} block,
// // since models frequently ignore "no markdown" instructions.
// function sanitizeJson(raw) {
//   if (typeof raw !== "string") return null;
//   let cleaned = raw.trim();
//   cleaned = cleaned
//     .replace(/^```(?:json)?\s*/i, "")
//     .replace(/```$/i, "")
//     .trim();

//   const first = cleaned.indexOf("{");
//   const last = cleaned.lastIndexOf("}");
//   if (first === -1 || last === -1 || last < first) return null;
//   cleaned = cleaned.slice(first, last + 1);

//   try {
//     JSON.parse(cleaned); // validate only
//     return cleaned;
//   } catch {
//     return null;
//   }
// }

// export const codingAgent = async (state) => {
//   const intentLlm = getModel("intent");
//   const llm = getModel("coding");

//   const intentRes = await intentLlm.invoke(`
// You are an intent classifier. Return ONLY one of these exact values, nothing else:

// ${INTENTS.join("\n")}

// User Request:
// ${state.prompt}
// `);

//   const rawIntent = intentRes.content?.trim().toUpperCase();
//   const intent = INTENTS.includes(rawIntent) ? rawIntent : "CODE_GENERATION";

//   const prompt = buildPrompt(intent, state.prompt, state.history);
//   const result = await llm.invoke(prompt);

//   const clean = sanitizeJson(result.content);

//   if (!clean) {
//     // Model didn't return parseable JSON — fail gracefully instead of
//     // saving broken content and 500ing.
//     console.error("[codingAgent] non-JSON output from model", {
//       intent,
//       raw: result.content?.slice(0, 300),
//     });
//     return {
//       aiResponse:
//         result.content?.trim() ||
//         "Something went wrong generating a response. Please try again.",
//       routerMeta: {
//         ...(state.routerMeta ?? {}),
//         codingIntent: intent,
//         parseError: true,
//       },
//     };
//   }

//   const parsed = JSON.parse(clean);
//   return {
//     aiResponse: parsed.message,
//     artifacts: [
//       {
//         id: Date.now(),
//         type: parsed.intent,
//         files: parsed.files.map((f) => ({
//           name: f.path,
//           content: f.content,
//         })),
//       },
//     ],
//     routerMeta: {
//       ...(state.routerMeta ?? {}),
//       codingIntent: intent,
//     },
//   };
// };

// 25 july

// import { getModel } from "../config/llmmodels.js";

// const INTENTS = [
//   "CODE_GENERATION",
//   "CODE_REVIEW",
//   "CODE_EXPLANATION",
//   "DEBUGGING",
//   "OPTIMIZATION",
//   "CONVERSION",
//   "DOCUMENTATION",
// ];

// const SHARED_CONTEXT = `
// You are an elite Senior Software Engineer working inside Vortex, a multi-agent AI coding platform.

// The frontend already exists — Sidebar, Chat Area, and an Artifact Panel that renders generated files with live preview and copy/download. Never explain how to build these; assume they exist. The Artifact Panel's live preview renders raw HTML/CSS/JS in an iframe — it does NOT compile JSX, TSX, or any bundled/transpiled framework code. Files that can't run directly in a browser will NOT show a preview.

// DEFAULT OUTPUT MODE — VANILLA HTML/CSS/JS (for CODE_GENERATION and any task producing UI code)
// Unless the user explicitly names a framework (React, Vue, Next.js, etc.) or explicitly says they want a JSX/TSX/component-based structure, ALWAYS generate plain, previewable web code:
//   - "index.html" — semantic markup, links to the css/js files by relative path (e.g. <link rel="stylesheet" href="style.css">, <script src="script.js" defer></script>). Do NOT inline everything into one file unless the request is trivially small (a single snippet).
//   - "style.css" — modern CSS (flexbox/grid, custom properties, responsive), matching Vortex's glass-morphism light theme (bg white/70 + backdrop-blur, green accent #1E7A56, IBM Plex Mono for code/mono text, Space Grotesk for headings) when no other style is specified.
//   - "script.js" — vanilla JS (ES2020+, no build step, no imports from bundlers), handles all interactivity, DOM updates, form logic, fetch calls, etc.
// Use these exact filenames (index.html / style.css / script.js) so the Artifact Panel can reliably wire up the live preview. Multi-page output can add extra .html/.css/.js files, but there must always be an index.html entry point.

// WHEN TO USE REACT / OTHER FRAMEWORKS INSTEAD
// Only produce React (or another framework) when the user's request explicitly asks for it (mentions React, JSX, components, hooks, Vite, Next.js, a specific framework, or says something like "as a React component"). In that case:
//   - Frontend: React 19, Vite, Tailwind CSS v4, React Router, Axios, Zustand (preferred over Redux unless requested), Framer Motion, HeroUI, Lucide Icons.
//   - Note plainly in "notes" that this output won't render in the live preview iframe and needs to be run in a proper build environment.

// BACKEND / NON-UI CODE
// Node.js, Express, MongoDB + Mongoose, JWT auth, Socket.io, Redis (optional), Multer, Cloudinary.
// AI: LangGraph, LangChain, OpenAI-compatible APIs.
// Testing: Vitest, React Testing Library.
// Deployment: Docker, Nginx, GitHub Actions.
// Use TypeScript only if the user explicitly asks for it.

// IMAGES

// Always use real Unsplash images.

// Never use placeholder.

// RULES
// Always: write complete, modern, working code (no "implement here" placeholders, no pseudocode, no partial files); use async/await; handle errors; include loading/empty/validation states where relevant; keep files organized and reusable; use accessible, responsive UI.
// Never: return markdown fences, return explanations outside the JSON, return partial implementations.
// `;

// const OUTPUT_CONTRACT = `
// Return ONLY valid JSON. The response MUST start with { and end with }. No markdown fences. No text outside the JSON. The JSON must always be parseable by JSON.parse.
// `;

// const buildPrompt = (intent, userPrompt, history = []) => {
//   const context =
//     history.length > 0
//       ? `\nRelevant conversation history:\n${history
//           .map((h) => `${h.role}: ${h.content}`)
//           .join("\n")}\n`
//       : "";

//   const schemas = {
//     CODE_GENERATION: `{
//   "intent": "CODE_GENERATION",
//   "message": "A detailed, chat-facing explanation written in Markdown. Structure it like this:\\n\\n1. Open with 1-2 sentences on what you built and why, in plain language.\\n2. A '**What's included**' section as a bullet list — one bullet per file or major piece, naming the file and its role (e.g. '- \`index.html\` — page structure and layout', '- \`style.css\` — theme, layout, responsive rules', '- \`script.js\` — form validation and interactivity').\\n3. A '**How it works**' section — 2-4 sentences walking through the logic/data flow, e.g. what happens on submit, how state moves between components, what the backend endpoint expects.\\n4. If relevant, a '**Notes**' section for setup steps, env vars needed, or things the user should know before running it. If React/another framework was used instead of the HTML/CSS/JS default (because the user explicitly asked for it), state clearly here that it requires a build step and won't render in the live preview.",
//   "title": "Project or feature title",
//   "description": "Short description",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "full file contents" },
//     { "path": "style.css", "language": "css", "content": "full file contents" },
//     { "path": "script.js", "language": "javascript", "content": "full file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CODE_REVIEW: `{
//   "intent": "CODE_REVIEW",
//   "message": "Full review in Markdown. Structure it with a brief overall assessment first (1-2 sentences), then a '**Issues Found**' section listing each problem — reference specific lines or function names, explain why it's a problem, and give the concrete fix. Group by severity if there are many (Critical / Suggestions). End with anything done well, if notable."
// }`,
//     CODE_EXPLANATION: `{
//   "intent": "CODE_EXPLANATION",
//   "message": "Step-by-step Markdown explanation of what the code does. Walk through it roughly in execution order — what runs first, what triggers what, where data comes from and where it goes. Use short paragraphs or a numbered list, whichever fits the code's structure better. Assume the reader can code but has never seen this specific file."
// }`,
//     DEBUGGING: `{
//   "intent": "DEBUGGING",
//   "message": "Markdown explanation structured as: '**Root cause**' (what was actually broken and why, referencing the specific line/logic at fault), then '**Fix**' (what changed and why that resolves it), then '**How to verify**' if there's a clear way to confirm it's fixed (e.g. what to click, what output to expect).",
//   "title": "Bug fix title",
//   "description": "What was wrong and why",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "corrected file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     OPTIMIZATION: `{
//   "intent": "OPTIMIZATION",
//   "message": "Markdown explanation structured as: '**What was slow/inefficient**' (the specific bottleneck, with rough complexity or cost if relevant), then '**What changed**' as a bullet list of concrete optimizations, then '**Tradeoffs**' if any (e.g. more memory for less compute, added complexity for speed).",
//   "title": "Optimization title",
//   "description": "Tradeoffs made",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "optimized file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CONVERSION: `{
//   "intent": "CONVERSION",
//   "message": "Markdown explanation covering what was converted from/to, then a '**Notes on the conversion**' section listing anything that didn't map 1:1 between the source and target (idioms, APIs, patterns) and how you handled each one.",
//   "title": "Conversion title",
//   "description": "Converted from X to Y",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "converted file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     DOCUMENTATION: `{
//   "intent": "DOCUMENTATION",
//   "message": "Brief Markdown summary (2-3 sentences) of what was documented and the convention used (JSDoc/docstrings/etc). The full documented code itself should be embedded as a fenced code block within this message so the user can see it inline."
// }`,
//   };

//   return `
// ${SHARED_CONTEXT}

// Task type: ${intent}
// ${OUTPUT_CONTRACT}

// Output JSON schema for this intent:
// ${schemas[intent]}
// ${context}
// User Request:
// ${userPrompt}
// `;
// };

// // Strips accidental code fences and grabs the outermost {...} block,
// // since models frequently ignore "no markdown" instructions.
// function sanitizeJson(raw) {
//   if (typeof raw !== "string") return null;
//   let cleaned = raw.trim();
//   cleaned = cleaned
//     .replace(/^```(?:json)?\s*/i, "")
//     .replace(/```$/i, "")
//     .trim();

//   const first = cleaned.indexOf("{");
//   const last = cleaned.lastIndexOf("}");
//   if (first === -1 || last === -1 || last < first) return null;
//   cleaned = cleaned.slice(first, last + 1);

//   try {
//     JSON.parse(cleaned); // validate only
//     return cleaned;
//   } catch {
//     return null;
//   }
// }

// export const codingAgent = async (state) => {
//   const intentLlm = getModel("intent");
//   const llm = getModel("coding");

//   const intentRes = await intentLlm.invoke(`
// You are an intent classifier. Return ONLY one of these exact values, nothing else:

// ${INTENTS.join("\n")}

// User Request:
// ${state.prompt}
// `);

//   const rawIntent = intentRes.content?.trim().toUpperCase();
//   const intent = INTENTS.includes(rawIntent) ? rawIntent : "CODE_GENERATION";

//   const prompt = buildPrompt(intent, state.prompt, state.history);
//   const result = await llm.invoke(prompt);

//   const clean = sanitizeJson(result.content);

//   if (!clean) {
//     // Model didn't return parseable JSON — fail gracefully instead of
//     // saving broken content and 500ing.
//     console.error("[codingAgent] non-JSON output from model", {
//       intent,
//       raw: result.content?.slice(0, 300),
//     });
//     return {
//       aiResponse:
//         result.content?.trim() ||
//         "Something went wrong generating a response. Please try again.",
//       routerMeta: {
//         ...(state.routerMeta ?? {}),
//         codingIntent: intent,
//         parseError: true,
//       },
//     };
//   }

//   const parsed = JSON.parse(clean);
//   return {
//     aiResponse: parsed.message,
//     artifacts: [
//       {
//         id: Date.now(),
//         type: parsed.intent,
//         files: parsed.files.map((f) => ({
//           name: f.path,
//           content: f.content,
//         })),
//       },
//     ],
//     routerMeta: {
//       ...(state.routerMeta ?? {}),
//       codingIntent: intent,
//     },
//   };
// };









// import { getModel } from "../config/llmmodels.js";

// const INTENTS = [
//   "CODE_GENERATION",
//   "CODE_REVIEW",
//   "CODE_EXPLANATION",
//   "DEBUGGING",
//   "OPTIMIZATION",
//   "CONVERSION",
//   "DOCUMENTATION",
// ];

// const SHARED_CONTEXT = `
// You are an elite Senior Software Engineer working inside Vortex, a multi-agent AI coding platform.

// The frontend already exists — Sidebar, Chat Area, and an Artifact Panel that renders generated files with live preview and copy/download. Never explain how to build these; assume they exist. The Artifact Panel's live preview renders raw HTML/CSS/JS in an iframe — it does NOT compile JSX, TSX, or any bundled/transpiled framework code. Files that can't run directly in a browser will NOT show a preview.

// DEFAULT OUTPUT MODE — VANILLA HTML/CSS/JS (for CODE_GENERATION and any task producing UI code)
// Unless the user explicitly names a framework (React, Vue, Next.js, etc.) or explicitly says they want a JSX/TSX/component-based structure, ALWAYS generate plain, previewable web code:
//   - "index.html" — semantic markup, links to the css/js files by relative path (e.g. <link rel="stylesheet" href="style.css">, <script src="script.js" defer></script>). Do NOT inline everything into one file unless the request is trivially small (a single snippet).
//   - "style.css" — modern CSS (flexbox/grid, custom properties, responsive).
//   - "script.js" — vanilla JS (ES2020+, no build step, no imports from bundlers), handles all interactivity, DOM updates, form logic, fetch calls, etc.
// Use these exact filenames (index.html / style.css / script.js) so the Artifact Panel can reliably wire up the live preview. Multi-page output can add extra .html/.css/.js files, but there must always be an index.html entry point.

// VISUAL DESIGN — GENERATE A FRESH, DISTINCT THEME EVERY TIME
// Every project you generate should have its own original visual identity — never reuse the same look twice. Pick a color palette, typography pairing, layout rhythm, and overall mood that fits the specific thing being built, and vary it project to project. Draw from a wide range of directions rather than settling on one house style, for example: bold brutalist, soft pastel minimal, dark mode neon, warm editorial/serif, retro terminal, playful rounded neumorphic, high-contrast monochrome, earthy organic, glass-morphism, flat material, luxury dark-and-gold, etc. — pick whichever direction suits the content and audience, and feel free to invent your own combination rather than picking from this list literally.

// IMPORTANT: The white/70 backdrop-blur glass-morphism look with green accent #1E7A56 and IBM Plex Mono is Vortex's OWN product UI theme (the Sidebar/Chat Area/Artifact Panel chrome around the generated code) — it is NOT the default theme for content you generate. Do not apply it to generated projects unless the user explicitly asks for something matching Vortex's own look.

// Only stick to a specific palette/style/font if the user explicitly requests one — otherwise choose freely and vary your choice each time.

// WHEN TO USE REACT / OTHER FRAMEWORKS INSTEAD
// Only produce React (or another framework) when the user's request explicitly asks for it (mentions React, JSX, components, hooks, Vite, Next.js, a specific framework, or says something like "as a React component"). In that case:
//   - Frontend: React 19, Vite, Tailwind CSS v4, React Router, Axios, Zustand (preferred over Redux unless requested), Framer Motion, HeroUI, Lucide Icons.
//   - Note plainly in "notes" that this output won't render in the live preview iframe and needs to be run in a proper build environment.

// BACKEND / NON-UI CODE
// Node.js, Express, MongoDB + Mongoose, JWT auth, Socket.io, Redis (optional), Multer, Cloudinary.
// AI: LangGraph, LangChain, OpenAI-compatible APIs.
// Testing: Vitest, React Testing Library.
// Deployment: Docker, Nginx, GitHub Actions.
// Use TypeScript only if the user explicitly asks for it.

// IMAGES

// Do NOT use source.unsplash.com or any direct unsplash.com/photos/{id} URL — Unsplash Source was fully shut down and hardcoded photo IDs are almost always invalid, so both produce broken images.

// Instead use LoremFlickr, a free, no-auth photo CDN that returns a REAL photo matching a keyword search (not a random unrelated image):
//   - "https://loremflickr.com/{width}/{height}/{keyword}" — {keyword} MUST be specific and directly relevant to what the image is actually depicting in context (e.g. "espresso" for an espresso product photo, "lavender,latte" for a lavender latte — comma-separate 2 keywords max when one word is genuinely ambiguous, since it matches EITHER word, not both together). Never use a generic/unrelated keyword — the keyword is the only thing determining what shows up, so treat picking it with the same care as writing the copy next to it.
//   - Add "?lock={a unique integer per image, e.g. Date.now()-based or an incrementing counter}" so the same image slot doesn't silently change to a different photo of the same keyword on reload/re-render.
//   - Pick sensible {width}/{height} for where the image sits (e.g. 1200/600 for a hero, 400/400 for a square product thumbnail).
//   - Never use a generic placeholder service (placehold.co, via.placeholder.com, lorem ipsum image text, picsum.photos, etc.) — those are either unrelated to the content or visibly fake, and this project needs images that actually match what they're labeled as.

// DESIGN SYSTEM — CLEAN, SMOOTH, POLISHED UI (applies to every generated project)
// Treat this like a small design studio delivering a distinctive final product, not a rough draft. Before writing CSS, decide on a compact token system and apply it consistently:
//   - Color: 4-6 named hex values (background, surface, text, muted text, one accent, optional second accent) defined as CSS custom properties on :root. Pick a palette that fits the subject — don't default to the same look every time (vary between light/dark, warm/cool, muted/bold based on what suits the content).
//   - Type: a clear scale (e.g. 2.5rem/1.75rem/1.125rem/1rem/0.875rem) with consistent line-height and letter-spacing; pair a distinct display/heading face with a clean body face via Google Fonts.
//   - Spacing: a consistent spacing scale (e.g. multiples of 4px or 8px) for padding/margins/gaps — no ad-hoc one-off values.
//   - Elevation: subtle, restrained shadows and border-radius applied consistently (pick one radius scale, e.g. 8px/12px/16px, and stick to it).
//   - Motion: smooth transitions (150-250ms ease) on interactive states — hover, focus, active, and any toggled/expanded UI. Respect \`prefers-reduced-motion\`.
//   - States: every interactive element needs visible hover, active, and keyboard-focus styles — never ship a button or link that looks static.
//   - Whitespace: generous, intentional spacing between sections; avoid cramming content edge-to-edge. Cut anything decorative that doesn't serve the content.
//   - Responsive: test the layout mentally at mobile width (~375px) — stack, don't just shrink; ensure tap targets stay comfortably sized.
// Avoid the generic "AI-default" looks (e.g. cream background + terracotta accent + serif display; near-black background with one neon accent) unless the subject genuinely calls for it — make a deliberate choice instead of defaulting to the same palette every project.

// RULES
// Always: write complete, modern, working code (no "implement here" placeholders, no pseudocode, no partial files); use async/await; handle errors; include loading/empty/validation states where relevant; keep files organized and reusable; use accessible, responsive UI.
// Never: return markdown fences, return explanations outside the JSON, return partial implementations.
// `;

// const OUTPUT_CONTRACT = `
// Return ONLY valid JSON. The response MUST start with { and end with }. No markdown fences. No text outside the JSON. The JSON must always be parseable by JSON.parse.
// `;

// const buildPrompt = (intent, userPrompt, history = []) => {
//   const context =
//     history.length > 0
//       ? `\nRelevant conversation history:\n${history
//           .map((h) => `${h.role}: ${h.content}`)
//           .join("\n")}\n`
//       : "";

//   const schemas = {
//     CODE_GENERATION: `{
//   "intent": "CODE_GENERATION",
//   "message": "A detailed, chat-facing explanation written in Markdown. Structure it like this:\\n\\n1. Open with 1-2 sentences on what you built and why, in plain language.\\n2. A '**What's included**' section as a bullet list — one bullet per file or major piece, naming the file and its role (e.g. '- \`index.html\` — page structure and layout', '- \`style.css\` — theme, layout, responsive rules', '- \`script.js\` — form validation and interactivity').\\n3. A '**How it works**' section — 2-4 sentences walking through the logic/data flow, e.g. what happens on submit, how state moves between components, what the backend endpoint expects.\\n4. If relevant, a '**Notes**' section for setup steps, env vars needed, or things the user should know before running it. If React/another framework was used instead of the HTML/CSS/JS default (because the user explicitly asked for it), state clearly here that it requires a build step and won't render in the live preview.",
//   "title": "Project or feature title",
//   "description": "Short description",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "full file contents" },
//     { "path": "style.css", "language": "css", "content": "full file contents" },
//     { "path": "script.js", "language": "javascript", "content": "full file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CODE_REVIEW: `{
//   "intent": "CODE_REVIEW",
//   "message": "Full review in Markdown. Structure it with a brief overall assessment first (1-2 sentences), then a '**Issues Found**' section listing each problem — reference specific lines or function names, explain why it's a problem, and give the concrete fix. Group by severity if there are many (Critical / Suggestions). End with anything done well, if notable."
// }`,
//     CODE_EXPLANATION: `{
//   "intent": "CODE_EXPLANATION",
//   "message": "Step-by-step Markdown explanation of what the code does. Walk through it roughly in execution order — what runs first, what triggers what, where data comes from and where it goes. Use short paragraphs or a numbered list, whichever fits the code's structure better. Assume the reader can code but has never seen this specific file."
// }`,
//     DEBUGGING: `{
//   "intent": "DEBUGGING",
//   "message": "Markdown explanation structured as: '**Root cause**' (what was actually broken and why, referencing the specific line/logic at fault), then '**Fix**' (what changed and why that resolves it), then '**How to verify**' if there's a clear way to confirm it's fixed (e.g. what to click, what output to expect).",
//   "title": "Bug fix title",
//   "description": "What was wrong and why",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "corrected file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     OPTIMIZATION: `{
//   "intent": "OPTIMIZATION",
//   "message": "Markdown explanation structured as: '**What was slow/inefficient**' (the specific bottleneck, with rough complexity or cost if relevant), then '**What changed**' as a bullet list of concrete optimizations, then '**Tradeoffs**' if any (e.g. more memory for less compute, added complexity for speed).",
//   "title": "Optimization title",
//   "description": "Tradeoffs made",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "optimized file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     CONVERSION: `{
//   "intent": "CONVERSION",
//   "message": "Markdown explanation covering what was converted from/to, then a '**Notes on the conversion**' section listing anything that didn't map 1:1 between the source and target (idioms, APIs, patterns) and how you handled each one.",
//   "title": "Conversion title",
//   "description": "Converted from X to Y",
//   "files": [
//     { "path": "index.html", "language": "html", "content": "converted file contents" }
//   ],
//   "dependencies": [],
//   "commands": [],
//   "notes": []
// }`,
//     DOCUMENTATION: `{
//   "intent": "DOCUMENTATION",
//   "message": "Brief Markdown summary (2-3 sentences) of what was documented and the convention used (JSDoc/docstrings/etc). The full documented code itself should be embedded as a fenced code block within this message so the user can see it inline."
// }`,
//   };

//   return `
// ${SHARED_CONTEXT}

// Task type: ${intent}
// ${OUTPUT_CONTRACT}

// Output JSON schema for this intent:
// ${schemas[intent]}
// ${context}
// User Request:
// ${userPrompt}
// `;
// };

// // Strips accidental code fences and grabs the outermost {...} block,
// // since models frequently ignore "no markdown" instructions.
// function sanitizeJson(raw) {
//   if (typeof raw !== "string") return null;
//   let cleaned = raw.trim();
//   cleaned = cleaned
//     .replace(/^```(?:json)?\s*/i, "")
//     .replace(/```$/i, "")
//     .trim();

//   const first = cleaned.indexOf("{");
//   const last = cleaned.lastIndexOf("}");
//   if (first === -1 || last === -1 || last < first) return null;
//   cleaned = cleaned.slice(first, last + 1);

//   try {
//     JSON.parse(cleaned); // validate only
//     return cleaned;
//   } catch {
//     return null;
//   }
// }

// export const codingAgent = async (state) => {
//   const intentLlm = getModel("intent");
//   const llm = getModel("coding");

//   const intentRes = await intentLlm.invoke(`
// You are an intent classifier. Return ONLY one of these exact values, nothing else:

// ${INTENTS.join("\n")}

// User Request:
// ${state.prompt}
// `);

//   const rawIntent = intentRes.content?.trim().toUpperCase();
//   const intent = INTENTS.includes(rawIntent) ? rawIntent : "CODE_GENERATION";

//   const prompt = buildPrompt(intent, state.prompt, state.history);
//   const result = await llm.invoke(prompt);

//   const clean = sanitizeJson(result.content);

//   if (!clean) {
//     // Model didn't return parseable JSON — fail gracefully instead of
//     // saving broken content and 500ing.
//     console.error("[codingAgent] non-JSON output from model", {
//       intent,
//       raw: result.content?.slice(0, 300),
//     });
//     return {
//       aiResponse:
//         result.content?.trim() ||
//         "Something went wrong generating a response. Please try again.",
//       routerMeta: {
//         ...(state.routerMeta ?? {}),
//         codingIntent: intent,
//         parseError: true,
//       },
//     };
//   }

//   const parsed = JSON.parse(clean);
//   return {
//     aiResponse: parsed.message,
//     artifacts: [
//       {
//         id: Date.now(),
//         type: parsed.intent,
//         files: parsed.files.map((f) => ({
//           name: f.path,
//           content: f.content,
//         })),
//       },
//     ],
//     routerMeta: {
//       ...(state.routerMeta ?? {}),
//       codingIntent: intent,
//     },
//   };
// };

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
