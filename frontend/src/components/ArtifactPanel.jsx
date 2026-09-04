import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  Eye,
  FileCode2,
  ChevronLeft,
  Files,
} from "lucide-react";

const MOBILE_BREAKPOINT = 768;

const EXT_BY_LANGUAGE = {
  javascript: "js",
  jsx: "jsx",
  typescript: "ts",
  tsx: "tsx",
  python: "py",
  bash: "sh",
  shell: "sh",
  sh: "sh",
  css: "css",
  html: "html",
  markup: "html",
  json: "json",
  markdown: "md",
};

const LANGUAGE_BY_EXT = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  css: "css",
  html: "markup",
  json: "json",
  md: "markdown",
  sh: "bash",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  hpp: "cpp",
  java: "java",
  go: "go",
  rs: "rust",
  rb: "ruby",
  php: "php",
  cs: "csharp",
  sql: "sql",
  yml: "yaml",
  yaml: "yaml",
  xml: "markup",
};

const ACCENT_BY_EXT = {
  js: "#F2C94C",
  jsx: "#61DAFB",
  ts: "#3178C6",
  tsx: "#3178C6",
  py: "#3776AB",
  css: "#5B9DD9",
  html: "#E36C3F",
  json: "#B0A03C",
  md: "#6B7280",
  sh: "#7C8B99",
  yml: "#CB171E",
  yaml: "#CB171E",
};

const WRAP_AFTER_CHARS = 180;

function getExt(name = "") {
  return name.split(".").pop()?.toLowerCase() || "";
}

function getAccent(name) {
  return ACCENT_BY_EXT[getExt(name)] || "#1E7A56";
}

function getLanguage(file) {
  if (file?.language) return file.language;
  const ext = file?.path?.split(".").pop()?.toLowerCase();
  return LANGUAGE_BY_EXT[ext] || "markup"; // or "clike" — never "text"
}

function normalizeArtifact(artifact) {
  if (!artifact) return [];

  if (Array.isArray(artifact.files) && artifact.files.length > 0) {
    return artifact.files.map((file) => {
      const path = file.path || file.name || "file.txt";
      return {
        ...file,
        path,
        name: file.name || path.split("/").pop(),
      };
    });
  }

  if (artifact.code) {
    const lang = (artifact.language || "text").toLowerCase();
    const ext = EXT_BY_LANGUAGE[lang] || "txt";
    const name = `snippet.${ext}`;
    return [
      {
        path: name,
        name,
        language: lang,
        content: artifact.code,
      },
    ];
  }

  return [];
}

// Escapes a string for safe use inside a RegExp constructor.
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPreviewDoc(files) {
  const html =
    files.find((f) => f.path === "index.html") ??
    files.find((f) => /\.html?$/i.test(f.path));

  if (!html) return null;

  const cssFiles = files.filter((f) => /\.css$/i.test(f.path));
  const jsFiles = files.filter((f) => /\.(js|jsx)$/i.test(f.path));

  let doc = html.content;
  const inlinedPaths = new Set();

  cssFiles.forEach((file) => {
    const base = escapeRegExp(file.path.split("/").pop());
    const linkTagPattern = new RegExp(
      `<link[^>]*href=["'][^"']*${base}["'][^>]*>`,
      "i",
    );
    if (linkTagPattern.test(doc)) {
      doc = doc.replace(linkTagPattern, `<style>${file.content}</style>`);
      inlinedPaths.add(file.path);
    }
  });

  jsFiles.forEach((file) => {
    const base = escapeRegExp(file.path.split("/").pop());
    const scriptTagPattern = new RegExp(
      `<script[^>]*src=["'][^"']*${base}["'][^>]*>\\s*</script>`,
      "i",
    );
    if (scriptTagPattern.test(doc)) {
      doc = doc.replace(scriptTagPattern, `<script>${file.content}</script>`);
      inlinedPaths.add(file.path);
    }
  });

  const remainingCss = cssFiles.filter((f) => !inlinedPaths.has(f.path));
  const remainingJs = jsFiles.filter((f) => !inlinedPaths.has(f.path));

  if (remainingCss.length > 0) {
    const styleBlock = remainingCss
      .map((f) => `<style>${f.content}</style>`)
      .join("");
    doc = doc.includes("</head>")
      ? doc.replace("</head>", `${styleBlock}</head>`)
      : `${styleBlock}${doc}`;
  }

  if (remainingJs.length > 0) {
    const scriptBlock = remainingJs
      .map((f) => `<script>${f.content}</script>`)
      .join("");
    doc = doc.includes("</body>")
      ? doc.replace("</body>", `${scriptBlock}</body>`)
      : `${doc}${scriptBlock}`;
  }

  return doc;
}

function relativeTime(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

/* ------------------------------ list view ------------------------------ */

function ArtifactListRow({ entry, onOpen }) {
  const files = useMemo(
    () => normalizeArtifact(entry.artifact),
    [entry.artifact],
  );
  const primary = files[0];
  const accent = getAccent(primary?.path || primary?.name);
  const title = primary?.name || entry.artifact.title || "Artifact";
  const when = relativeTime(entry.createdAt);

  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-xl border border-black/[0.07] bg-white px-3 py-2.5 sm:px-3.5 sm:py-3 flex items-center gap-3 transition-all duration-150 hover:border-black/[0.14] hover:shadow-[0_4px_14px_rgba(20,21,26,0.06)] active:scale-[0.99]"
    >
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}14` }}
      >
        <FileCode2 size={15} style={{ color: accent }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-black/85 truncate">
          {title}
        </p>
        <p className="text-[11.5px] font-[IBM_Plex_Mono,monospace] text-black/40 truncate">
          {files.length} file{files.length !== 1 ? "s" : ""}
          {entry.agent?.label ? ` · ${entry.agent.label}` : ""}
          {when ? ` · ${when}` : ""}
        </p>
      </div>
      <ChevronLeft size={15} className="rotate-180 text-black/25 shrink-0" />
    </button>
  );
}

function ArtifactListView({ entries, onOpen }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 sm:px-4 space-y-2">
      {entries.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-6 py-16">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: "rgba(30,122,86,0.08)" }}
          >
            <Files size={17} className="text-[#1E7A56]" />
          </span>
          <p className="text-[13.5px] font-medium text-black/70">
            No artifacts yet
          </p>
          <p className="text-[12px] text-black/40 mt-1 max-w-[220px]">
            Files Vortex generates in this conversation will show up here.
          </p>
        </div>
      ) : (
        entries.map((entry) => (
          <ArtifactListRow
            key={entry.id}
            entry={entry}
            onOpen={() => onOpen(entry.id)}
          />
        ))
      )}
    </div>
  );
}

/* ----------------------------- detail view ------------------------------ */

function ArtifactDetailView({ entry, onBack, showBack, onWidthChange }) {
  const files = useMemo(
    () => normalizeArtifact(entry.artifact),
    [entry.artifact],
  );
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [view, setView] = useState("code");
  const [copied, setCopied] = useState(false);
  const codeWrapRef = useRef(null);
  const isMobile = useIsMobile();

  // Reset to the first file whenever a different artifact is opened.
  useLayoutEffect(() => {
    setActiveFileIdx(0);
    setView("code");
  }, [entry.id]);

  const activeFile = files[activeFileIdx];

  const longestLineChars = useMemo(() => {
    if (files.length === 0) return 0;
    return Math.max(
      ...files.map((file) => {
        const lines = (file.content || "").split("\n");
        return Math.max(0, ...lines.map((line) => line.length));
      }),
    );
  }, [files]);

  const shouldWrapLongLines = longestLineChars > WRAP_AFTER_CHARS;
  const cappedLineChars = Math.min(longestLineChars, WRAP_AFTER_CHARS);
  const maxContentWidth = cappedLineChars * 8;

  const previewDoc = useMemo(() => buildPreviewDoc(files), [files]);
  const canPreview = Boolean(previewDoc);

  useLayoutEffect(() => {
    if (!onWidthChange) return;
    if (isMobile) {
      onWidthChange(null);
      return;
    }
    const width = Math.max(800, Math.min(1400, maxContentWidth + 80));
    onWidthChange(width);
  }, [view, maxContentWidth, isMobile, onWidthChange]);

  const tabRefs = useRef([]);
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[activeFileIdx];
    if (el) setTabIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeFileIdx, files.length]);

  const segCount = canPreview ? 2 : 1;
  const segIndex = view === "code" ? 0 : 1;

  const lineCount = activeFile?.content
    ? activeFile.content.replace(/\n$/, "").split("\n").length
    : 0;

  const accent = getAccent(activeFile?.path || activeFile?.name);

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      activeFile.name || activeFile.path?.split("/").pop() || "download.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeFile) return null;

  return (
    <>
      {/* File tabs — only relevant while browsing code, not while previewing */}
      {files.length > 1 && view === "code" && (
        <div className="relative flex items-center gap-1 px-2.5 sm:px-3 pt-3 overflow-x-auto shrink-0 [-webkit-overflow-scrolling:touch]">
          {files.map((file, idx) => {
            const isActive = idx === activeFileIdx;
            const tabAccent = getAccent(file.path);
            return (
              <button
                key={file.path + idx}
                ref={(el) => (tabRefs.current[idx] = el)}
                onClick={() => setActiveFileIdx(idx)}
                className={`relative shrink-0 flex items-center gap-1.5 rounded-md px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-[IBM_Plex_Mono,monospace] transition-colors duration-200 ${
                  isActive
                    ? "text-black/85"
                    : "text-black/40 hover:text-black/70 hover:bg-black/[0.03]"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: isActive ? tabAccent : "rgba(0,0,0,0.18)",
                  }}
                />
                <span className="truncate max-w-[100px] sm:max-w-[140px]">
                  {file.path.split("/").pop()}
                </span>
              </button>
            );
          })}
          <span
            className="absolute bottom-0 h-[2px] rounded-full transition-all duration-300 ease-out"
            style={{
              left: tabIndicator.left,
              width: tabIndicator.width,
              background: `linear-gradient(90deg, ${accent}, #5EEAD4)`,
            }}
          />
          <span className="absolute bottom-0 left-0 right-0 h-px bg-black/[0.06]" />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 pt-3 pb-2.5 shrink-0">
        {canPreview ? (
          <div className="relative flex items-center bg-black/[0.04] rounded-md p-0.5">
            <span
              className="absolute top-0.5 bottom-0.5 rounded bg-white shadow-sm transition-transform duration-250 ease-out"
              style={{
                width: `calc(${100 / segCount}% - 2px)`,
                transform: `translateX(${segIndex * 100}%)`,
              }}
            />
            <button
              onClick={() => setView("code")}
              className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-2.5 py-1.5 sm:py-1 rounded text-xs font-medium transition-colors duration-200 ${
                view === "code"
                  ? "text-black/80"
                  : "text-black/40 hover:text-black/60"
              }`}
            >
              <Code2 size={13} /> Code
            </button>
            <button
              onClick={() => setView("preview")}
              className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-2.5 py-1.5 sm:py-1 rounded text-xs font-medium transition-colors duration-200 ${
                view === "preview"
                  ? "text-black/80"
                  : "text-black/40 hover:text-black/60"
              }`}
            >
              <Eye size={13} /> Preview
            </button>
          </div>
        ) : (
          <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-black/50">
            <Code2 size={13} /> Code
          </span>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {view === "code" && (
            <span className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/30 hidden sm:inline">
              {lineCount} line{lineCount !== 1 ? "s" : ""}
            </span>
          )}
          {view === "code" && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                title="Copy file"
                className="w-8 h-8 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-black/40 hover:text-[#1E7A56] hover:bg-black/[0.06] active:scale-90 transition-all duration-150"
              >
                <span className="relative w-3.5 h-3.5 inline-flex items-center justify-center">
                  <Copy
                    size={14}
                    className={`absolute transition-all duration-200 ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
                  />
                  <Check
                    size={14}
                    className={`absolute text-[#1E7A56] transition-all duration-200 ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                  />
                </span>
              </button>
              <button
                onClick={handleDownload}
                title="Download file"
                className="w-8 h-8 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-black/40 hover:text-[#1E7A56] hover:bg-black/[0.06] active:scale-90 transition-all duration-150"
              >
                <Download size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex-1 min-h-0 px-3 sm:px-4 pb-3 sm:pb-4 ${
          view === "preview" ? "flex flex-col" : "overflow-y-auto"
        }`}
        style={
          view === "preview"
            ? { paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }
            : undefined
        }
      >
        <div
          key={view + activeFileIdx}
          className={`motion-safe:animate-[fadeUp_0.2s_ease-out_both] ${
            view === "preview" ? "flex-1 min-h-0 flex flex-col" : ""
          }`}
        >
          {view === "code" ? (
            <div
              ref={codeWrapRef}
              className="rounded-xl border border-black/[0.07] bg-white overflow-x-auto"
            >
              <SyntaxHighlighter
                language={getLanguage(activeFile)}
                style={oneLight}
                showLineNumbers
                wrapLongLines={shouldWrapLongLines}
                customStyle={{
                  margin: 0,
                  padding: "14px",
                  fontSize: "12.5px",
                  lineHeight: 1.65,
                  background: "#ffffff",
                  width: shouldWrapLongLines ? "100%" : "max-content",
                  minWidth: "100%",
                }}
                codeTagProps={{ style: { background: "transparent" } }}
                lineNumberStyle={{
                  color: "rgba(0,0,0,0.22)",
                  minWidth: "2.2em",
                }}
                PreTag={({ children, ...rest }) => (
                  <pre
                    {...rest}
                    style={{
                      ...rest.style,
                      ...(shouldWrapLongLines
                        ? {
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                          }
                        : null),
                    }}
                  >
                    {children}
                  </pre>
                )}
              >
                {activeFile?.content || ""}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="flex-1 min-h-[280px] rounded-xl border border-black/[0.07] overflow-hidden bg-white">
              <iframe
                title="artifact-preview"
                srcDoc={previewDoc}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full"
                style={{ touchAction: "manipulation" }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* -------------------------------- panel --------------------------------- */

function ArtifactPanel({
  artifacts = [],
  selectedId = null,
  onSelect,
  onClose,
  onWidthChange,
}) {
  const selectedEntry = artifacts.find((e) => e.id === selectedId) || null;
  const isList = !selectedEntry;

  const selectedFiles = useMemo(
    () => (selectedEntry ? normalizeArtifact(selectedEntry.artifact) : []),
    [selectedEntry],
  );

  useLayoutEffect(() => {
    if (isList) onWidthChange?.(null);
  }, [isList, onWidthChange]);

  const headerTitle = isList
    ? "Artifacts"
    : selectedFiles[0]?.name || selectedEntry.artifact.title || "Artifact";

  const headerSubtitle = isList
    ? `${artifacts.length} file${artifacts.length !== 1 ? "s" : ""} in this conversation`
    : selectedEntry.artifact.description ||
      `${selectedFiles.length} file${selectedFiles.length !== 1 ? "s" : ""}`;

  return (
    <aside className="h-full min-h-0 w-full max-w-full border-l border-black/[0.07] bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-14 sm:h-16 border-b border-black/[0.06] shrink-0 bg-white"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {!isList && artifacts.length > 1 ? (
          <button
            onClick={() => onSelect(null)}
            title="All artifacts"
            className="w-9 h-9 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-black/40 hover:text-black hover:bg-black/[0.06] active:scale-90 transition-all duration-150"
          >
            <ChevronLeft size={17} />
          </button>
        ) : (
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(30,122,86,0.1)" }}
          >
            <FileCode2 size={16} className="text-[#1E7A56]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-black/85 truncate font-[Space_Grotesk,sans-serif]">
            {headerTitle}
          </p>
          <p className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/40 truncate">
            {headerSubtitle}
          </p>
        </div>

        <button
          onClick={onClose}
          title="Close"
          className="w-9 h-9 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center text-black/35 hover:text-black hover:bg-black/[0.06] active:scale-90 transition-all duration-150"
        >
          <X size={16} />
        </button>
      </div>

      {isList ? (
        <ArtifactListView entries={artifacts} onOpen={onSelect} />
      ) : (
        <ArtifactDetailView
          key={selectedEntry.id}
          entry={selectedEntry}
          onBack={() => onSelect(null)}
          showBack={artifacts.length > 1}
          onWidthChange={onWidthChange}
        />
      )}
    </aside>
  );
}

export default ArtifactPanel;
