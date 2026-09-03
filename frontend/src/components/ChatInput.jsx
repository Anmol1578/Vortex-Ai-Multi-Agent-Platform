// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AnimatePresence, motion } from "framer-motion";
// import { setUserdata } from "../redux/userSlice";
// import sendMessage from "../features/sendMessage";
// import { addMessages } from "../redux/messageSlice";
// import { createConversation } from "../features/createConversation";
// import {
//   setSelectedConversation,
//   addConversation,
//   setJustCreated,
//   setConvTitle,
// } from "../redux/conversationSlice";
// import { updateConversation } from "../features/updateConversation";

// function AttachIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//       <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.19 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
//     </svg>
//   );
// }
// function MicIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//       <rect x="9" y="2" width="6" height="12" rx="3" />
//       <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
//     </svg>
//   );
// }
// function SendIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
//     </svg>
//   );
// }
// function FileIcon() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <path d="M14 2v6h6" />
//     </svg>
//   );
// }
// function SpinnerIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
//       <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.2" strokeOpacity="0.25" />
//       <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
//     </svg>
//   );
// }

// // pdfRag / imageAnalyzer are intentionally NOT here — invisible, auto-detected
// // agents (like Claude/ChatGPT), not user-facing modes.
// const MODES = [
//   { id: "auto", label: "Auto" },
//   { id: "chat", label: "Chat" },
//   { id: "coding", label: "Coding" },
//   { id: "pdf", label: "PDF" },
//   { id: "ppt", label: "PPT" },
//   { id: "vision", label: "Image" },
//   { id: "search", label: "Search" },
// ];

// const MODE_AGENT_MAP = {
//   auto: { id: "auto", label: "AUTO", color: "#6B7280" },
//   chat: { id: "chat", label: "CHAT", color: "#1E7A56" },
//   coding: { id: "coding", label: "CODING", color: "#5B4FC7" },
//   pdf: { id: "pdf", label: "PDF", color: "#B45309" },
//   pdfRag: { id: "pdfRag", label: "DOC INTELLIGENCE", color: "#92400E" },
//   ppt: { id: "ppt", label: "PPT", color: "#B91C1C" },
//   vision: { id: "vision", label: "VISION", color: "#0369A1" },
//   imageAnalyzer: { id: "imageAnalyzer", label: "Vision Intelligence", color: "#075985" },
//   search: { id: "search", label: "SEARCH", color: "#7C3AED" },
// };

// const ACCEPTED_FILE_TYPES = ".pdf,image/*";
// const MAX_TEXTAREA_HEIGHT = 200;
// const CODING_HINT_RE = /build|api|function|debug|code|endpoint/i;

// // Send button color states — kept outside the component so the object
// // identity is stable across renders (avoids re-triggering framer-motion's
// // animate diffing unnecessarily).
// const SEND_BTN_VARIANTS = {
//   idle: { backgroundColor: "#14151A", boxShadow: "0 0 0px rgba(30,122,86,0)" },
//   ready: { backgroundColor: "#1E7A56", boxShadow: "0 8px 20px rgba(30,122,86,0.35)" },
//   sending: { backgroundColor: "#14151A", boxShadow: "0 0 0px rgba(30,122,86,0)" },
// };

// function ChatInput({ input, setInput, mode, setMode, setThinking, setActiveAgent }) {
//   const dispatch = useDispatch();
//   const { selectedConversation } = useSelector((state) => state.conversation);
//   const userData = useSelector((state) => state.user.userData);

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [filePreviewUrl, setFilePreviewUrl] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   const fileRef = useRef(null);
//   const textareaRef = useRef(null);
//   const dragCounter = useRef(0);

//   // Auto-grow textarea, capped at MAX_TEXTAREA_HEIGHT
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;
//     el.style.height = "0px";
//     el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
//   }, [input]);

//   // Generate/revoke an object URL for image thumbnail preview
//   useEffect(() => {
//     if (selectedFile && selectedFile.type.startsWith("image/")) {
//       const url = URL.createObjectURL(selectedFile);
//       setFilePreviewUrl(url);
//       return () => URL.revokeObjectURL(url);
//     }
//     setFilePreviewUrl(null);
//   }, [selectedFile]);

//   const applyFile = useCallback((file) => {
//     if (!file) return;
//     const isAccepted = file.type === "application/pdf" || file.type.startsWith("image/");
//     if (!isAccepted) return;
//     setSelectedFile(file);
//   }, []);

//   const handleFileChange = useCallback(
//     (e) => {
//       applyFile(e.target.files[0]);
//       e.target.value = ""; // reset so re-selecting the same file re-fires onChange
//     },
//     [applyFile],
//   );

//   const clearFile = useCallback(() => setSelectedFile(null), []);

//   // --- Drag & drop ---
//   const handleDragEnter = useCallback((e) => {
//     e.preventDefault();
//     dragCounter.current += 1;
//     if (e.dataTransfer?.types?.includes("Files")) setIsDragging(true);
//   }, []);
//   const handleDragLeave = useCallback((e) => {
//     e.preventDefault();
//     dragCounter.current -= 1;
//     if (dragCounter.current <= 0) {
//       dragCounter.current = 0;
//       setIsDragging(false);
//     }
//   }, []);
//   const handleDragOver = useCallback((e) => e.preventDefault(), []);
//   const handleDrop = useCallback(
//     (e) => {
//       e.preventDefault();
//       dragCounter.current = 0;
//       setIsDragging(false);
//       const file = e.dataTransfer.files?.[0];
//       if (file) applyFile(file);
//     },
//     [applyFile],
//   );

//   const handlePaste = useCallback(
//     (e) => {
//       const file = e.clipboardData?.files?.[0];
//       if (file) applyFile(file);
//     },
//     [applyFile],
//   );

//   const handleSendMessage = useCallback(async () => {
//     if (isSending) return;

//     let conversation = selectedConversation;

//     if (!conversation) {
//       conversation = await createConversation();
//       dispatch(addConversation(conversation));
//       dispatch(setJustCreated(true));
//       dispatch(setSelectedConversation(conversation));
//     }

//     const content = input.trim();

//     // A file alone is a valid request (e.g. "analyze this image"), so don't
//     // block on empty text — only block if there's truly nothing to send.
//     if (!content && !selectedFile) return;

//     const effectivePrompt =
//       !content && selectedFile
//         ? selectedFile.type === "application/pdf"
//           ? "Summarize the key points of this document."
//           : "Analyze this image in detail and describe what you see."
//         : content;

//     if (conversation.title === "New Chat" && effectivePrompt) {
//       const newTitle = effectivePrompt.slice(0, 60);
//       await updateConversation({ id: conversation._id, title: newTitle });
//       dispatch(setConvTitle({ conversationId: conversation._id, title: newTitle }));
//     }

//     // Client-side guess only for the typing indicator label — the real
//     // decision is router.js's, using the actual file mimetype + prompt.
//     const guessedId =
//       mode !== "auto"
//         ? mode
//         : selectedFile?.type === "application/pdf"
//           ? "pdfRag"
//           : selectedFile?.type?.startsWith("image/")
//             ? "imageAnalyzer"
//             : CODING_HINT_RE.test(effectivePrompt)
//               ? "coding"
//               : "chat";
//     const agent = MODE_AGENT_MAP[guessedId] ?? MODE_AGENT_MAP.chat;

//     dispatch(
//       addMessages({
//         role: "user",
//         content: content || `[Attached: ${selectedFile?.name}]`,
//         fileName: selectedFile?.name,
//       }),
//     );

//     setInput("");
//     const fileToSend = selectedFile;
//     setSelectedFile(null);
//     setIsSending(true);
//     setThinking(true);
//     setActiveAgent(agent);

//     const formData = new FormData();
//     formData.append("prompt", effectivePrompt);
//     formData.append("conversationId", conversation?._id ?? "");
//     formData.append("agent", mode);
//     if (fileToSend) {
//       formData.append("file", fileToSend);
//     }

//     try {
//       const data = await sendMessage(formData);

//       const replyContent =
//         typeof data === "string"
//           ? data
//           : (data?.content ?? "Something went wrong — no response from agent.");

//       if (typeof data?.credits === "number" && userData) {
//         dispatch(setUserdata({ ...userData, credits: data.credits }));
//       }

//       dispatch(
//         addMessages({
//           role: "agent",
//           agent: data?.agent ?? agent,
//           content: replyContent,
//           images: data?.images,
//           artifacts: data?.artifacts,
//         }),
//       );
//     } catch (error) {
//       const status = error.response?.status;
//       const errData = error.response?.data;

//       const isCreditsError = status === 402 || errData?.code === "INSUFFICIENT_CREDITS";
//       const isRateLimitError = status === 429 || errData?.code === "RATE_LIMIT_EXCEEDED";

//       if (isCreditsError && typeof errData?.credits === "number" && userData) {
//         dispatch(setUserdata({ ...userData, credits: errData.credits }));
//       }

//       dispatch(
//         addMessages({
//           role: "agent",
//           agent,
//           content: isCreditsError
//             ? `⚡ Not enough credits — you have ${errData?.credits} Credits, this needs ${errData?.requiredCredits} Credits. Upgrade your plan to continue.`
//             : isRateLimitError
//               ? `⏱️ ${errData?.message || `Rate limit reached. Please try again in ${errData?.retryAfter || "a moment"}.`}`
//               : "Something went wrong. Please try again.",
//           isError: true,
//           isCreditsError,
//           isRateLimitError,
//         }),
//       );
//     } finally {
//       setThinking(false);
//       setActiveAgent(null);
//       setIsSending(false);
//     }
//   }, [isSending, selectedConversation, input, selectedFile, mode, dispatch, setInput, setThinking, setActiveAgent, userData]);

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         handleSendMessage();
//       }
//     },
//     [handleSendMessage],
//   );

//   const canSend = useMemo(
//     () => Boolean((input.trim() || selectedFile) && !isSending),
//     [input, selectedFile, isSending],
//   );

//   // Which animation variant the send button should be in right now.
//   const sendBtnState = isSending ? "sending" : canSend ? "ready" : "idle";

//   const openFilePicker = useCallback(() => fileRef.current?.click(), []);

//   return (
//     <div className="p-5 border-t border-black/[0.07] bg-white/25 backdrop-blur-xl z-10 overflow-hidden">
//       <div className="max-w-[820px] w-full mx-auto px-1 box-border">
//         {/* Mode pills with animated sliding highlight */}
//         <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar">
//           {MODES.map((m) => {
//             const active = mode === m.id;
//             return (
//               <button
//                 key={m.id}
//                 onClick={() => setMode(m.id)}
//                 className={`relative shrink-0 text-xs font-[IBM_Plex_Mono,monospace] font-medium rounded-md px-3.5 py-1.5 border transition-colors duration-200 ${
//                   active
//                     ? "border-transparent text-white"
//                     : "border-black/15 text-black/45 hover:text-[#1E7A56] hover:border-[#1E7A56]/40 hover:bg-[#1E7A56]/[0.05]"
//                 }`}
//               >
//                 {active && (
//                   <motion.span
//                     layoutId="mode-pill-bg"
//                     className="absolute inset-0 rounded-md bg-[#14151A]"
//                     transition={{ type: "spring", stiffness: 500, damping: 35 }}
//                   />
//                 )}
//                 <span className="relative z-10">{m.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Input card */}
//         <motion.div
//           onDragEnter={handleDragEnter}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//           onDrop={handleDrop}
//           animate={{
//             borderColor: isDragging ? "rgba(30,122,86,0.6)" : "rgba(0,0,0,0.08)",
//             scale: isDragging ? 1.01 : 1,
//           }}
//           transition={{ duration: 0.15 }}
//           className="relative rounded-lg border bg-white shadow-[0_4px_20px_rgba(20,21,26,0.05)] px-4 py-3 focus-within:border-[#1E7A56]/50"
//         >
//           <AnimatePresence>
//             {isDragging && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-[#1E7A56]/[0.06] border-2 border-dashed border-[#1E7A56]/50 pointer-events-none"
//               >
//                 <span className="text-xs font-[IBM_Plex_Mono,monospace] font-medium text-[#1E7A56]">
//                   Drop file to attach
//                 </span>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {selectedFile && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0, marginBottom: 0 }}
//                 animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
//                 exit={{ opacity: 0, height: 0, marginBottom: 0 }}
//                 transition={{ duration: 0.18 }}
//                 className="overflow-hidden"
//               >
//                 <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-black/[0.04] text-xs text-black/60 w-fit max-w-full">
//                   {filePreviewUrl ? (
//                     <img src={filePreviewUrl} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
//                   ) : (
//                     <FileIcon />
//                   )}
//                   <span className="truncate max-w-[200px]">{selectedFile.name}</span>
//                   <button
//                     onClick={clearFile}
//                     className="text-black/40 hover:text-red-500 transition-colors ml-1"
//                     aria-label="Remove file"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <textarea
//             ref={textareaRef}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             onPaste={handlePaste}
//             placeholder="Tell Vortex what to do…"
//             rows={1}
//             className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-black/30"
//             style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
//           />

//           <div className="flex items-center justify-between mt-2">
//             <div className="flex items-center gap-3 text-black/35">
//               <input
//                 type="file"
//                 accept={ACCEPTED_FILE_TYPES}
//                 hidden
//                 ref={fileRef}
//                 onChange={handleFileChange}
//               />
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 onClick={openFilePicker}
//                 className="hover:text-[#1E7A56] transition-colors"
//                 aria-label="Attach file"
//               >
//                 <AttachIcon />
//               </motion.button>
//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 className="hover:text-[#1E7A56] transition-colors"
//                 aria-label="Voice input"
//               >
//                 <MicIcon />
//               </motion.button>
//             </div>

//             <motion.button
//               onClick={handleSendMessage}
//               disabled={!canSend}
//               variants={SEND_BTN_VARIANTS}
//               animate={sendBtnState}
//               transition={{ duration: 0.35, ease: "easeInOut" }}
//               whileTap={canSend ? { scale: 0.88 } : {}}
//               whileHover={canSend ? { y: -2 } : {}}
//               className="rounded-md p-2 disabled:cursor-not-allowed disabled:opacity-40"
//               aria-label="Send"
//             >
//               <AnimatePresence mode="wait" initial={false}>
//                 {isSending ? (
//                   <motion.span
//                     key="spinner"
//                     initial={{ opacity: 0, scale: 0.6 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.6 }}
//                     className="block"
//                   >
//                     <SpinnerIcon />
//                   </motion.span>
//                 ) : (
//                   <motion.span
//                     key="send"
//                     initial={{ opacity: 0, scale: 0.6 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.6 }}
//                     className="block"
//                   >
//                     <SendIcon />
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default React.memo(ChatInput);

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { setUserdata } from "../redux/userSlice";
import sendMessage from "../features/sendMessage";
import { addMessages } from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  setSelectedConversation,
  addConversation,
  setJustCreated,
  setConvTitle,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";

function AttachIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.19 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="2.2"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// pdfRag / imageAnalyzer are intentionally NOT here — invisible, auto-detected
// agents (like Claude/ChatGPT), not user-facing modes.
const MODES = [
  { id: "auto", label: "Auto" },
  { id: "chat", label: "Chat" },
  { id: "coding", label: "Coding" },
  { id: "pdf", label: "PDF" },
  { id: "ppt", label: "PPT" },
  { id: "vision", label: "Image" },
  { id: "search", label: "Search" },
];

const MODE_AGENT_MAP = {
  auto: { id: "auto", label: "AUTO", color: "#6B7280" },
  chat: { id: "chat", label: "CHAT", color: "#1E7A56" },
  coding: { id: "coding", label: "CODING", color: "#5B4FC7" },
  pdf: { id: "pdf", label: "PDF", color: "#B45309" },
  pdfRag: { id: "pdfRag", label: "DOC INTELLIGENCE", color: "#92400E" },
  ppt: { id: "ppt", label: "PPT", color: "#B91C1C" },
  vision: { id: "vision", label: "VISION", color: "#0369A1" },
  imageAnalyzer: {
    id: "imageAnalyzer",
    label: "Vision Intelligence",
    color: "#075985",
  },
  search: { id: "search", label: "SEARCH", color: "#7C3AED" },
};

const ACCEPTED_FILE_TYPES = ".pdf,image/*";
const MAX_TEXTAREA_HEIGHT = 200;
const CODING_HINT_RE = /build|api|function|debug|code|endpoint/i;

// Send button color states — kept outside the component so the object
// identity is stable across renders (avoids re-triggering framer-motion's
// animate diffing unnecessarily).
const SEND_BTN_VARIANTS = {
  idle: { backgroundColor: "#14151A", boxShadow: "0 0 0px rgba(30,122,86,0)" },
  ready: {
    backgroundColor: "#1E7A56",
    boxShadow: "0 8px 20px rgba(30,122,86,0.35)",
  },
  sending: {
    backgroundColor: "#14151A",
    boxShadow: "0 0 0px rgba(30,122,86,0)",
  },
};

function ChatInput({
  input,
  setInput,
  mode,
  setMode,
  setThinking,
  setActiveAgent,
}) {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const userData = useSelector((state) => state.user.userData);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const dragCounter = useRef(0);
  const recognitionRef = useRef(null);

  // Auto-grow textarea, capped at MAX_TEXTAREA_HEIGHT
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [input]);

  // Generate/revoke an object URL for image thumbnail preview
  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreviewUrl(null);
  }, [selectedFile]);

  // Set up SpeechRecognition once. Not supported in Firefox; Safari support
  // is partial but generally works for short dictation.
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // only append finalized phrases
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      let finalTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput((prev) =>
          prev ? `${prev} ${finalTranscript}`.trim() : finalTranscript.trim(),
        );
      }
    };

    recognition.onerror = (e) => {
      console.error("[voice] recognition error:", e.error);
      setIsListening(false);
    };

    // Fires on silence timeout too, not just manual stop — keep state in sync.
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [setInput]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      console.warn("[voice] SpeechRecognition not supported in this browser");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening]);

  const applyFile = useCallback((file) => {
    if (!file) return;
    const isAccepted =
      file.type === "application/pdf" || file.type.startsWith("image/");
    if (!isAccepted) return;
    setSelectedFile(file);
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      applyFile(e.target.files[0]);
      e.target.value = ""; // reset so re-selecting the same file re-fires onChange
    },
    [applyFile],
  );

  const clearFile = useCallback(() => setSelectedFile(null), []);

  // --- Drag & drop ---
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (e.dataTransfer?.types?.includes("Files")) setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);
  const handleDragOver = useCallback((e) => e.preventDefault(), []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) applyFile(file);
    },
    [applyFile],
  );

  const handlePaste = useCallback(
    (e) => {
      const file = e.clipboardData?.files?.[0];
      if (file) applyFile(file);
    },
    [applyFile],
  );

  const handleSendMessage = useCallback(async () => {
    if (isSending) return;

    let conversation = selectedConversation;

    if (!conversation) {
      conversation = await createConversation();
      dispatch(addConversation(conversation));
      dispatch(setJustCreated(true));
      dispatch(setSelectedConversation(conversation));
    }

    const content = input.trim();

    // A file alone is a valid request (e.g. "analyze this image"), so don't
    // block on empty text — only block if there's truly nothing to send.
    if (!content && !selectedFile) return;

    const effectivePrompt =
      !content && selectedFile
        ? selectedFile.type === "application/pdf"
          ? "Summarize the key points of this document."
          : "Analyze this image in detail and describe what you see."
        : content;

    if (conversation.title === "New Chat" && effectivePrompt) {
      const newTitle = effectivePrompt.slice(0, 60);
      await updateConversation({ id: conversation._id, title: newTitle });
      dispatch(
        setConvTitle({ conversationId: conversation._id, title: newTitle }),
      );
    }

    // Client-side guess only for the typing indicator label — the real
    // decision is router.js's, using the actual file mimetype + prompt.
    const guessedId =
      mode !== "auto"
        ? mode
        : selectedFile?.type === "application/pdf"
          ? "pdfRag"
          : selectedFile?.type?.startsWith("image/")
            ? "imageAnalyzer"
            : CODING_HINT_RE.test(effectivePrompt)
              ? "coding"
              : "chat";
    const agent = MODE_AGENT_MAP[guessedId] ?? MODE_AGENT_MAP.chat;

    dispatch(
      addMessages({
        role: "user",
        content: content || `[Attached: ${selectedFile?.name}]`,
        fileName: selectedFile?.name,
      }),
    );

    setInput("");
    const fileToSend = selectedFile;
    setSelectedFile(null);
    setIsSending(true);
    setThinking(true);
    setActiveAgent(agent);

    const formData = new FormData();
    formData.append("prompt", effectivePrompt);
    formData.append("conversationId", conversation?._id ?? "");
    formData.append("agent", mode);
    if (fileToSend) {
      formData.append("file", fileToSend);
    }

    try {
      const data = await sendMessage(formData);

      const replyContent =
        typeof data === "string"
          ? data
          : (data?.content ?? "Something went wrong — no response from agent.");

      if (typeof data?.credits === "number" && userData) {
        dispatch(setUserdata({ ...userData, credits: data.credits }));
      }

      dispatch(
        addMessages({
          role: "agent",
          agent: data?.agent ?? agent,
          content: replyContent,
          images: data?.images,
          artifacts: data?.artifacts,
        }),
      );
    } catch (error) {
      const status = error.response?.status;
      const errData = error.response?.data;

      const isCreditsError =
        status === 402 || errData?.code === "INSUFFICIENT_CREDITS";
      const isRateLimitError =
        status === 429 || errData?.code === "RATE_LIMIT_EXCEEDED";

      if (isCreditsError && typeof errData?.credits === "number" && userData) {
        dispatch(setUserdata({ ...userData, credits: errData.credits }));
      }

      dispatch(
        addMessages({
          role: "agent",
          agent,
          content: isCreditsError
            ? `⚡ Not enough credits — you have ${errData?.credits} Credits, this needs ${errData?.requiredCredits} Credits. Upgrade your plan to continue.`
            : isRateLimitError
              ? `⏱️ ${errData?.message || `Rate limit reached. Please try again in ${errData?.retryAfter || "a moment"}.`}`
              : "Something went wrong. Please try again.",
          isError: true,
          isCreditsError,
          isRateLimitError,
        }),
      );
    } finally {
      setThinking(false);
      setActiveAgent(null);
      setIsSending(false);
    }
  }, [
    isSending,
    selectedConversation,
    input,
    selectedFile,
    mode,
    dispatch,
    setInput,
    setThinking,
    setActiveAgent,
    userData,
  ]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const canSend = useMemo(
    () => Boolean((input.trim() || selectedFile) && !isSending),
    [input, selectedFile, isSending],
  );

  // Which animation variant the send button should be in right now.
  const sendBtnState = isSending ? "sending" : canSend ? "ready" : "idle";

  const openFilePicker = useCallback(() => fileRef.current?.click(), []);

  return (
    <div className="p-5 border-t border-black/[0.07] bg-white/25 backdrop-blur-xl z-10 overflow-hidden">
      <div className="max-w-[820px] w-full mx-auto px-1 box-border">
        {/* Mode pills with animated sliding highlight */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`relative shrink-0 text-xs font-[IBM_Plex_Mono,monospace] font-medium rounded-md px-3.5 py-1.5 border transition-colors duration-200 ${
                  active
                    ? "border-transparent text-white"
                    : "border-black/15 text-black/45 hover:text-[#1E7A56] hover:border-[#1E7A56]/40 hover:bg-[#1E7A56]/[0.05]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="mode-pill-bg"
                    className="absolute inset-0 rounded-md bg-[#14151A]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input card */}
        <motion.div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging
              ? "rgba(30,122,86,0.6)"
              : "rgba(0,0,0,0.08)",
            scale: isDragging ? 1.01 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="relative rounded-lg border bg-white shadow-[0_4px_20px_rgba(20,21,26,0.05)] px-4 py-3 focus-within:border-[#1E7A56]/50"
        >
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-[#1E7A56]/[0.06] border-2 border-dashed border-[#1E7A56]/50 pointer-events-none"
              >
                <span className="text-xs font-[IBM_Plex_Mono,monospace] font-medium text-[#1E7A56]">
                  Drop file to attach
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-black/[0.04] text-xs text-black/60 w-fit max-w-full">
                  {filePreviewUrl ? (
                    <img
                      src={filePreviewUrl}
                      alt=""
                      className="w-6 h-6 rounded object-cover shrink-0"
                    />
                  ) : (
                    <FileIcon />
                  )}
                  <span className="truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={clearFile}
                    className="text-black/40 hover:text-red-500 transition-colors ml-1"
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-red-500/[0.06] text-xs text-red-600 w-fit">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                  />
                  Listening…
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Tell Vortex what to do…"
            rows={1}
            className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-black/30"
            style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-black/35">
              <input
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                hidden
                ref={fileRef}
                onChange={handleFileChange}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openFilePicker}
                className="hover:text-[#1E7A56] transition-colors"
                aria-label="Attach file"
              >
                <AttachIcon />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleListening}
                animate={
                  isListening
                    ? { color: "#DC2626", scale: [1, 1.15, 1] }
                    : { color: "rgba(0,0,0,0.35)", scale: 1 }
                }
                transition={
                  isListening
                    ? { scale: { repeat: Infinity, duration: 1.1 } }
                    : { duration: 0.15 }
                }
                disabled={!voiceSupported}
                className="hover:text-[#1E7A56] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={isListening ? "Stop voice input" : "Voice input"}
                title={
                  voiceSupported
                    ? undefined
                    : "Voice input isn't supported in this browser"
                }
              >
                <MicIcon />
              </motion.button>
            </div>

            <motion.button
              onClick={handleSendMessage}
              disabled={!canSend}
              variants={SEND_BTN_VARIANTS}
              animate={sendBtnState}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              whileTap={canSend ? { scale: 0.88 } : {}}
              whileHover={canSend ? { y: -2 } : {}}
              className="rounded-md p-2 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSending ? (
                  <motion.span
                    key="spinner"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="block"
                  >
                    <SpinnerIcon />
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="block"
                  >
                    <SendIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default React.memo(ChatInput);
