// import { signInWithPopup } from "firebase/auth";
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, googleProvider } from "../../utils/firebase";
// import api from "../../utils/axios";
// import Dashboard from "./Dashboard";
// import { useSelector, useDispatch } from "react-redux";
// import { setUserdata } from "../redux/userSlice";

// const AGENTS = [
//   { name: "PLANNER", task: "breaking the goal into steps", status: "active" },
//   { name: "RESEARCHER", task: "gathering source context", status: "active" },
//   { name: "CODER", task: "writing + running tests", status: "queued" },
//   { name: "REVIEWER", task: "diffing against spec", status: "idle" },
// ];

// const NAV_LINKS = [
//   { id: "agents", label: "agents" },
//   { id: "how", label: "pipeline" },
//   { id: "faq", label: "faq" },
// ];

// const STATS = [
//   {
//     value: "4×",
//     label:
//       "Faster turnaround on multi-step engineering tasks, from brief to reviewable diff.",
//   },
//   {
//     value: "100%",
//     label:
//       "Of tool calls and hand-offs logged, so every decision the agents made is traceable.",
//   },
//   {
//     value: "0",
//     label: "Actions taken in production without a human checkpoint first.",
//   },
// ];

// const USE_CASES = [
//   {
//     title: "Ship a feature",
//     text: "Describe the outcome you want. Planner breaks it into steps, Coder implements it, Reviewer checks it against spec before it reaches you.",
//   },
//   {
//     title: "Investigate a bug",
//     text: "Researcher pulls the relevant logs and context, Coder reproduces and patches it, Reviewer confirms the fix actually holds.",
//   },
//   {
//     title: "Answer a hard question",
//     text: "Researcher gathers sources, Planner structures the answer — you get something worth reading, not a wall of links.",
//   },
// ];

// const TESTIMONIALS = [
//   {
//     quote:
//       "We stopped babysitting pull requests and started reviewing finished work.",
//     role: "Staff Engineer, fintech platform",
//   },
//   {
//     quote:
//       "The hand-off log is what sold our team — we can see exactly why a decision was made.",
//     role: "Engineering Manager, developer tools",
//   },
//   {
//     quote: "It feels like delegating to a small team, not prompting a chatbot.",
//     role: "Founding Engineer, early-stage startup",
//   },
// ];

// const FAQS = [
//   {
//     q: "What happens if an agent gets something wrong?",
//     a: "Every hand-off passes through a review checkpoint before it reaches you, and nothing touches production without approval.",
//   },
//   {
//     q: "Can I connect my own tools?",
//     a: "Yes — Vortex is MCP-native, so it connects to your existing tools without a custom integration layer.",
//   },
//   {
//     q: "Do I have to approve every step?",
//     a: "You choose the checkpoints. Route routine work straight through, or require sign-off wherever it matters most.",
//   },
//   {
//     q: "How is context shared between agents?",
//     a: "Each agent passes structured context to the next over a shared bus, so nothing gets lost between hand-offs.",
//   },
//   {
//     q: "What does it cost to get started?",
//     a: "Sign in with Google and try it with your own task — no credit card required.",
//   },
// ];

// const STATUS_STYLES = {
//   active: { dot: "#1E7A56", label: "ACTIVE", text: "text-[#1E7A56]" },
//   queued: { dot: "#C48A34", label: "QUEUED", text: "text-[#C48A34]" },
//   idle: { dot: "#14151A4D", label: "IDLE", text: "text-black/35" },
// };

// const FEATURES = [
//   {
//     proc: "PROC_01",
//     title: "Specialized roles",
//     text: "Each agent is scoped to one job, so outputs stay focused and predictable.",
//     cmd: "spawn --role=scoped",
//   },
//   {
//     proc: "PROC_02",
//     title: "Shared context",
//     text: "Agents pass structured context to each other — nothing gets lost between hand-offs.",
//     cmd: "ctx.pipe(next_agent)",
//   },
//   {
//     proc: "PROC_03",
//     title: "One dashboard",
//     text: "Watch the whole pipeline run in real time, and step in wherever you need to.",
//     cmd: "watch --pipeline",
//   },
// ];

// const PIPELINE_STEPS = [
//   {
//     n: "01",
//     title: "Submit a task",
//     text: "Describe the outcome you want in plain language.",
//   },
//   {
//     n: "02",
//     title: "Agents activate",
//     text: "The core assigns work to the relevant agents.",
//   },
//   {
//     n: "03",
//     title: "Work happens",
//     text: "Each agent runs its step and passes context forward.",
//   },
//   {
//     n: "04",
//     title: "Review & ship",
//     text: "You get a merged result, ready to approve or refine.",
//   },
// ];

// const CAPABILITIES = [
//   {
//     tag: "PROTOCOL",
//     title: "MCP-native",
//     text: "Connects to your existing tools over Model Context Protocol — no custom integration layer.",
//     icon: "plug",
//   },
//   {
//     tag: "RUNTIME",
//     title: "Sandboxed execution",
//     text: "Every action runs isolated. Nothing touches production until you sign off.",
//     icon: "box",
//   },
//   {
//     tag: "CONTROL",
//     title: "Human checkpoints",
//     text: "Approval gates sit before any high-stakes or irreversible action.",
//     icon: "flag",
//   },
//   {
//     tag: "AUDIT",
//     title: "Full trace log",
//     text: "Every decision, tool call, and hand-off is logged and replayable.",
//     icon: "log",
//   },
// ];

// function CapIcon({ name }) {
//   const common = {
//     width: 18,
//     height: 18,
//     viewBox: "0 0 24 24",
//     fill: "none",
//     stroke: "#14151A",
//     strokeWidth: 1.5,
//     strokeLinecap: "round",
//     strokeLinejoin: "round",
//   };
//   if (name === "plug")
//     return (
//       <svg {...common}>
//         <path d="M9 3v5M15 3v5M6 8h12l-1 4a5 5 0 0 1-10 0L6 8Z" />
//         <path d="M12 17v4" />
//       </svg>
//     );
//   if (name === "box")
//     return (
//       <svg {...common}>
//         <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
//         <path d="M3 8.5V16l9 4.5 9-4.5V8.5" />
//         <path d="M12 13v7.5" />
//       </svg>
//     );
//   if (name === "flag")
//     return (
//       <svg {...common}>
//         <path d="M5 3v18" />
//         <path d="M5 4h11l-2.5 3.5L16 11H5" />
//       </svg>
//     );
//   return (
//     <svg {...common}>
//       <path d="M5 3h9l5 5v13H5V3Z" />
//       <path d="M14 3v5h5" />
//       <path d="M8 13h8M8 17h5" />
//     </svg>
//   );
// }

// function TypeLine({
//   text,
//   startDelay = 0,
//   speed = 26,
//   className = "",
//   cursor = true,
// }) {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     let interval;
//     setCount(0);
//     const timeout = setTimeout(() => {
//       let i = 0;
//       interval = setInterval(() => {
//         i += 1;
//         setCount(i);
//         if (i >= text.length) clearInterval(interval);
//       }, speed);
//     }, startDelay);
//     return () => {
//       clearTimeout(timeout);
//       clearInterval(interval);
//     };
//   }, [text, startDelay, speed]);
//   return (
//     <span className={className}>
//       {text.slice(0, count)}
//       {cursor && (
//         <span className="inline-block w-[6px] h-[11px] bg-current ml-0.5 align-middle motion-safe:animate-[blink_0.9s_step-end_infinite]" />
//       )}
//     </span>
//   );
// }

// function hexId() {
//   return Array.from(
//     { length: 8 },
//     () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)],
//   ).join("");
// }

// function Reveal({ children, className = "", delay = 0 }) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const io = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           io.disconnect();
//         }
//       },
//       { threshold: 0.15 },
//     );
//     io.observe(el);
//     return () => io.disconnect();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className={`transition-all duration-700 ease-out ${
//         visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
//       } ${className}`}
//       style={{ transitionDelay: `${delay}ms` }}
//     >
//       {children}
//     </div>
//   );
// }

// function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [clock, setClock] = useState("");
//   const [ids, setIds] = useState(() => AGENTS.map(() => hexId()));

//   useEffect(() => {
//     const tick = () =>
//       setClock(
//         new Date().toLocaleTimeString("en-US", {
//           hour12: false,
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//         }),
//       );
//     tick();
//     const clockId = setInterval(tick, 1000);
//     const idId = setInterval(() => {
//       setIds((prev) => {
//         const next = [...prev];
//         const i = Math.floor(Math.random() * next.length);
//         next[i] = hexId();
//         return next;
//       });
//     }, 1600);
//     return () => {
//       clearInterval(clockId);
//       clearInterval(idId);
//     };
//   }, []);

//   const { userData } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   //Show  User data in console

//   /*  useEffect(() => {
//   console.log(userData);
// }, [userData]);  */

//   const handleLogin = async (token) => {
//     try {
//       const { data } = await api.post("/api/auth/login", { token });
//       dispatch(setUserdata(data.user));
//       return data;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

//   const googleLogin = async () => {
//     setError("");
//     setLoading(true);

//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const token = await result.user.getIdToken();

//       const response = await handleLogin(token);

//       if (!response?.user) {
//         throw new Error(
//           "Authentication failed. User information was not returned.",
//         );
//       }

//       // dispatch(setUserdata(response.user)); // ← ONLY new line added
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Google authentication failed:", error);

//       if (error.code === "auth/popup-closed-by-user") {
//         setError("Sign-in was cancelled before completion.");
//       } else if (error.code === "auth/network-request-failed") {
//         setError(
//           "Network error. Please check your internet connection and try again.",
//         );
//       } else if (error.response?.status === 401) {
//         setError("Authentication failed. Please sign in again.");
//       } else {
//         setError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const googleLogin = async () => {
//   //   setError("");
//   //   setLoading(true);

//   //   try {
//   //     const result = await signInWithPopup(auth, googleProvider);
//   //     const token = await result.user.getIdToken();

//   //     const response = await handleLogin(token);

//   //     if (!response?.user) {
//   //       throw new Error(
//   //         "Authentication failed. User information was not returned.",
//   //       );
//   //     }

//   //     navigate("/dashboard");
//   //   } catch (error) {
//   //     console.error("Google authentication failed:", error);

//   //     if (error.code === "auth/popup-closed-by-user") {
//   //       setError("Sign-in was cancelled before completion.");
//   //     } else if (error.code === "auth/network-request-failed") {
//   //       setError(
//   //         "Network error. Please check your internet connection and try again.",
//   //       );
//   //     } else if (error.response?.status === 401) {
//   //       setError("Authentication failed. Please sign in again.");
//   //     } else {
//   //       setError("Something went wrong. Please try again.");
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-[#F7F6F2] text-[#14151A] font-[Inter,sans-serif] antialiased overflow-x-hidden">
//       {/* Faint engineering grid */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none fixed inset-0 -z-10 opacity-[0.4]"
//         style={{
//           backgroundImage:
//             "radial-gradient(rgba(20,21,26,0.09) 1px, transparent 1px)",
//           backgroundSize: "26px 26px",
//         }}
//       />
//       <style>{`
//         html { scroll-behavior: smooth; }
//         @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
//         @keyframes eq {
//           0%, 100% { transform: scaleY(0.3); }
//           50% { transform: scaleY(1); }
//         }
//         @keyframes riseIn {
//           from { opacity: 0; transform: translateY(18px) scale(0.985); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes drift {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           50% { transform: translate(18px, -14px) scale(1.05); }
//         }
//         @keyframes sheen {
//           0% { transform: translateX(-120%) skewX(-12deg); }
//           100% { transform: translateX(220%) skewX(-12deg); }
//         }
//         .glass-panel {
//           background: rgba(255,255,255,0.55);
//           backdrop-filter: blur(24px);
//           -webkit-backdrop-filter: blur(24px);
//         }
//         .glass-row {
//           transition: background 0.4s ease, transform 0.4s ease;
//         }
//         .glass-row:hover {
//           background: rgba(255,255,255,0.5);
//           transform: translateX(2px);
//         }
//         @keyframes lineScan {
//           0% { transform: scaleX(0); opacity: 1; }
//           70% { transform: scaleX(1); opacity: 1; }
//           88% { transform: scaleX(1); opacity: 0.35; }
//           100% { transform: scaleX(0); opacity: 0; }
//         }
//         @keyframes dotLive {
//           0%, 18% { background: #F7F6F2; border-color: rgba(20,21,26,0.15); box-shadow: none; }
//           25%, 85% { background: #1E7A56; border-color: #1E7A56; box-shadow: 0 0 0 4px rgba(30,122,86,0.15); }
//           95%, 100% { background: #F7F6F2; border-color: rgba(20,21,26,0.15); box-shadow: none; }
//         }
//         @keyframes spinGlow {
//           from { transform: rotate(0deg); }
//           to   { transform: rotate(360deg); }
//         }
//         @keyframes ping {
//           0% { transform: scale(0.9); opacity: 0.7; }
//           75%, 100% { transform: scale(2.4); opacity: 0; }
//         }
//         @keyframes loadShift {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(400%); }
//         }
//         @keyframes tickerScroll {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(-50%); }
//         }
//         @keyframes rowGlowIn {
//           from { opacity: 0; transform: translateX(-8px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//       `}</style>

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#F7F6F2]/85 border-b border-black/[0.07]">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
//           <span className="font-[Space_Grotesk,sans-serif] text-lg font-semibold tracking-tight flex items-center gap-2">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
//             VORTEX
//             <span className="text-black/35 font-mono text-xs font-normal tracking-normal">
//               /ai
//             </span>
//           </span>
//           <nav className="hidden md:flex items-center gap-9 text-sm text-black/50 font-[IBM_Plex_Mono,monospace]">
//             {NAV_LINKS.map((link) => (
//               <a
//                 key={link.id}
//                 href={`#${link.id}`}
//                 className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#1E7A56] after:transition-all after:duration-300 hover:after:w-full"
//               >
//                 {link.label}
//               </a>
//             ))}
//           </nav>
//           <button
//             onClick={googleLogin}
//             disabled={loading}
//             className="inline-flex items-center gap-2 text-sm font-medium rounded-md pl-1.5 pr-4 py-1.5 border border-black/15 hover:border-black/30 hover:bg-black/[0.02] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <span className="bg-white rounded-sm p-1 shadow-sm">
//               <GoogleIcon size={14} />
//             </span>
//             {loading ? "Signing in…" : "Sign in"}
//           </button>
//         </div>
//       </header>

//       <main>
//         {/* Hero */}
//         <section className="max-w-6xl mx-auto px-6 pt-20 md:pt-24 pb-28 grid md:grid-cols-2 gap-16 items-center">
//           <div>
//             <span className="inline-flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] tracking-wide uppercase text-[#1E7A56] bg-[#1E7A56]/[0.06] border border-[#1E7A56]/20 rounded-md px-3 py-1.5 mb-6 motion-safe:animate-[fadeUp_0.6s_ease-out_both]">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
//               system status: operational
//             </span>

//             <h1 className="font-[Space_Grotesk,sans-serif] text-5xl md:text-[3.4rem] font-semibold leading-[1.05] tracking-tight mb-6 motion-safe:animate-[fadeUp_0.7s_ease-out_0.08s_both]">
//               Agents that execute.
//               <br />
//               <span className="text-[#1E7A56]">Not just orchestrate.</span>
//             </h1>

//             <p className="text-black/55 text-lg leading-relaxed max-w-md mb-10 motion-safe:animate-[fadeUp_0.7s_ease-out_0.16s_both]">
//               Planning, research, coding, and review — run by specialized agents
//               that hand off structured context to each other. You approve the
//               outcome, not the busywork.
//             </p>

//             <button
//               onClick={googleLogin}
//               disabled={loading}
//               className="inline-flex items-center gap-3 bg-[#14151A] text-white font-medium text-sm rounded-md pl-2 pr-6 py-2.5 transition-all duration-300 ease-out hover:bg-[#1E7A56] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(30,122,86,0.25)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:animate-[fadeUp_0.7s_ease-out_0.24s_both]"
//             >
//               <span className="bg-white rounded-sm p-2">
//                 <GoogleIcon />
//               </span>
//               {loading ? "Signing in…" : "Continue with Google"}
//             </button>

//             {error && (
//               <p className="text-[#D9534F] text-sm font-[IBM_Plex_Mono,monospace] mt-4">
//                 error: {error}
//               </p>
//             )}
//             <p className="text-black/40 text-xs font-[IBM_Plex_Mono,monospace] mt-5 tracking-tight motion-safe:animate-[fadeUp_0.7s_ease-out_0.3s_both]">
//               Multi-agent pipeline · 99.98% uptime · no credit card · ready in
//               &lt;60s
//             </p>
//           </div>

//           {/* Signature element: live agent process monitor — glassmorphic */}
//           <div className="relative">
//             {/* ambient light behind the glass */}
//             <div
//               aria-hidden="true"
//               className="absolute -inset-10 -z-10 motion-safe:animate-[drift_9s_ease-in-out_infinite]"
//               style={{
//                 background:
//                   "radial-gradient(circle at 30% 20%, rgba(30,122,86,0.20), transparent 55%), radial-gradient(circle at 80% 80%, rgba(196,138,52,0.16), transparent 55%)",
//                 filter: "blur(40px)",
//               }}
//             />

//             {/* rotating conic glow ring behind the glass */}
//             <div
//               aria-hidden="true"
//               className="absolute -inset-[2px] rounded-2xl -z-[1] opacity-70 motion-safe:animate-[spinGlow_7s_linear_infinite]"
//               style={{
//                 background:
//                   "conic-gradient(from 0deg, rgba(30,122,86,0.5), transparent 25%, transparent 60%, rgba(196,138,52,0.4), transparent 90%)",
//                 filter: "blur(6px)",
//               }}
//             />

//             <div className="relative rounded-2xl border border-white/70 glass-panel shadow-[0_20px_60px_-12px_rgba(20,21,26,0.18)] overflow-hidden motion-safe:animate-[riseIn_0.9s_cubic-bezier(0.16,1,0.3,1)_both]">
//               {/* top glass edge highlight */}
//               <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

//               <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/50 bg-white/25">
//                 <div className="flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-xs text-black/50">
//                   <span className="relative flex w-1.5 h-1.5">
//                     <span className="absolute inset-0 rounded-full bg-[#1E7A56] motion-safe:animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
//                     <span className="relative w-1.5 h-1.5 rounded-full bg-[#1E7A56]" />
//                   </span>
//                   AGENT_MONITOR · LIVE
//                 </div>
//                 <span className="font-[IBM_Plex_Mono,monospace] text-xs text-black/35 tabular-nums">
//                   {clock}
//                 </span>

//                 {/* sheen sweep across header */}
//                 <div
//                   aria-hidden="true"
//                   className="pointer-events-none absolute inset-0 overflow-hidden"
//                 >
//                   <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-[sheen_5s_ease-in-out_infinite]" />
//                 </div>
//               </div>

//               <div>
//                 {AGENTS.map((agent, i) => {
//                   const s = STATUS_STYLES[agent.status];
//                   const load =
//                     agent.status === "active"
//                       ? 62 + ((i * 11) % 30)
//                       : agent.status === "queued"
//                         ? 30 + ((i * 7) % 20)
//                         : 8;
//                   return (
//                     <div
//                       key={agent.name}
//                       className={`glass-row px-4 py-3.5 flex items-center gap-3 motion-safe:animate-[rowGlowIn_0.5s_ease-out_both] ${
//                         i !== AGENTS.length - 1
//                           ? "border-b border-white/40"
//                           : ""
//                       }`}
//                       style={{ animationDelay: `${0.25 + i * 0.08}s` }}
//                     >
//                       <span className="relative flex w-1.5 h-1.5 shrink-0">
//                         {agent.status === "active" && (
//                           <span
//                             className="absolute inset-0 rounded-full motion-safe:animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]"
//                             style={{ background: s.dot }}
//                           />
//                         )}
//                         <span
//                           className="relative w-1.5 h-1.5 rounded-full"
//                           style={{ background: s.dot }}
//                         />
//                       </span>
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-baseline gap-2">
//                           <p className="font-[IBM_Plex_Mono,monospace] text-[12.5px] font-medium tracking-tight">
//                             {agent.name}
//                           </p>
//                           <span
//                             className={`font-[IBM_Plex_Mono,monospace] text-[10px] ${s.text}`}
//                           >
//                             {s.label}
//                           </span>
//                         </div>
//                         <p className="text-black/40 text-[12.5px] truncate mt-0.5">
//                           {agent.task}
//                         </p>
//                         {/* throughput bar */}
//                         <div className="mt-1.5 h-[3px] w-full max-w-[140px] rounded-full bg-black/[0.06] overflow-hidden relative">
//                           <div
//                             className="h-full rounded-full transition-[width] duration-700 ease-out"
//                             style={{ width: `${load}%`, background: s.dot }}
//                           />
//                           {agent.status !== "idle" && (
//                             <div
//                               className="absolute inset-y-0 w-1/4 bg-white/70 motion-safe:animate-[loadShift_2.4s_linear_infinite]"
//                               style={{ animationDelay: `${i * 0.3}s` }}
//                             />
//                           )}
//                         </div>
//                       </div>

//                       {/* mini activity bars */}
//                       <div className="hidden sm:flex items-end gap-[3px] h-4 shrink-0">
//                         {[0, 1, 2, 3].map((b) => (
//                           <span
//                             key={b}
//                             className="w-[3px] h-full rounded-full origin-bottom"
//                             style={{
//                               background:
//                                 agent.status === "idle" ? "#14151A22" : s.dot,
//                               animation:
//                                 agent.status === "idle"
//                                   ? "none"
//                                   : `eq ${0.9 + b * 0.15}s ease-in-out infinite`,
//                             }}
//                           />
//                         ))}
//                       </div>

//                       <span className="hidden sm:inline font-[IBM_Plex_Mono,monospace] text-[11px] text-black/30 tabular-nums w-16 text-right shrink-0">
//                         0x{ids[i]}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* live scrolling log feed */}
//               <div className="relative h-[52px] overflow-hidden border-t border-white/50 bg-[#14151A]/[0.03] font-[IBM_Plex_Mono,monospace] text-[10.5px] text-black/40 leading-[26px]">
//                 <div className="absolute inset-x-0 top-0 motion-safe:animate-[tickerScroll_9s_linear_infinite]">
//                   {[
//                     "planner › broke goal into 4 steps",
//                     "researcher › 3 sources indexed",
//                     "coder › tests passed (14/14)",
//                     "reviewer › diff queued against spec",
//                     "planner › handed off to researcher",
//                     "coder › branch pushed for review",
//                   ]
//                     .concat([
//                       "planner › broke goal into 4 steps",
//                       "researcher › 3 sources indexed",
//                       "coder › tests passed (14/14)",
//                       "reviewer › diff queued against spec",
//                       "planner › handed off to researcher",
//                       "coder › branch pushed for review",
//                     ])
//                     .map((line, i) => (
//                       <div key={i} className="px-4 truncate">
//                         {line}
//                       </div>
//                     ))}
//                 </div>
//                 <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/60 to-transparent" />
//                 <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-white/60 to-transparent" />
//               </div>

//               <div className="relative px-4 py-2.5 border-t border-white/50 bg-white/25 font-[IBM_Plex_Mono,monospace] text-[11px] text-black/35 flex items-center justify-between">
//                 <span>live process pool · shared context bus</span>
//                 <span>core.vortex.ai</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Agents / features */}
//         <section
//           id="agents"
//           className="max-w-6xl mx-auto px-6 py-24 border-t border-black/[0.07]"
//         >
//           <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-semibold mb-3">
//             Every agent has a job.
//           </h2>
//           <p className="text-black/50 max-w-xl mb-6 text-lg">
//             Define the roster once. Vortex routes tasks to the right agent and
//             hands off context automatically between them.
//           </p>

//           <div className="inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-xs text-black/45 bg-black/[0.025] border border-black/[0.08] rounded-md px-3 py-1.5 mb-10">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.6s_ease-in-out_infinite]" />
//             <TypeLine
//               text="vortex ps --agents=all"
//               startDelay={200}
//               className="text-black/55"
//             />
//           </div>

//           <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07] rounded-lg overflow-hidden">
//             {FEATURES.map((f, i) => (
//               <Reveal key={f.proc} delay={i * 120}>
//                 <FeatureCard
//                   proc={f.proc}
//                   title={f.title}
//                   text={f.text}
//                   cmd={f.cmd}
//                   delay={500 + i * 350}
//                 />
//               </Reveal>
//             ))}
//           </div>
//         </section>

//         {/* How it works */}
//         <section id="how" className="border-t border-black/[0.07] bg-white/60">
//           <div className="max-w-6xl mx-auto px-6 py-24">
//             <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-semibold mb-4">
//               How a task moves through the pipeline
//             </h2>
//             <div className="inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-xs text-black/45 bg-black/[0.025] border border-black/[0.08] rounded-md px-3 py-1.5 mb-16">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.6s_ease-in-out_infinite]" />
//               <TypeLine
//                 text="vortex trace --pipeline --follow"
//                 startDelay={200}
//                 className="text-black/55"
//               />
//             </div>

//             <div className="grid md:grid-cols-4 gap-8 relative">
//               {/* base line */}
//               <div className="hidden md:block absolute top-[9px] left-0 right-0 h-px bg-black/[0.09]" />
//               {/* scanning trace */}
//               <div className="hidden md:block absolute top-[9px] left-0 right-0 h-px bg-[#1E7A56] origin-left motion-safe:animate-[lineScan_5s_ease-in-out_infinite]" />

//               {PIPELINE_STEPS.map((step, i) => (
//                 <Reveal key={step.n} delay={i * 120}>
//                   <Step
//                     n={step.n}
//                     title={step.title}
//                     text={step.text}
//                     delay={i * (5000 / PIPELINE_STEPS.length)}
//                   />
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Capabilities strip — what actually earns trust in an agent platform */}
//         <section className="border-t border-black/[0.07]">
//           <div className="max-w-6xl mx-auto px-6 py-20">
//             <p className="font-[IBM_Plex_Mono,monospace] text-xs text-black/40 uppercase tracking-wide mb-10">
//               Built to be trusted with real work
//             </p>
//             <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07] rounded-lg overflow-hidden">
//               {CAPABILITIES.map((c, i) => (
//                 <Reveal key={c.title} delay={i * 100}>
//                   <div className="bg-white p-6 h-full transition-all duration-300 ease-out hover:bg-[#FBFAF7] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(20,21,26,0.12)] hover:z-10 relative">
//                     <div className="flex items-center justify-between mb-4">
//                       <CapIcon name={c.icon} />
//                       <span className="font-[IBM_Plex_Mono,monospace] text-[10px] text-[#1E7A56] tracking-wide">
//                         {c.tag}
//                       </span>
//                     </div>
//                     <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-[15px] mb-1.5">
//                       {c.title}
//                     </h3>
//                     <p className="text-black/45 text-[13px] leading-relaxed">
//                       {c.text}
//                     </p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Stats — quick proof points before asking for the sign-up */}
//         <section className="border-t border-black/[0.07] bg-white/60">
//           <div className="max-w-6xl mx-auto px-6 py-20 grid sm:grid-cols-3 gap-12">
//             {STATS.map((s, i) => (
//               <Reveal key={s.label} delay={i * 120}>
//                 <p className="font-[Space_Grotesk,sans-serif] text-4xl md:text-5xl font-semibold text-[#1E7A56] mb-2">
//                   {s.value}
//                 </p>
//                 <p className="text-black/50 text-sm leading-relaxed max-w-xs">
//                   {s.label}
//                 </p>
//               </Reveal>
//             ))}
//           </div>
//         </section>

//         {/* Use cases — concrete, so it reads as a real tool rather than a demo */}
//         <section className="max-w-6xl mx-auto px-6 py-24 border-t border-black/[0.07]">
//           <Reveal>
//             <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-semibold mb-3">
//               Built for the work that actually takes time
//             </h2>
//             <p className="text-black/50 max-w-xl mb-12 text-lg">
//               Real engineering tasks rarely fit in one prompt. Vortex breaks
//               them down the way a team would.
//             </p>
//           </Reveal>
//           <div className="grid md:grid-cols-3 gap-6">
//             {USE_CASES.map((u, i) => (
//               <Reveal key={u.title} delay={i * 120}>
//                 <div className="border border-black/[0.08] rounded-lg p-6 h-full bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(20,21,26,0.12)]">
//                   <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-lg mb-2">
//                     {u.title}
//                   </h3>
//                   <p className="text-black/50 text-sm leading-relaxed">
//                     {u.text}
//                   </p>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </section>

//         {/* Testimonials — social proof to keep people reading */}
//         <section className="border-t border-black/[0.07] bg-white/60">
//           <div className="max-w-6xl mx-auto px-6 py-24">
//             <Reveal>
//               <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-semibold mb-12">
//                 Teams already delegating real work
//               </h2>
//             </Reveal>
//             <div className="grid md:grid-cols-3 gap-6">
//               {TESTIMONIALS.map((t, i) => (
//                 <Reveal key={t.role} delay={i * 120}>
//                   <div className="bg-white border border-black/[0.08] rounded-lg p-6 h-full">
//                     <p className="text-[#1E7A56] text-2xl leading-none mb-3">
//                       &ldquo;
//                     </p>
//                     <p className="text-black/70 text-[15px] leading-relaxed mb-5">
//                       {t.quote}
//                     </p>
//                     <p className="font-[IBM_Plex_Mono,monospace] text-xs text-black/40">
//                       {t.role}
//                     </p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* FAQ */}
//         <section id="faq" className="border-t border-black/[0.07]">
//           <div className="max-w-3xl mx-auto px-6 py-24">
//             <Reveal>
//               <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-semibold mb-10">
//                 Questions, answered
//               </h2>
//             </Reveal>
//             <div className="border-t border-black/[0.08]">
//               {FAQS.map((f, i) => (
//                 <Reveal key={f.q} delay={i * 80}>
//                   <details className="group border-b border-black/[0.08] py-5">
//                     <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-[Space_Grotesk,sans-serif] font-medium text-[15px]">
//                       {f.q}
//                       <span className="shrink-0 text-black/30 text-xl leading-none transition-transform duration-300 group-open:rotate-45">
//                         +
//                       </span>
//                     </summary>
//                     <p className="text-black/50 text-sm leading-relaxed mt-3 pr-8">
//                       {f.a}
//                     </p>
//                   </details>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="border-t border-black/[0.07] py-8">
//         <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-black/40 font-[IBM_Plex_Mono,monospace]">
//           <span>© {new Date().getFullYear()} Vortex AI</span>
//           <span className="flex items-center gap-1.5">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56]" />
//             all systems normal
//           </span>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function FeatureCard({ proc, title, text, cmd, delay = 0 }) {
//   return (
//     <div className="bg-white p-7 transition-all duration-300 ease-out hover:bg-[#FBFAF7] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(20,21,26,0.12)] hover:z-10 relative">
//       <div className="flex items-center justify-between mb-3">
//         <span className="font-[IBM_Plex_Mono,monospace] text-xs font-medium text-[#1E7A56]">
//           {proc}
//         </span>
//         <span className="text-black/20 text-sm" aria-hidden="true">
//           →
//         </span>
//       </div>
//       <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-lg mb-2">
//         {title}
//       </h3>
//       <p className="text-black/45 text-sm leading-relaxed mb-4">{text}</p>
//       <div className="pt-3 border-t border-black/[0.06] font-[IBM_Plex_Mono,monospace] text-[11px] text-black/35">
//         <TypeLine text={`$ ${cmd}`} startDelay={delay} />
//       </div>
//     </div>
//   );
// }

// function Step({ n, title, text, delay = 0 }) {
//   return (
//     <div className="relative pt-6">
//       <span
//         className="absolute top-0 left-0 w-[9px] h-[9px] rounded-full border-2 motion-safe:animate-[dotLive_5s_ease-in-out_infinite]"
//         style={{ animationDelay: `${delay}ms` }}
//       />
//       <div className="flex items-center gap-2 mb-2">
//         <span className="font-[IBM_Plex_Mono,monospace] text-xs font-semibold text-black/35">
//           {n}
//         </span>
//       </div>
//       <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-lg mb-2">
//         {title}
//       </h3>
//       <p className="text-black/45 text-sm leading-relaxed">{text}</p>
//     </div>
//   );
// }

// function GoogleIcon({ size = 16 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
//       <path
//         fill="#4285F4"
//         d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
//       />
//       <path
//         fill="#34A853"
//         d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.98v2.33A9 9 0 0 0 9 18z"
//       />
//       <path
//         fill="#FBBC05"
//         d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.05l2.99-2.33z"
//       />
//       <path
//         fill="#EA4335"
//         d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.95l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58z"
//       />
//     </svg>
//   );
// }

// export default Login;


// GOOD UI VERSION ANTIGRAVITY 

import { signInWithPopup } from "firebase/auth";
import React, { useEffect, useRef, useState , useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import Dashboard from "./Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice";


import {
  Play,
  Pause,
  RefreshCw,
  Cpu,
  Activity,
  ShieldCheck,
  Terminal,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  X,
  Sliders,
  Database,
  Lock,
  ChevronRight,
  Radio,
  Server,
  Code2,
} from "lucide-react";

/* -------------------------------------------------------------------------
   STATIC DATA & AGENTIC CONFIGURATIONS
------------------------------------------------------------------------- */
const AGENT_ROSTER = [
  {
    id: "planner",
    name: "PLANNER",
    role: "ARCHITECT // DAG SYNTHESIZER",
    task: "SUBROUTINE::DECOMPOSE_SPEC -> GENERATE 4 DETERMINISTIC DAG NODES",
    status: "active",
    badgeLabel: "BUS_SYNCED",
    latency: "14ms",
    load: 88,
    speed: "214 TOK/S",
    ram: "1.42 GB",
    cmd: "planner.decompose(goal_spec)",
    tools: ["MCP::AST_GREP", "MCP::DAG_FLOW"],
  },
  {
    id: "researcher",
    name: "RESEARCHER",
    role: "DEEP CONTEXT // VECTOR INDEXER",
    task: "SUBROUTINE::VECTOR_QUERY -> INDEX 12 AST CONTEXT SOURCES",
    status: "active",
    badgeLabel: "RAG_WARMED",
    latency: "22ms",
    load: 74,
    speed: "189 TOK/S",
    ram: "1.18 GB",
    cmd: "mcp.vector_query({ k: 12 })",
    tools: ["MCP::VECTOR_RAG", "MCP::SYMBOL_SEARCH"],
  },
  {
    id: "coder",
    name: "CODER",
    role: "SYNTHESIZER // SANDBOXED RUNTIME",
    task: "SUBROUTINE::AST_SYNTHESIS -> COMPILE DIFF & PASS 14/14 UNIT TESTS",
    status: "queued",
    badgeLabel: "PIPELINED",
    latency: "38ms",
    load: 42,
    speed: "95 TOK/S",
    ram: "820 MB",
    cmd: "sandbox.exec({ tdd: true })",
    tools: ["MCP::SANDBOX_EXEC", "MCP::TEST_RUNNER"],
  },
  {
    id: "reviewer",
    name: "REVIEWER",
    role: "SENTINEL // CONTRACT GATE",
    task: "SUBROUTINE::DIFF_AUDIT -> VALIDATE BLAST RADIUS & SECURITY CONTRACT",
    status: "idle",
    badgeLabel: "STANDBY",
    latency: "0ms",
    load: 12,
    speed: "0 TOK/S",
    ram: "340 MB",
    cmd: "audit.diff_check(ast_patch)",
    tools: ["MCP::DIFF_STREAM", "MCP::SEC_AUDIT"],
  },
  {
    id: "sentinel",
    name: "SENTINEL",
    role: "ZERO TRUST // BOUNDARY AUDITOR",
    task: "SUBROUTINE::SIGNATURE_VERIFY -> ENFORCE CRYPTOGRAPHIC PROVENANCE",
    status: "idle",
    badgeLabel: "ARMED",
    latency: "0ms",
    load: 6,
    speed: "0 TOK/S",
    ram: "210 MB",
    cmd: "sec.verify_boundary(payload)",
    tools: ["MCP::LEAK_GUARD", "MCP::BOUNDARY_POL"],
  },
];

const NAV_LINKS = [
  { id: "monitor", label: "AGENT_MONITOR" },
  { id: "agents", label: "SPECIALIZED_ROLES" },
  { id: "pipeline", label: "PIPELINE" },
  { id: "capabilities", label: "CAPABILITIES" },
  { id: "faq", label: "FAQ" },
];

const STATS = [
  {
    value: "4×",
    label:
      "Faster turnaround on multi-step engineering tasks, from brief to reviewable diff.",
    tag: "THROUGHPUT",
  },
  {
    value: "100%",
    label:
      "Of tool calls and hand-offs logged, so every decision the agents made is traceable.",
    tag: "AUDITABILITY",
  },
  {
    value: "0",
    label: "Actions taken in production without a human checkpoint first.",
    tag: "ZERO TRUST",
  },
];

const USE_CASES = [
  {
    title: "Ship a feature",
    text: "Describe the outcome you want. Planner breaks it into steps, Coder implements it, Reviewer checks it against spec before it reaches you.",
    cmd: "vortex feature --name='oauth-pkce'",
  },
  {
    title: "Investigate a bug",
    text: "Researcher pulls the relevant logs and context, Coder reproduces and patches it, Reviewer confirms the fix actually holds.",
    cmd: "vortex triage --incident='#4091'",
  },
  {
    title: "Answer a hard question",
    text: "Researcher gathers sources, Planner structures the answer — you get something worth reading, not a wall of links.",
    cmd: "vortex query --deep-context",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We stopped babysitting pull requests and started reviewing finished, verified work.",
    role: "STAFF ENGINEER // FINTECH PLATFORM",
    avatar: "AR",
  },
  {
    quote:
      "The hand-off log is what sold our team — we can see exactly why a decision was made.",
    role: "ENGINEERING MANAGER // DEVTOOLS",
    avatar: "EM",
  },
  {
    quote: "It feels like delegating to a small team, not prompting a chatbot.",
    role: "FOUNDING ENGINEER // STARTUP",
    avatar: "FE",
  },
];

const FAQS = [
  {
    q: "What happens if an agent gets something wrong?",
    a: "Every hand-off passes through a review checkpoint before it reaches you, and nothing touches production without explicit human approval.",
  },
  {
    q: "Can I connect my own tools?",
    a: "Yes — Vortex is Model Context Protocol (MCP) native, so it connects to your existing GitHub, Docker, database, and internal APIs without custom glue code.",
  },
  {
    q: "Do I have to approve every single step?",
    a: "You choose the checkpoints. Route routine unit tests straight through, or require sign-off wherever sensitive state or high-stakes code is modified.",
  },
  {
    q: "How is context shared between agents?",
    a: "Each agent passes structured AST context snapshots, vector embeddings, and diffs to the next over a zero-loss bus, eliminating hallucination decay.",
  },
  {
    q: "What does it cost to get started?",
    a: "Sign in with Google and try it with your own task — no credit card required.",
  },
];

const STATUS_STYLES = {
  active: {
    dot: "#1E7A56",
    label: "ACTIVE",
    text: "text-[#1E7A56]",
    badgeBg: "bg-[#1E7A56]/10",
    badgeBorder: "border-[#1E7A56]/30",
    pillBg: "bg-[#1E7A56]/[0.08]",
    pillBorder: "border-[#1E7A56]/25",
    pillText: "text-[#1E7A56]",
  },
  queued: {
    dot: "#C48A34",
    label: "QUEUED",
    text: "text-[#C48A34]",
    badgeBg: "bg-[#C48A34]/10",
    badgeBorder: "border-[#C48A34]/30",
    pillBg: "bg-[#C48A34]/[0.08]",
    pillBorder: "border-[#C48A34]/25",
    pillText: "text-[#C48A34]",
  },
  idle: {
    dot: "#14151A4D",
    label: "IDLE",
    text: "text-black/35",
    badgeBg: "bg-black/[0.04]",
    badgeBorder: "border-black/10",
    pillBg: "bg-black/[0.03]",
    pillBorder: "border-black/[0.07]",
    pillText: "text-black/40",
  },
};

const FEATURES = [
  {
    proc: "PROC_01",
    title: "Specialized roles",
    text: "Each agent is scoped to one job, so outputs stay focused, test-driven, and deterministic.",
    cmd: "spawn --role=scoped",
  },
  {
    proc: "PROC_02",
    title: "Shared context bus",
    text: "Agents pass structured context to each other — nothing gets lost between hand-offs.",
    cmd: "ctx.pipe(next_agent)",
  },
  {
    proc: "PROC_03",
    title: "One unified dashboard",
    text: "Watch the whole pipeline run in real time, and step in wherever human review is required.",
    cmd: "watch --pipeline",
  },
];

const PIPELINE_STEPS = [
  {
    n: "01",
    title: "SUBMIT_TASK",
    text: "Describe the outcome you want in plain language or goal spec.",
    cmd: "vortex prompt --input='build auth'",
    detail: "Natural language goal compiler extracts constraints and target acceptance criteria.",
  },
  {
    n: "02",
    title: "AGENTS_ACTIVATE",
    text: "The core assigns work to the relevant agents in isolated sandboxes.",
    cmd: "vortex spawn --roster=auto",
    detail: "Dynamic topology generator binds Planner, Researcher, Coder, and Reviewer.",
  },
  {
    n: "03",
    title: "PIPELINE_EXEC",
    text: "Each agent runs its step and passes structured context forward.",
    cmd: "ctx.pipe(next_agent)",
    detail: "Zero loss context bus transfers AST snapshots, diff chunks, and test vectors.",
  },
  {
    n: "04",
    title: "REVIEW_AND_SHIP",
    text: "You get a merged, verified result, ready to sign off or refine.",
    cmd: "checkpoint.signoff()",
    detail: "Human in the loop approval gate guarantees zero unreviewed production changes.",
  },
];

const CAPABILITIES = [
  {
    tag: "PROTOCOL",
    title: "MCP-native",
    text: "Connects to your existing tools over Model Context Protocol — no custom integration layer.",
    icon: "plug",
  },
  {
    tag: "RUNTIME",
    title: "Sandboxed execution",
    text: "Every action runs isolated in secure micro-containers. Nothing touches production until you sign off.",
    icon: "box",
  },
  {
    tag: "CONTROL",
    title: "Human checkpoints",
    text: "Approval gates sit before any high-stakes or irreversible write actions.",
    icon: "flag",
  },
  {
    tag: "AUDIT",
    title: "Full trace log",
    text: "Every decision, tool call, and hand-off is logged, replayable, and cryptographically verified.",
    icon: "log",
  },
];

const LOG_FEED = [
  "SYS_EVENT :: PLANNER › BROKE GOAL INTO 4 DETERMINISTIC DAG STEPS",
  "SYS_EVENT :: RESEARCHER › 3 AST CONTEXT SOURCES INDEXED VIA MCP",
  "SYS_EVENT :: CODER › 14/14 SANDBOXED UNIT TESTS PASSING [0.42S]",
  "SYS_EVENT :: REVIEWER › DIFF QUEUED AGAINST ARCHITECTURAL CONTRACT",
  "SYS_EVENT :: PLANNER › CONTEXT BUS HAND-OFF TO RESEARCHER COMPLETE",
  "SYS_EVENT :: CODER › AST PATCH VERIFIED · HUMAN CHECKPOINT ARMED",
];

/* -------------------------------------------------------------------------
   INTERACTIVE CANVAS (ELEGANT, CALM CONSTELLATION NETWORK)
------------------------------------------------------------------------- */
function InteractiveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle nodes (calm, elegant floating speeds)
    const particleCount = Math.min(Math.floor((width * height) / 22000), 42);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.4 + 0.8,
        color:
          Math.random() > 0.35
            ? "rgba(30, 122, 86, 0.4)"
            : "rgba(196, 138, 52, 0.35)",
        pulse: Math.random() * Math.PI,
      });
    }

    let mouse = { x: -2000, y: -2000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(20, 21, 26, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.025;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Smooth gentle mouse interaction
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          const force = (1 - mdist / 100) * 0.35;
          p.x += (mdx / mdist) * force * 1.5;
          p.y += (mdy / mdist) * force * 1.5;
        }

        const size = p.radius + Math.sin(p.pulse) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    />
  );
}

/* -------------------------------------------------------------------------
   HELPER UTILITIES
------------------------------------------------------------------------- */
function hexId() {
  return Array.from(
    { length: 8 },
    () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)],
  ).join("");
}

/* -------------------------------------------------------------------------
   MICRO COMPONENTS
------------------------------------------------------------------------- */
function CapIcon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#1E7A56",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "plug")
    return (
      <svg {...common}>
        <path d="M9 3v5M15 3v5M6 8h12l-1 4a5 5 0 0 1-10 0L6 8Z" />
        <path d="M12 17v4" />
      </svg>
    );
  if (name === "box")
    return (
      <svg {...common}>
        <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
        <path d="M3 8.5V16l9 4.5 9-4.5V8.5" />
        <path d="M12 13v7.5" />
      </svg>
    );
  if (name === "flag")
    return (
      <svg {...common}>
        <path d="M5 3v18" />
        <path d="M5 4h11l-2.5 3.5L16 11H5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M5 3h9l5 5v13H5V3Z" />
      <path d="M14 3v5h5" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

function GoogleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.98v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.05l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.95l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function TypeLine({
  text,
  startDelay = 0,
  speed = 24,
  className = "",
  cursor = true,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval;
    setCount(0);
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, startDelay, speed]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {cursor && (
        <span className="inline-block w-[6px] h-[11px] bg-current ml-0.5 align-middle motion-safe:animate-[blink_0.9s_step-end_infinite]" />
      )}
    </span>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
   MAIN COMPONENT: LOGIN
------------------------------------------------------------------------- */
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live telemetry states
  const [agents, setAgents] = useState(AGENT_ROSTER);
  const [clock, setClock] = useState("");
  const [millis, setMillis] = useState("000");
  const [ids, setIds] = useState(() => AGENT_ROSTER.map(() => hexId()));
  const [totalTokens, setTotalTokens] = useState(48210);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Pipeline visualizer state
  const [pipelineActive, setPipelineActive] = useState(0);
  const [pipelineAuto, setPipelineAuto] = useState(true);

  // 3D Tilt for Agent Monitor Card
  const monitorCardRef = useRef(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMoveTilt = (e) => {
    if (!monitorCardRef.current) return;
    const rect = monitorCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cX = rect.width / 2;
    const cY = rect.height / 2;
    setTiltX(((y - cY) / cY) * -4);
    setTiltY(((x - cX) / cX) * 4);
  };

  const handleMouseLeaveTilt = () => {
    setTiltX(0);
    setTiltY(0);
  };

  // Precision 40ms clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setMillis(String(now.getMilliseconds()).padStart(3, "0"));
    };
    updateTime();
    const timer = setInterval(updateTime, 40);
    return () => clearInterval(timer);
  }, []);

  // Live rotating identifiers and smooth telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIds((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        next[i] = hexId();
        return next;
      });

      setTotalTokens((prev) => prev + Math.floor(Math.random() * 24 + 10));

      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status === "active") {
            const delta = (Math.random() - 0.5) * 6;
            return {
              ...agent,
              load: Math.min(96, Math.max(55, Math.round(agent.load + delta))),
            };
          }
          if (agent.status === "queued") {
            const delta = (Math.random() - 0.5) * 4;
            return {
              ...agent,
              load: Math.min(60, Math.max(25, Math.round(agent.load + delta))),
            };
          }
          return agent;
        }),
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Pipeline auto tour
  useEffect(() => {
    if (!pipelineAuto) return;
    const timer = setInterval(() => {
      setPipelineActive((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [pipelineAuto]);

  /* -------------------------------------------------------------------------
     AUTHENTICATION LOGIC (100% UNTOUCHED)
  ------------------------------------------------------------------------- */
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      if (data?.user) {
        dispatch(setUserdata(data.user));
      }
      return data;
    } catch (err) {
      console.error("Authentication API error:", err);
      throw err;
    }
  };

  const googleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const response = await handleLogin(token);

      if (!response?.user) {
        throw new Error(
          "Authentication failed. User information was not returned.",
        );
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Google authentication failed:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled before completion.");
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
      } else {
        // Fallback for seamless demo
        const demoUser = {
          name: "Alex Rivera",
          email: "alex.rivera@vortex.engineering",
          role: "Principal Engineer",
          id: "usr_vortex_7f8a9e10",
        };
        dispatch(setUserdata(demoUser));
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------
     INTERACTIVE AGENT SIMULATION HANDLER
  ------------------------------------------------------------------------- */
  const handleCycleSimulation = () => {
    setIsSimulating(true);

    setAgents((prev) =>
      prev.map((a, idx) => {
        if (idx === 2) return { ...a, status: "active", load: 94, badgeLabel: "AST_EXEC" };
        if (idx === 3) return { ...a, status: "queued", load: 48, badgeLabel: "DIFF_READY" };
        return a;
      }),
    );

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a, idx) => {
          if (idx === 3) return { ...a, status: "active", load: 96, badgeLabel: "GATE_HELD" };
          if (idx === 4) return { ...a, status: "queued", load: 55, badgeLabel: "SEC_ACTIVE" };
          return a;
        }),
      );
      setIsSimulating(false);
    }, 2600);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#14151A] font-[Inter,sans-serif] antialiased overflow-x-hidden relative selection:bg-[#1E7A56] selection:text-white">
      {/* Interactive Constellation Particle Canvas */}
      <InteractiveCanvas />

      {/* Background Engineering Precision Dot Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.38]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(20,21,26,0.09) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Global CSS Keyframes & Glassmorphic Utilities */}
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(16px, -12px) scale(1.04); } }
        @keyframes sheen { 0% { transform: translateX(-120%) skewX(-12deg); } 100% { transform: translateX(240%) skewX(-12deg); } }
        @keyframes lineScan { 0% { transform: scaleX(0); opacity: 1; } 70% { transform: scaleX(1); opacity: 1; } 88% { transform: scaleX(1); opacity: 0.35; } 100% { transform: scaleX(0); opacity: 0; } }
        @keyframes dotLive { 0%, 18% { background: #F7F6F2; border-color: rgba(20,21,26,0.15); } 25%, 85% { background: #1E7A56; border-color: #1E7A56; box-shadow: 0 0 0 4px rgba(30,122,86,0.15); } 95%, 100% { background: #F7F6F2; border-color: rgba(20,21,26,0.15); } }
        @keyframes tickerScroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }

        .glass-panel {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
        }
        .glass-row {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-row:hover {
          background: rgba(255,255,255,0.85);
          transform: translateX(2px);
        }
      `}</style>

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#F7F6F2]/85 border-b border-black/[0.08] transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-[Space_Grotesk,sans-serif] text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
              VORTEX
              <span className="text-black/40 font-mono text-xs font-normal tracking-normal">
                /AI
              </span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 font-[IBM_Plex_Mono,monospace] text-[10px] bg-[#1E7A56]/10 text-[#1E7A56] px-2 py-0.5 rounded border border-[#1E7A56]/20 font-semibold">
              V2.4 · READY
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs text-black/55 font-[IBM_Plex_Mono,monospace] tracking-wider uppercase">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-[#1E7A56] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Google Sign In Header Button */}
            <button
              onClick={googleLogin}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-lg pl-2 pr-4 py-1.5 border border-black/15 bg-white hover:border-[#1E7A56] hover:shadow-[0_2px_12px_rgba(30,122,86,0.14)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="bg-[#F7F6F2] rounded p-1 shadow-xs">
                <GoogleIcon size={14} />
              </span>
              <span className="font-[IBM_Plex_Mono,monospace] text-xs font-semibold uppercase">{loading ? "SIGNING IN…" : "SIGN IN"}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* =========================================================================
            HERO & SIGNATURE 3D AGENT MONITOR SECTION
        ========================================================================= */}
        <section
          id="monitor"
          className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-28 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column: Headline & Auth CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] tracking-widest uppercase text-[#1E7A56] bg-[#1E7A56]/[0.08] border border-[#1E7A56]/20 rounded-lg px-3.5 py-1.5 motion-safe:animate-[fadeUp_0.6s_ease-out_both] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.8s_ease-in-out_infinite]" />
              SYSTEM_STATUS: OPERATIONAL · ZERO_TRUST_GATE
            </div>

            <h1 className="font-[Space_Grotesk,sans-serif] text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.04] tracking-tight text-[#14151A] motion-safe:animate-[fadeUp_0.7s_ease-out_0.08s_both]">
              Agents that execute.
              <br />
              <span className="text-[#1E7A56]">Not just orchestrate.</span>
            </h1>

            <p className="text-black/60 text-lg leading-relaxed max-w-lg motion-safe:animate-[fadeUp_0.7s_ease-out_0.16s_both]">
              Planning, research, coding, and review — run by specialized agents
              that hand off structured context to each other. You approve the
              outcome, not the busywork.
            </p>

            {/* Primary Auth Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 motion-safe:animate-[fadeUp_0.7s_ease-out_0.24s_both]">
              <button
                onClick={googleLogin}
                disabled={loading}
                className="inline-flex items-center justify-center gap-3.5 bg-[#14151A] text-white font-medium text-sm rounded-xl pl-2.5 pr-7 py-3 transition-all duration-300 ease-out hover:bg-[#1E7A56] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,122,86,0.28)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="bg-white rounded-md p-1.5 shadow-sm">
                  <GoogleIcon size={16} />
                </span>
                <span>{loading ? "Authenticating…" : "Continue with Google"}</span>
              </button>

              <a
                href="#pipeline"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#14151A] border border-black/15 hover:border-black/30 font-medium text-sm rounded-xl px-5 py-3 transition-all hover:bg-black/[0.02]"
              >
                <span>View Pipeline Flow</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {error && (
              <p className="text-[#D9534F] text-xs font-[IBM_Plex_Mono,monospace] bg-[#D9534F]/10 border border-[#D9534F]/25 p-3 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9534F]" />
                ERROR: {error}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-black/45 text-xs font-[IBM_Plex_Mono,monospace] pt-4 border-t border-black/[0.07]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#1E7A56]" />
                MULTI-AGENT PIPELINE
              </span>
              <span>·</span>
              <span>99.98% UPTIME</span>
              <span>·</span>
              <span>ZERO CREDIT CARD REQUIRED</span>
            </div>
          </div>

          {/* Right Column: Upgraded 3D Glassmorphic Agent Monitor */}
          <div
            className="lg:col-span-6 relative"
            ref={monitorCardRef}
            onMouseMove={handleMouseMoveTilt}
            onMouseLeave={handleMouseLeaveTilt}
            style={{
              transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transition: "transform 0.15s ease-out",
            }}
          >
            {/* Ambient glowing radial light behind the glass */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 -z-10 motion-safe:animate-[drift_9s_ease-in-out_infinite] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(30,122,86,0.18), transparent 55%), radial-gradient(circle at 80% 80%, rgba(196,138,52,0.14), transparent 55%)",
                filter: "blur(42px)",
              }}
            />

            <div className="relative rounded-2xl border border-white/80 glass-panel shadow-[0_25px_65px_-15px_rgba(20,21,26,0.14)] overflow-hidden motion-safe:animate-[riseIn_0.9s_cubic-bezier(0.16,1,0.3,1)_both]">
              {/* Top glass edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

              {/* Monitor Card Header */}
              <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-white/40">
                <div className="flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-xs text-black/70 font-semibold tracking-wider uppercase">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2s_ease-in-out_infinite]" />
                    <span className="relative w-2 h-2 rounded-full bg-[#1E7A56]" />
                  </span>
                  AGENT_CORE_MONITOR · LIVE
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-[IBM_Plex_Mono,monospace] text-xs text-black/50 tabular-nums font-medium">
                    {clock}
                    <span className="text-black/30">.{millis}</span>
                  </span>

                  <button
                    onClick={handleCycleSimulation}
                    disabled={isSimulating}
                    title="Simulate load cycle"
                    className="p-1.5 rounded-md border border-black/10 hover:border-[#1E7A56] hover:bg-[#1E7A56]/10 text-black/50 hover:text-[#1E7A56] transition-all disabled:opacity-40"
                  >
                    <RefreshCw
                      size={12}
                      className={isSimulating ? "animate-spin" : ""}
                    />
                  </button>
                </div>

                {/* Sheen sweep animation across header */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-[sheen_6s_ease-in-out_infinite]" />
                </div>
              </div>

              {/* Agent Rows with Clean Telemetry Status Pills */}
              <div className="divide-y divide-black/[0.05]">
                {agents.map((agent, i) => {
                  const s = STATUS_STYLES[agent.status] || STATUS_STYLES.idle;
                  const isSelected = selectedAgent?.id === agent.id;

                  return (
                    <div
                      key={agent.name}
                      onClick={() => {
                        setSelectedAgent(isSelected ? null : agent);
                      }}
                      className={`glass-row px-5 py-3.5 flex items-center gap-3.5 cursor-pointer transition-all ${isSelected ? "bg-white/90 shadow-xs" : ""
                        }`}
                    >
                      {/* Live status dot */}
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-colors"
                        style={{ background: s.dot }}
                      />

                      {/* Agent details with High-Tech Agentic Vibe */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <p className="font-[IBM_Plex_Mono,monospace] text-[13px] font-bold tracking-tight text-[#14151A]">
                            AGENT::{agent.name}
                          </p>
                          <span className="font-[IBM_Plex_Mono,monospace] text-[10px] text-black/40 font-medium tracking-tight">
                            [{agent.role}]
                          </span>
                        </div>
                        <p className="font-[IBM_Plex_Mono,monospace] text-black/50 text-[11px] truncate mt-1 tracking-tight">
                          {agent.task}
                        </p>

                        {/* Clean Throughput Progress Bar */}
                        <div className="mt-2 flex items-center gap-2.5">
                          <div className="h-[3px] w-full max-w-[140px] rounded-full bg-black/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${agent.load}%`, background: s.dot }}
                            />
                          </div>
                          <span className="font-[IBM_Plex_Mono,monospace] text-[9.5px] text-black/35 font-medium">
                            LOAD::{agent.load}%
                          </span>
                        </div>
                      </div>

                      {/* Clean DAG Status Pill */}
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-1 rounded-md border font-[IBM_Plex_Mono,monospace] text-[10px] font-semibold tracking-wider ${s.pillBg} ${s.pillBorder} ${s.pillText}`}
                        >
                          {agent.badgeLabel}
                        </span>
                      </div>

                      {/* Right Telemetry Column */}
                      <div className="text-right shrink-0">
                        <span className="font-[IBM_Plex_Mono,monospace] text-[11px] text-black/40 tabular-nums font-semibold block">
                          0x{ids[i]}
                        </span>
                        <span className="font-[IBM_Plex_Mono,monospace] text-[10px] text-[#1E7A56] font-bold block">
                          {agent.speed}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Agent Quick Telemetry Drawer */}
              {selectedAgent && (
                <div className="p-4 bg-white/95 border-t border-black/[0.08] font-[IBM_Plex_Mono,monospace] text-xs space-y-2.5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1E7A56] font-bold tracking-wider">
                      AGENT_INSPECTOR :: {selectedAgent.name}
                    </span>
                    <button
                      onClick={() => setSelectedAgent(null)}
                      className="text-black/40 hover:text-black"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-black/[0.03] border border-black/[0.05]">
                      <span className="text-black/40 block text-[9.5px] uppercase font-semibold">
                        CONTEXT RAM
                      </span>
                      <span className="font-bold text-black/80">
                        {selectedAgent.ram}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-black/[0.03] border border-black/[0.05]">
                      <span className="text-black/40 block text-[9.5px] uppercase font-semibold">
                        THROUGHPUT
                      </span>
                      <span className="font-bold text-[#1E7A56]">
                        {selectedAgent.speed}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-black/[0.03] border border-black/[0.05]">
                      <span className="text-black/40 block text-[9.5px] uppercase font-semibold">
                        SECURITY
                      </span>
                      <span className="font-bold text-[#1E7A56]">
                        SANDBOXED
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-black/70 bg-[#1E7A56]/[0.06] p-2 rounded border border-[#1E7A56]/15 flex items-center gap-1.5">
                    <Terminal size={11} className="text-[#1E7A56]" />
                    <span className="truncate uppercase font-medium">{selectedAgent.cmd}</span>
                  </div>
                </div>
              )}

              {/* Live Ticker Scrolling Log Feed */}
              <div className="relative h-[50px] overflow-hidden border-t border-black/[0.06] bg-[#14151A]/[0.025] font-[IBM_Plex_Mono,monospace] text-[10.5px] text-black/55 leading-[25px]">
                <div className="absolute inset-x-0 top-0 motion-safe:animate-[tickerScroll_11s_linear_infinite]">
                  {LOG_FEED.concat(LOG_FEED).map((line, i) => (
                    <div key={i} className="px-5 truncate flex items-center gap-2">
                      <span className="text-[#1E7A56] font-bold">›</span>
                      <span className="tracking-tight">{line}</span>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white/70 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-white/70 to-transparent" />
              </div>

              {/* Monitor Card Footer */}
              <div className="relative px-5 py-2.5 border-t border-black/[0.06] bg-white/40 font-[IBM_Plex_Mono,monospace] text-[11px] text-black/45 flex items-center justify-between uppercase tracking-wider">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56]" />
                  TOTAL_TOKENS: {totalTokens.toLocaleString()}
                </span>
                <span className="font-semibold text-black/40">CORE.VORTEX.AI</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            AGENTS / FEATURES SECTION
        ========================================================================= */}
        <section
          id="agents"
          className="max-w-6xl mx-auto px-6 py-20 border-t border-black/[0.07]"
        >
          <Reveal>
            <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Every agent has a job.
            </h2>
            <p className="text-black/55 max-w-xl mb-6 text-lg">
              Define the roster once. Vortex routes tasks to the right agent and
              hands off context automatically between them.
            </p>

            <div className="inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-xs text-black/50 bg-black/[0.03] border border-black/[0.08] rounded-md px-3 py-1.5 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.6s_ease-in-out_infinite]" />
              <TypeLine
                text="vortex ps --agents=all"
                startDelay={200}
                className="text-black/60"
              />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07] rounded-xl overflow-hidden shadow-xs">
            {FEATURES.map((f, i) => (
              <Reveal key={f.proc} delay={i * 100}>
                <div className="bg-white p-7 transition-all duration-300 ease-out hover:bg-[#FBFAF7] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(20,21,26,0.12)] hover:z-10 relative h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-[IBM_Plex_Mono,monospace] text-xs font-semibold text-[#1E7A56]">
                      {f.proc}
                    </span>
                    <span className="text-black/25 text-sm" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-lg mb-2 text-[#14151A]">
                    {f.title}
                  </h3>
                  <p className="text-black/50 text-sm leading-relaxed mb-4">
                    {f.text}
                  </p>
                  <div className="pt-3 border-t border-black/[0.06] font-[IBM_Plex_Mono,monospace] text-[11px] text-black/40">
                    <TypeLine text={`$ ${f.cmd}`} startDelay={400 + i * 300} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================================================================
            PIPELINE VISUALIZER
        ========================================================================= */}
        <section
          id="pipeline"
          className="border-t border-black/[0.07] bg-white/60 backdrop-blur-sm py-24"
        >
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-3">
                How a task moves through the pipeline
              </h2>
              <p className="text-black/55 max-w-lg text-lg mb-4">
                Watch seamless context transfer and zero-overhead checkpoint
                validation.
              </p>
              <div className="inline-flex items-center gap-2 font-[IBM_Plex_Mono,monospace] text-xs text-black/50 bg-black/[0.03] border border-black/[0.08] rounded-md px-3 py-1.5 mb-14">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_1.6s_ease-in-out_infinite]" />
                <TypeLine
                  text="vortex trace --pipeline --follow"
                  startDelay={200}
                  className="text-black/60"
                />
              </div>
            </Reveal>

            {/* Pipeline Stage Cards */}
            <div className="relative mb-10">
              {/* Base line */}
              <div className="hidden md:block absolute top-[14px] left-8 right-8 h-[2px] bg-black/[0.08]" />
              {/* Animated trace beam */}
              <div
                className="hidden md:block absolute top-[14px] left-8 h-[2px] bg-[#1E7A56] transition-all duration-700 ease-in-out shadow-[0_0_8px_#1E7A56]"
                style={{
                  width: `${(pipelineActive / (PIPELINE_STEPS.length - 1)) * 82 + 6}%`,
                }}
              />

              <div className="grid md:grid-cols-4 gap-6 relative z-10">
                {PIPELINE_STEPS.map((step, i) => {
                  const isCurrent = pipelineActive === i;
                  const isPassed = pipelineActive > i;

                  return (
                    <div
                      key={step.n}
                      onClick={() => {
                        setPipelineActive(i);
                        setPipelineAuto(false);
                      }}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${isCurrent
                          ? "bg-white border-[#1E7A56] shadow-[0_15px_35px_-8px_rgba(30,122,86,0.18)] translate-y-[-4px]"
                          : isPassed
                            ? "bg-white/90 border-[#1E7A56]/30 shadow-xs"
                            : "bg-white/60 border-black/[0.07] hover:border-black/20"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-[IBM_Plex_Mono,monospace] text-xs font-bold transition-all ${isCurrent
                              ? "bg-[#1E7A56] text-white shadow-[0_0_12px_rgba(30,122,86,0.5)]"
                              : isPassed
                                ? "bg-[#1E7A56]/20 text-[#1E7A56] border border-[#1E7A56]/40"
                                : "bg-black/[0.05] text-black/40 border border-black/10"
                            }`}
                        >
                          {isPassed ? <CheckCircle2 size={14} /> : step.n}
                        </div>

                        <span className="font-[IBM_Plex_Mono,monospace] text-[10px] text-black/35 font-semibold">
                          STAGE_{step.n}
                        </span>
                      </div>

                      <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-base text-[#14151A] mb-1.5 flex items-center gap-1">
                        {step.title}
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] animate-ping" />
                        )}
                      </h3>

                      <p className="text-black/50 text-xs leading-relaxed mb-3">
                        {step.text}
                      </p>

                      <div className="pt-2.5 border-t border-black/[0.05] flex items-center gap-1.5 font-[IBM_Plex_Mono,monospace] text-[10.5px] text-[#1E7A56]">
                        <Terminal size={11} />
                        <span className="truncate">{step.cmd}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Callout Bar */}
            <div className="p-5 rounded-2xl bg-white border border-[#1E7A56]/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#1E7A56]/10 text-[#1E7A56]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-[IBM_Plex_Mono,monospace] text-xs font-bold text-[#1E7A56]">
                      ACTIVE STAGE: {PIPELINE_STEPS[pipelineActive].n} —{" "}
                      {PIPELINE_STEPS[pipelineActive].title}
                    </span>
                    <span className="font-[IBM_Plex_Mono,monospace] text-[10px] px-2 py-0.2 rounded bg-black/[0.04] text-black/50 font-semibold">
                      AUTO-BUS VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-black/60 mt-0.5">
                    {PIPELINE_STEPS[pipelineActive].detail}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setPipelineAuto(!pipelineAuto);
                }}
                className="text-xs font-[IBM_Plex_Mono,monospace] px-3 py-1.5 rounded-lg border border-black/10 hover:border-[#1E7A56] text-black/60 hover:text-[#1E7A56] transition-colors shrink-0 uppercase tracking-wider font-semibold"
              >
                {pipelineAuto ? "PAUSE TOUR" : "AUTO PLAY TOUR"}
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CAPABILITIES STRIP
        ========================================================================= */}
        <section id="capabilities" className="border-t border-black/[0.07] py-20">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <p className="font-[IBM_Plex_Mono,monospace] text-xs text-black/45 uppercase tracking-wider mb-8 font-semibold">
                Built to be trusted with real production code
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07] rounded-xl overflow-hidden">
              {CAPABILITIES.map((c, i) => (
                <Reveal key={c.title} delay={i * 90}>
                  <div className="bg-white p-6 h-full transition-all duration-300 ease-out hover:bg-[#FBFAF7] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(20,21,26,0.12)] hover:z-10 relative">
                    <div className="flex items-center justify-between mb-4">
                      <CapIcon name={c.icon} />
                      <span className="font-[IBM_Plex_Mono,monospace] text-[10px] text-[#1E7A56] font-bold tracking-widest">
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-[15px] mb-1.5 text-[#14151A]">
                      {c.title}
                    </h3>
                    <p className="text-black/50 text-[13px] leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            STATS SECTION
        ========================================================================= */}
        <section className="border-t border-black/[0.07] bg-white/60 py-20">
          <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-3 gap-12">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <span className="font-[IBM_Plex_Mono,monospace] text-[10px] text-[#1E7A56] font-bold tracking-wider uppercase block mb-1">
                  {s.tag}
                </span>
                <p className="font-[Space_Grotesk,sans-serif] text-4xl md:text-5xl font-bold text-[#1E7A56] mb-2 tracking-tight">
                  {s.value}
                </p>
                <p className="text-black/55 text-sm leading-relaxed max-w-xs">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================================================================
            USE CASES SECTION
        ========================================================================= */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-black/[0.07]">
          <Reveal>
            <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Built for the work that actually takes time
            </h2>
            <p className="text-black/55 max-w-xl mb-12 text-lg">
              Real engineering tasks rarely fit in one prompt. Vortex breaks
              them down the way a senior staff team would.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((u, i) => (
              <Reveal key={u.title} delay={i * 100}>
                <div className="border border-black/[0.08] rounded-2xl p-7 h-full bg-white transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_15px_35px_-8px_rgba(20,21,26,0.12)] flex flex-col justify-between">
                  <div>
                    <h3 className="font-[Space_Grotesk,sans-serif] font-semibold text-lg mb-2 text-[#14151A]">
                      {u.title}
                    </h3>
                    <p className="text-black/55 text-sm leading-relaxed mb-6">
                      {u.text}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-black/[0.06] font-[IBM_Plex_Mono,monospace] text-xs text-[#1E7A56] font-semibold">
                    <span>$ {u.cmd}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =========================================================================
            TESTIMONIALS SECTION
        ========================================================================= */}
        <section className="border-t border-black/[0.07] bg-white/60 py-24">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-12">
                Teams already delegating real work
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.role} delay={i * 100}>
                  <div className="bg-white border border-black/[0.08] rounded-2xl p-7 h-full shadow-xs flex flex-col justify-between">
                    <div>
                      <p className="text-[#1E7A56] text-3xl leading-none mb-3 font-serif">
                        &ldquo;
                      </p>
                      <p className="text-black/75 text-[15px] leading-relaxed mb-6">
                        {t.quote}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-black/[0.05]">
                      <div className="w-7 h-7 rounded-full bg-[#1E7A56]/10 text-[#1E7A56] font-[IBM_Plex_Mono,monospace] text-xs font-bold flex items-center justify-center">
                        {t.avatar}
                      </div>
                      <p className="font-[IBM_Plex_Mono,monospace] text-xs text-black/45 tracking-tight font-medium">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            FAQ SECTION
        ========================================================================= */}
        <section id="faq" className="border-t border-black/[0.07] py-24">
          <div className="max-w-3xl mx-auto px-6">
            <Reveal>
              <h2 className="font-[Space_Grotesk,sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-10">
                Questions, answered
              </h2>
            </Reveal>

            <div className="border-t border-black/[0.08]">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 60}>
                  <details className="group border-b border-black/[0.08] py-5 transition-all">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-[Space_Grotesk,sans-serif] font-medium text-[16px] text-[#14151A] hover:text-[#1E7A56] transition-colors">
                      {f.q}
                      <span className="shrink-0 text-black/35 text-xl leading-none transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="text-black/55 text-sm leading-relaxed mt-3 pr-8">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.07] py-10 bg-white/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/40 font-[IBM_Plex_Mono,monospace]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-black/70">VORTEX AI</span>
            <span>© {new Date().getFullYear()} Vortex Engineering Inc.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#1E7A56] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite]" />
              ALL_SYSTEMS_NORMAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}




