// import React from "react";
// import MessageBubble from "./MessageBubble";

// /* --------------------------- empty state --------------------------- */

// function VortexBadge() {
//   return (
//     <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#14151A] to-[#0B2E22] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
//       <div className="absolute inset-0 bg-[#1E7A56]/25 blur-md rounded-full scale-75" />
//       <svg
//         width="26"
//         height="26"
//         viewBox="0 0 24 24"
//         fill="none"
//         className="relative z-10"
//       >
//         <defs>
//           <linearGradient id="vGradientEmpty" x1="0" y1="0" x2="24" y2="24">
//             <stop offset="0%" stopColor="#5EEAD4" />
//             <stop offset="100%" stopColor="#1E7A56" />
//           </linearGradient>
//         </defs>
//         <path
//           d="M3 4L12 20L21 4"
//           stroke="url(#vGradientEmpty)"
//           strokeWidth="2.6"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           fill="none"
//         />
//         <path
//           d="M7.5 4L12 12.5L16.5 4"
//           stroke="url(#vGradientEmpty)"
//           strokeWidth="1.6"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           fill="none"
//           opacity="0.5"
//         />
//       </svg>
//       <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite] ring-2 ring-white z-10" />
//     </div>
//   );
// }

// const SUGGESTIONS = [
//   "Build a REST API with auth",
//   "Plan a RAG pipeline",
//   "Debug this stack trace",
// ];

// function EmptyState({ onSuggest }) {
//   return (
//     <div className="h-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -top-24 -left-16 w-[380px] h-[380px] opacity-60 motion-safe:animate-[drift_12s_ease-in-out_infinite]"
//         style={{
//           background:
//             "radial-gradient(circle, rgba(30,122,86,0.12), transparent 60%)",
//           filter: "blur(50px)",
//         }}
//       />
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -bottom-20 -right-16 w-[340px] h-[340px] opacity-60 motion-safe:animate-[drift_14s_ease-in-out_infinite_1.5s]"
//         style={{
//           background:
//             "radial-gradient(circle, rgba(94,234,212,0.10), transparent 60%)",
//           filter: "blur(50px)",
//         }}
//       />

//       <span
//         aria-hidden="true"
//         className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-[Space_Grotesk,sans-serif] font-bold text-[16vw] text-black/[0.025] tracking-tight"
//       >
//         VORTEX
//       </span>

//       <span className="inline-flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] tracking-wide uppercase text-[#1E7A56] bg-[#1E7A56]/[0.06] border border-[#1E7A56]/20 rounded-md px-3 py-1.5 mb-6 motion-safe:animate-[fadeUp_0.5s_ease-out_both]">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
//         Ready when you are
//       </span>

//       <div className="motion-safe:animate-[fadeUp_0.5s_ease-out_0.05s_both]">
//         <VortexBadge />
//       </div>

//       <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-semibold mt-6 motion-safe:animate-[fadeUp_0.5s_ease-out_0.1s_both]">
//         What are we building today?
//       </h1>
//       <p className="text-black/45 text-sm mt-2 max-w-sm motion-safe:animate-[fadeUp_0.5s_ease-out_0.15s_both]">
//         Describe an outcome — Vortex will handle research, code, and review as
//         needed.
//       </p>

//       <div className="flex flex-wrap gap-2.5 justify-center mt-8 max-w-lg motion-safe:animate-[fadeUp_0.5s_ease-out_0.2s_both]">
//         {SUGGESTIONS.map((s) => (
//           <button
//             key={s}
//             onClick={() => onSuggest(s)}
//             className="text-sm text-black/60 rounded-md border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:border-[#1E7A56]/40 hover:text-black hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(20,21,26,0.06)]"
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       <div className="absolute bottom-6 inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-[11px] text-black/30 motion-safe:animate-[fadeUp_0.5s_ease-out_0.25s_both]">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.8s_ease-in-out_infinite]" />
//         All agents online · core.vortex.ai
//       </div>
//     </div>
//   );
// }

// /* --------------------------- typing indicator --------------------------- */

// function TypingIndicator({ agent }) {
//   return (
//     <div className="flex justify-start motion-safe:animate-[fadeUp_0.35s_ease-out_both]">
//       <div className="max-w-[75%]">
//         <div className="flex items-center gap-2 mb-1.5">
//           <span
//             className="w-1.5 h-1.5 rounded-full"
//             style={{
//               background: agent.color,
//               animation: "pulseDot 1s ease-in-out infinite",
//             }}
//           />
//           <span
//             className="text-[11px] font-[IBM_Plex_Mono,monospace] font-medium"
//             style={{ color: agent.color }}
//           >
//             {agent.label} · working
//           </span>
//         </div>
//         <div className="rounded-lg rounded-tl-sm border border-black/[0.07] bg-white px-4 py-3.5 flex items-center gap-1.5 shadow-[0_2px_10px_rgba(20,21,26,0.04)]">
//           {[0, 1, 2].map((i) => (
//             <span
//               key={i}
//               className="w-1.5 h-1.5 rounded-full bg-black/25"
//               style={{
//                 animation: `pulseDot 1s ease-in-out ${i * 0.15}s infinite`,
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* --------------------------- main list --------------------------- */

// function MessageList({
//   messages,
//   thinking,
//   activeAgent,
//   onSuggest,
//   onOpenArtifact,
//   scrollRef,
// }) {
//   return (
//     <div ref={scrollRef} className="flex-1 overflow-y-auto w-full">
//       {messages.length === 0 ? (
//         <EmptyState onSuggest={onSuggest} />
//       ) : (
//         <div className="w-full flex justify-center">
//           <div className="w-full max-w-[820px] px-6 py-10 space-y-6 box-border">
//             {messages.map((m, i) => (
//               <MessageBubble
//                 key={i}
//                 message={m}
//                 onOpenArtifact={onOpenArtifact}
//               />
//             ))}
//             {thinking && activeAgent && <TypingIndicator agent={activeAgent} />}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MessageList;

// import React from "react";
// import MessageBubble from "./MessageBubble";

// /* --------------------------- empty state --------------------------- */

// function VortexBadge() {
//   return (
//     <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#14151A] to-[#0B2E22] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
//       <div className="absolute inset-0 bg-[#1E7A56]/25 blur-md rounded-full scale-75" />
//       <svg
//         width="26"
//         height="26"
//         viewBox="0 0 24 24"
//         fill="none"
//         className="relative z-10"
//       >
//         <defs>
//           <linearGradient id="vGradientEmpty" x1="0" y1="0" x2="24" y2="24">
//             <stop offset="0%" stopColor="#5EEAD4" />
//             <stop offset="100%" stopColor="#1E7A56" />
//           </linearGradient>
//         </defs>
//         <path
//           d="M3 4L12 20L21 4"
//           stroke="url(#vGradientEmpty)"
//           strokeWidth="2.6"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           fill="none"
//         />
//         <path
//           d="M7.5 4L12 12.5L16.5 4"
//           stroke="url(#vGradientEmpty)"
//           strokeWidth="1.6"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           fill="none"
//           opacity="0.5"
//         />
//       </svg>
//       <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite] ring-2 ring-white z-10" />
//     </div>
//   );
// }

// const SUGGESTIONS = [
//   "Build a REST API with auth",
//   "Plan a RAG pipeline",
//   "Debug this stack trace",
// ];

// function EmptyState({ onSuggest }) {
//   return (
//     <div className="h-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -top-24 -left-16 w-[380px] h-[380px] opacity-60 motion-safe:animate-[drift_12s_ease-in-out_infinite]"
//         style={{
//           background:
//             "radial-gradient(circle, rgba(30,122,86,0.12), transparent 60%)",
//           filter: "blur(50px)",
//         }}
//       />
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -bottom-20 -right-16 w-[340px] h-[340px] opacity-60 motion-safe:animate-[drift_14s_ease-in-out_infinite_1.5s]"
//         style={{
//           background:
//             "radial-gradient(circle, rgba(94,234,212,0.10), transparent 60%)",
//           filter: "blur(50px)",
//         }}
//       />

//       <span
//         aria-hidden="true"
//         className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-[Space_Grotesk,sans-serif] font-bold text-[16vw] text-black/[0.025] tracking-tight"
//       >
//         VORTEX
//       </span>

//       <span className="inline-flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] tracking-wide uppercase text-[#1E7A56] bg-[#1E7A56]/[0.06] border border-[#1E7A56]/20 rounded-md px-3 py-1.5 mb-6 motion-safe:animate-[fadeUp_0.5s_ease-out_both]">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
//         Ready when you are
//       </span>

//       <div className="motion-safe:animate-[fadeUp_0.5s_ease-out_0.05s_both]">
//         <VortexBadge />
//       </div>

//       <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-semibold mt-6 motion-safe:animate-[fadeUp_0.5s_ease-out_0.1s_both]">
//         What are we building today?
//       </h1>
//       <p className="text-black/45 text-sm mt-2 max-w-sm motion-safe:animate-[fadeUp_0.5s_ease-out_0.15s_both]">
//         Describe an outcome — Vortex will handle research, code, and review as
//         needed.
//       </p>

//       <div className="flex flex-wrap gap-2.5 justify-center mt-8 max-w-lg motion-safe:animate-[fadeUp_0.5s_ease-out_0.2s_both]">
//         {SUGGESTIONS.map((s) => (
//           <button
//             key={s}
//             onClick={() => onSuggest(s)}
//             className="text-sm text-black/60 rounded-md border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:border-[#1E7A56]/40 hover:text-black hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(20,21,26,0.06)]"
//           >
//             {s}
//           </button>
//         ))}
//       </div>

//       <div className="absolute bottom-6 inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-[11px] text-black/30 motion-safe:animate-[fadeUp_0.5s_ease-out_0.25s_both]">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.8s_ease-in-out_infinite]" />
//         All agents online · core.vortex.ai
//       </div>
//     </div>
//   );
// }

// /* --------------------------- typing indicator --------------------------- */

// function TypingIndicator({ agent }) {
//   return (
//     <div className="flex justify-start motion-safe:animate-[fadeUp_0.35s_ease-out_both]">
//       <div className="max-w-[75%]">
//         <div className="flex items-center gap-2 mb-1.5">
//           <span
//             className="w-1.5 h-1.5 rounded-full"
//             style={{
//               background: agent.color,
//               animation: "pulseDot 1s ease-in-out infinite",
//             }}
//           />
//           <span
//             className="text-[11px] font-[IBM_Plex_Mono,monospace] font-medium"
//             style={{ color: agent.color }}
//           >
//             {agent.label} · working
//           </span>
//         </div>
//         <div className="rounded-lg rounded-tl-sm border border-black/[0.07] bg-white px-4 py-3.5 flex items-center gap-1.5 shadow-[0_2px_10px_rgba(20,21,26,0.04)]">
//           {[0, 1, 2].map((i) => (
//             <span
//               key={i}
//               className="w-1.5 h-1.5 rounded-full bg-black/25"
//               style={{
//                 animation: `pulseDot 1s ease-in-out ${i * 0.15}s infinite`,
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* --------------------------- main list --------------------------- */

// function MessageList({
//   messages,
//   thinking,
//   activeAgent,
//   onSuggest,
//   onOpenArtifact,
//   scrollRef,
// }) {
//   return (
//     <div ref={scrollRef} className="flex-1 overflow-y-auto w-full">
//       {messages.length === 0 ? (
//         <EmptyState onSuggest={onSuggest} />
//       ) : (
//         <div className="w-full flex justify-center">
//           <div className="w-full max-w-[820px] px-6 py-10 space-y-6 box-border">
//             {messages.map((m, i) => (
//               <MessageBubble
//                 key={i}
//                 message={m}
//                 onOpenArtifact={onOpenArtifact}
//               />
//             ))}
//             {thinking && activeAgent && <TypingIndicator agent={activeAgent} />}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MessageList;





import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import MessageBubble from "./MessageBubble";

/* --------------------------- empty state --------------------------- */

function VortexBadge() {
  return (
    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#14151A] to-[#0B2E22] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="absolute inset-0 bg-[#1E7A56]/25 blur-md rounded-full scale-75" />
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="vGradientEmpty" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#1E7A56" />
          </linearGradient>
        </defs>
        <path
          d="M3 4L12 20L21 4"
          stroke="url(#vGradientEmpty)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M7.5 4L12 12.5L16.5 4"
          stroke="url(#vGradientEmpty)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite] ring-2 ring-white z-10" />
    </div>
  );
}

const SUGGESTIONS = [
  "Build a REST API with auth",
  "Plan a RAG pipeline",
  "Debug this stack trace",
];

function EmptyState({ onSuggest }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 w-[380px] h-[380px] opacity-60 motion-safe:animate-[drift_12s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle, rgba(30,122,86,0.12), transparent 60%)",
          filter: "blur(50px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-16 w-[340px] h-[340px] opacity-60 motion-safe:animate-[drift_14s_ease-in-out_infinite_1.5s]"
        style={{
          background:
            "radial-gradient(circle, rgba(94,234,212,0.10), transparent 60%)",
          filter: "blur(50px)",
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-[Space_Grotesk,sans-serif] font-bold text-[16vw] text-black/[0.025] tracking-tight"
      >
        VORTEX
      </span>

      <span className="inline-flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] tracking-wide uppercase text-[#1E7A56] bg-[#1E7A56]/[0.06] border border-[#1E7A56]/20 rounded-md px-3 py-1.5 mb-6 motion-safe:animate-[fadeUp_0.5s_ease-out_both]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
        Ready when you are
      </span>

      <div className="motion-safe:animate-[fadeUp_0.5s_ease-out_0.05s_both]">
        <VortexBadge />
      </div>

      <h1 className="font-[Space_Grotesk,sans-serif] text-2xl font-semibold mt-6 motion-safe:animate-[fadeUp_0.5s_ease-out_0.1s_both]">
        What are we building today?
      </h1>
      <p className="text-black/45 text-sm mt-2 max-w-sm motion-safe:animate-[fadeUp_0.5s_ease-out_0.15s_both]">
        Describe an outcome — Vortex will handle research, code, and review as
        needed.
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center mt-8 max-w-lg motion-safe:animate-[fadeUp_0.5s_ease-out_0.2s_both]">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="text-sm text-black/60 rounded-md border border-black/10 bg-white px-4 py-2 transition-all duration-200 hover:border-[#1E7A56]/40 hover:text-black hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(20,21,26,0.06)]"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="absolute bottom-6 inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-[11px] text-black/30 motion-safe:animate-[fadeUp_0.5s_ease-out_0.25s_both]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.8s_ease-in-out_infinite]" />
        All agents online · core.vortex.ai
      </div>
    </div>
  );
}

/* --------------------------- typing indicator --------------------------- */
const DEFAULT_THINKING_LABELS = [
  "Reading context",
  "Planning approach",
  "Reasoning through steps",
  "Drafting response",
  "Double-checking output",
];

const LABEL_INTERVAL_MS = 2200;

function useThinkingLabel(active, labels) {
  const [index, setIndex] = useState(0);
  const labelsKey = labels.join("|");

  useEffect(() => {
    setIndex(0);
  }, [labelsKey]);

  useEffect(() => {
    if (!active || labels.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % labels.length);
    }, LABEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [active, labelsKey, labels.length]);

  return labels[index] ?? labels[0];
}

// A pulsing neon "orb": glowing core circle that dims and brightens like a
const RING_COUNT = 3;
const RING_DURATION = 1.8;
const RING_STAGGER = RING_DURATION / RING_COUNT;

function ThinkingOrb({ color, reducedMotion }) {
  if (reducedMotion) {
    // Static glowing dot for prefers-reduced-motion — same neon look,
    // no motion.
    return (
      <span
        className="inline-flex w-3 h-3 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 14px ${color}`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="relative w-6 h-6 flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border-[1.5px]"
          style={{ borderColor: color, width: "100%", height: "100%" }}
          initial={{ opacity: 0.55, scale: 0.35 }}
          animate={{ opacity: [0.55, 0], scale: [0.35, 1.9] }}
          transition={{
            duration: RING_DURATION,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * RING_STAGGER,
          }}
        />
      ))}
      <motion.span
        className="relative z-10 w-3 h-3 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}, 0 0 14px ${color}`,
        }}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.08, 0.85] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function TypingIndicator({ agent }) {
  const reducedMotion = useReducedMotion();
  const labels =
    agent.thinkingLabels?.length > 0
      ? agent.thinkingLabels
      : DEFAULT_THINKING_LABELS;
  const label = useThinkingLabel(true, labels);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex justify-start"
    >
      <div className="flex items-center gap-2.5">
        <ThinkingOrb color={agent.color} reducedMotion={reducedMotion} />
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-[11px] font-[IBM_Plex_Mono,monospace] font-medium whitespace-nowrap"
            style={{ color: agent.color }}
          >
            {agent.label} · {label}…
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* --------------------------- main list --------------------------- */

function MessageList({
  messages,
  thinking,
  activeAgent,
  onSuggest,
  onOpenArtifact,
  scrollRef,
}) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto w-full">
      {messages.length === 0 ? (
        <EmptyState onSuggest={onSuggest} />
      ) : (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[820px] px-6 py-10 space-y-6 box-border">
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                message={m}
                onOpenArtifact={onOpenArtifact}
              />
            ))}
            <AnimatePresence>
              {thinking && activeAgent && (
                <TypingIndicator key="typing-indicator" agent={activeAgent} />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;


