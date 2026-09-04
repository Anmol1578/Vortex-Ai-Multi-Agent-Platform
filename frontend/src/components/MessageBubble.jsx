import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ------------------------- icons used only here ------------------------- */

function CodeGlyphIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5B4FC7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
// New — used for the attached-file chip on user messages
function FileTextIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/* ------------------------- artifact extraction ------------------------- */

function ArtifactCard({ artifact, onOpen }) {
  if (!artifact) return null;

  if (Array.isArray(artifact.files) && artifact.files.length > 0) {
    const primary = artifact.files[0];
    const primaryName =
      primary?.name || primary?.path?.split("/").pop() || "Untitled file";

    return (
      <button
        onClick={onOpen}
        className="w-full text-left rounded-xl border border-black/[0.08] bg-white overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(91,79,199,0.28)] hover:border-[#5B4FC7]/30"
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span
            className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "rgba(91,79,199,.1)" }}
          >
            <CodeGlyphIcon />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-medium truncate">{primaryName}</p>
            <p className="text-[11.5px] text-black/45 truncate">
              {artifact.files.length} file
              {artifact.files.length !== 1 ? "s" : ""}
            </p>
          </div>
          <span className="text-black/25 group-hover:text-[#5B4FC7] group-hover:translate-x-0.5 transition-all shrink-0">
            <ChevronIcon />
          </span>
        </div>
      </button>
    );
  }

  const LANG_EXT = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    css: "css",
    html: "html",
    json: "json",
    bash: "sh",
    markdown: "md",
  };
  const ext = LANG_EXT[artifact.language] || "txt";
  const fallbackName = artifact.name || `snippet.${ext}`;
  const firstLine = (artifact.code || "").trim().split("\n")[0].slice(0, 46);

  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-xl border border-black/[0.08] bg-white overflow-hidden group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(91,79,199,0.28)] hover:border-[#5B4FC7]/30"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ background: "rgba(91,79,199,.1)" }}
        >
          <CodeGlyphIcon />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-medium truncate">{fallbackName}</p>
          <p className="text-[11.5px] text-black/40 truncate">
            {artifact.language ?? "Plain Text"} · {firstLine}
            {firstLine.length >= 46 ? "…" : ""}
          </p>
        </div>
        <span className="text-black/25 group-hover:text-[#5B4FC7] group-hover:translate-x-0.5 transition-all shrink-0">
          <ChevronIcon />
        </span>
      </div>
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

async function downloadImage(src, filename = "image.png") {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(src, "_blank");
  }
}

/* ------------------------- image grid ------------------------- */

function ImageGrid({ images, onImageClick }) {
  if (!Array.isArray(images) || images.length === 0) return null;

  const valid = images
    .map((img) => {
      const src = typeof img === "string" ? img : img?.url;
      const alt = typeof img === "string" ? "" : (img?.description ?? "");
      return src ? { src, alt } : null;
    })
    .filter(Boolean);

  if (valid.length === 0) return null;

  const gridClass =
    valid.length === 1
      ? "grid grid-cols-1"
      : valid.length === 2
        ? "grid grid-cols-2 gap-2"
        : "grid grid-cols-2 sm:grid-cols-3 gap-2";

  return (
    <div className={`${gridClass} pt-1`}>
      {valid.map((img, idx) => (
        <div
          key={idx}
          className="group relative rounded-xl overflow-hidden border border-black/[0.07] bg-black/[0.02]"
        >
          <button
            type="button"
            onClick={() => onImageClick(img)}
            className="block w-full cursor-zoom-in"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
                valid.length === 1 ? "h-56" : "h-32"
              }`}
              onError={(e) => {
                e.currentTarget.closest("div").style.display = "none";
              }}
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              downloadImage(img.src, `vortex-image-${idx + 1}.png`);
            }}
            aria-label="Download image"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <DownloadIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------- image lightbox ------------------------- */

function ImageLightbox({ image, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!image) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md motion-safe:animate-[fadeUp_0.2s_ease-out_both]"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <CloseIcon />
      </button>
      <img
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] object-contain"
      />
      {image.alt && (
        <p
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80%] text-center text-white/80 text-xs font-[IBM_Plex_Mono,monospace] px-3"
        >
          {image.alt}
        </p>
      )}
    </div>,
    document.body,
  );
}

/* ------------------------- inline code block w/ copy ------------------------- */

function CodeBlock({ language, codeText }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-black/[0.07] my-2.5">
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/[0.035] border-b border-black/[0.06]">
        <span className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/40 tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-black/40 hover:text-black/70 transition-colors"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "12px 14px",
          fontSize: "12.5px",
          lineHeight: 1.6,
          background: "transparent",
        }}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
}

/* ------------------------- markdown renderers ------------------------- */

// Paragraph/list spacing bumped from 1.5 -> 2.5 and line-height from 1.65 -> 1.7
// so multi-paragraph responses (e.g. imageAnalyzer's longer answers) get real
// breathing room between blocks instead of reading as one dense wall of text.
const markdownComponents = {
  a: ({ children, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#1E7A56] font-medium hover:underline underline-offset-2"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <h1 className="text-[17px] font-semibold text-black/85 mt-5 mb-2 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-[15.5px] font-semibold text-black/85 mt-5 mb-2 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[14px] font-semibold text-black/80 mt-4 mb-1.5 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[14.5px] leading-[1.7] text-black/80 my-2.5 first:mt-0 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="text-[14.5px] leading-[1.7] text-black/80 my-2.5 pl-5 space-y-1.5 list-disc marker:text-black/30">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-[14.5px] leading-[1.7] text-black/80 my-2.5 pl-5 space-y-1.5 list-decimal marker:text-black/30 marker:font-medium">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  // Darkened to the same near-black used for the app's ink color so bold text
  // reads as clearly bolder/darker than body text, not just heavier-weight gray.
  strong: ({ children }) => (
    <strong className="font-semibold text-[#14151A]">{children}</strong>
  ),
  em: ({ children }) => <em className="text-black/75">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#1E7A56]/30 pl-3 my-2.5 text-black/60 italic text-[14px]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-black/[0.08]" />,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-black/[0.08]">
      <table className="w-full text-[13px] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-black/[0.03]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left font-semibold text-black/70 px-3 py-2 border-b border-black/[0.08] whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-black/[0.05] text-black/75 align-top">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="rounded-lg border border-black/[0.07] max-w-full my-2.5"
    />
  ),
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeText = String(children).replace(/\n$/, "");

    if (!match) {
      return (
        <code
          className="bg-black/[0.06] rounded px-1.5 py-0.5 text-[13px] font-[IBM_Plex_Mono,monospace] text-[#5B4FC7]"
          {...props}
        >
          {children}
        </code>
      );
    }

    return <CodeBlock language={match[1]} codeText={codeText} />;
  },
};

/* --------------------------- message bubble --------------------------- */

function MessageBubble({ message, onOpenArtifact }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!message) return null;

  if (message.role === "user") {
    return (
      <div className="flex justify-end motion-safe:animate-[fadeUp_0.35s_ease-out_both]">
        <div className="max-w-[80%] flex flex-col items-end gap-1.5">
          {message.fileName && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/[0.05] text-[11px] text-black/50">
              <FileTextIcon />
              <span className="truncate max-w-[180px]">{message.fileName}</span>
            </div>
          )}
          <div className="rounded-2xl rounded-tr-sm bg-[#14151A] text-white text-[14.5px] leading-relaxed px-4 py-3">
            {message.content ?? ""}
          </div>
        </div>
      </div>
    );
  }

  const text = message.content;
  const artifact =
    message.artifacts && message.artifacts.length ? message.artifacts[0] : null;
  const agent = message.agent;
  const images = message.images;
  const hasImages = Array.isArray(images) && images.length > 0;
  const hasFallback = !text && !artifact && !hasImages;

  return (
    <div className="flex justify-start motion-safe:animate-[fadeUp_0.35s_ease-out_both]">
      <div className="max-w-[85%] w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: agent?.color ?? "#1E7A56" }}
          />
          <span
            className="text-[11px] font-[IBM_Plex_Mono,monospace] font-medium tracking-wide"
            style={{ color: agent?.color ?? "#1E7A56" }}
          >
            {agent?.label ?? "VORTEX"}
          </span>
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-black/[0.07] bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(20,21,26,0.04)] space-y-3">
          {hasFallback && (
            <span className="text-black/35 italic text-[14px]">
              (this message has no content)
            </span>
          )}
          {text && (
            <div>
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {text}
              </Markdown>
            </div>
          )}
          {artifact && (
            <ArtifactCard
              artifact={artifact}
              onOpen={() => onOpenArtifact(artifact)}
            />
          )}
          {hasImages && (
            <ImageGrid images={images} onImageClick={setLightboxImage} />
          )}
        </div>
      </div>
      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}

export default MessageBubble;
