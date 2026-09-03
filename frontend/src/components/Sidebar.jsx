// import {
//   User,LogOut,ArrowUpCircle,PanelLeftOpen, Search, X,} from "lucide-react";

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { getConversations } from "../features/getConversations";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setConversations,
//   setSelectedConversation,
// } from "../redux/conversationSlice";
// import logout from "../features/logout";
// import BillingDrawer from "./BillingDrawer";
// import { setUserdata } from "../redux/userSlice";
// import { setMessages } from "../redux/messageSlice";
// import { useNavigate } from "react-router-dom";

// const MOBILE_BREAKPOINT = 768; // px — below this, sidebar becomes an overlay drawer
// const SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };

// function RailIcon({ children, label, active, onClick }) {
//   return (
//     <motion.button
//       title={label}
//       onClick={onClick}
//       whileTap={{ scale: 0.9 }}
//       className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${
//         active
//           ? "bg-[#1E7A56]/10 text-[#1E7A56]"
//           : "text-black/35 hover:bg-black/[0.04] hover:text-black/70"
//       }`}
//     >
//       {children}
//     </motion.button>
//   );
// }

// function PlusIcon() {
//   return (
//     <svg
//       width="15"
//       height="15"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//     >
//       <path d="M12 5v14M5 12h14" />
//     </svg>
//   );
// }
// function ChatIcon() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//     >
//       <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
//     </svg>
//   );
// }
// function HistoryIcon() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//     >
//       <path d="M3 3v5h5" />
//       <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
//       <path d="M12 7v5l4 2" />
//     </svg>
//   );
// }

// function VortexMenuTrigger({ onClick }) {
//   return (
//     <motion.button
//       onClick={onClick}
//       title="Open sidebar"
//       initial={{ opacity: 0, scale: 0.92 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.92 }}
//       transition={SPRING}
//       whileTap={{ scale: 0.94 }}
//       className="fixed top-[calc(0.75rem+env(safe-area-inset-top))] left-3 z-50 w-9 h-9 rounded-lg bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-[3.5px] transition-all duration-200 hover:bg-black/[0.02] hover:border-black/[0.14]"
//     >
//       <span className="w-[14px] h-[1.5px] rounded-full bg-black/70" />
//       <span className="w-[14px] h-[1.5px] rounded-full bg-black/70" />
//       <span className="w-[14px] h-[1.5px] rounded-full bg-black/70" />
//     </motion.button>
//   );
// }

// /** Single, consistent close control used across both the sessions and history panels. */
// function CloseButton({ onClick, title = "Close sidebar" }) {
//   return (
//     <motion.button
//       onClick={onClick}
//       title={title}
//       whileHover={{ scale: 1.06 }}
//       whileTap={{ scale: 0.9 }}
//       className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-black/40 hover:text-black hover:bg-black/[0.07] transition-colors duration-150"
//     >
//       <X size={16} strokeWidth={2} />
//     </motion.button>
//   );
// }

// /** Single conversation row, reused by both the "sessions" list and the grouped "history" list. */
// function ConversationRow({ conversation, isActive, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full text-left rounded-md px-3 py-2.5 transition-colors group ${
//         isActive
//           ? "bg-[#1E7A56]/10 border border-[#1E7A56]/30"
//           : "glass-row hover:bg-white/60"
//       }`}
//     >
//       <p className="text-sm text-black/80 truncate group-hover:text-black">
//         {conversation.title || "New Conversation"}
//       </p>
//       <span className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/35">
//         {new Date(conversation.updatedAt).toLocaleString()}
//       </span>
//     </button>
//   );
// }

// function startOfDay(date) {
//   const d = new Date(date);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// function groupConversationsByDate(conversations) {
//   const groups = { Today: [], Yesterday: [], "This Week": [], Earlier: [] };
//   const today = startOfDay(new Date());
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
//   const weekAgo = new Date(today);
//   weekAgo.setDate(weekAgo.getDate() - 7);

//   conversations.forEach((conv) => {
//     const convDayStart = startOfDay(new Date(conv.updatedAt));
//     if (convDayStart.getTime() === today.getTime()) groups.Today.push(conv);
//     else if (convDayStart.getTime() === yesterday.getTime())
//       groups.Yesterday.push(conv);
//     else if (convDayStart.getTime() > weekAgo.getTime())
//       groups["This Week"].push(conv);
//     else groups.Earlier.push(conv);
//   });

//   return groups;
// }

// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(
//     typeof window !== "undefined"
//       ? window.innerWidth < MOBILE_BREAKPOINT
//       : false,
//   );

//   useEffect(() => {
//     const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
//     const handler = (e) => setIsMobile(e.matches);
//     handler(mq);
//     mq.addEventListener("change", handler);
//     return () => mq.removeEventListener("change", handler);
//   }, []);

//   return isMobile;
// }

// function Sidebar({ onNewSession }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isMobile = useIsMobile();

//   const [imageError, setImageError] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [activeRail, setActiveRail] = useState("sessions"); // "sessions" | "history"
//   const [showBilling, setShowBilling] = useState(false);
//   const [historySearch, setHistorySearch] = useState("");

//   const conversations = useSelector(
//     (state) => state.conversation.conversations,
//   );
//   const selectedConversation = useSelector(
//     (state) => state.conversation.selectedConversation,
//   );
//   const userData = useSelector((state) => state.user.userData);

//   useEffect(() => {
//     if (!userData?.userId) return;
//     const getConv = async () => {
//       const data = await getConversations();
//       dispatch(setConversations(data));
//     };
//     getConv();
//   }, [dispatch, userData?.userId]);

//   const handleSelectConversation = (conversation) => {
//     dispatch(setSelectedConversation(conversation));
//     if (isMobile) setMobileOpen(false);
//   };

//   const handleCreateConversation = () => {
//     dispatch(setSelectedConversation(null));
//     if (isMobile) setMobileOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       dispatch(setUserdata(null));
//       dispatch(setSelectedConversation(null));
//       dispatch(setConversations([]));
//       dispatch(setMessages([]));
//       navigate("/login");
//     } catch (error) {
//       console.log("Logout failed:", error);
//     }
//   };

//   const handleUpgrade = () => {
//     console.log("Upgrade clicked");
//   };

//   // Single "close" action — collapses on desktop, fully closes the drawer on mobile.
//   const handleClose = () => {
//     if (isMobile) setMobileOpen(false);
//     else setCollapsed(true);
//   };

//   const PLAN_LABELS = {
//     free: "Free Plan",
//     starter: "Starter Plan",
//     pro: "Pro Plan",
//   };
//   const planLabel = PLAN_LABELS[userData?.plan] || "Free Plan";
//   const panelCollapsed = !isMobile && collapsed;

//   const filteredHistory = conversations.filter((c) =>
//     (c.title || "New Conversation")
//       .toLowerCase()
//       .includes(historySearch.toLowerCase()),
//   );
//   const groupedHistory = Object.entries(
//     groupConversationsByDate(filteredHistory),
//   ).filter(([, items]) => items.length > 0);

//   return (
//     <>
//       <AnimatePresence>
//         {isMobile && !mobileOpen && (
//           <VortexMenuTrigger onClick={() => setMobileOpen(true)} />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isMobile && mobileOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             onClick={() => setMobileOpen(false)}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
//           />
//         )}
//       </AnimatePresence>

//       <motion.div
//         initial={false}
//         animate={isMobile ? { x: mobileOpen ? 0 : "-100%" } : { x: 0 }}
//         transition={SPRING}
//         style={
//           isMobile
//             ? {
//                 paddingTop: "env(safe-area-inset-top)",
//                 paddingBottom: "env(safe-area-inset-bottom)",
//               }
//             : undefined
//         }
//         className={`flex h-full ${
//           isMobile
//             ? "fixed inset-y-0 left-0 z-40 w-[82vw] max-w-[320px] shadow-2xl bg-white"
//             : "relative"
//         }`}
//       >
//         {/* Icon rail */}
//         <aside className="w-16 shrink-0 border-r border-black/[0.10] bg-[#F4F5F2] flex flex-col items-center py-5 gap-6 h-full relative">
//           <button
//             onClick={() =>
//               isMobile ? setMobileOpen(false) : setCollapsed((prev) => !prev)
//             }
//             title={
//               isMobile
//                 ? "Close menu"
//                 : collapsed
//                   ? "Expand sidebar"
//                   : "Collapse sidebar"
//             }
//             className="w-9 h-9 rounded-md bg-gradient-to-br from-[#14151A] to-[#0B2E22] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-200 hover:scale-105 active:scale-95"
//           >
//             <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#14151A] to-[#0B2E22] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
//               <div className="absolute inset-0 bg-[#1E7A56]/25 blur-md rounded-full scale-75" />
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="relative z-10"
//               >
//                 <defs>
//                   <linearGradient id="vGradient" x1="0" y1="0" x2="24" y2="24">
//                     <stop offset="0%" stopColor="#5EEAD4" />
//                     <stop offset="100%" stopColor="#1E7A56" />
//                   </linearGradient>
//                 </defs>
//                 <path
//                   d="M3 4L12 20L21 4"
//                   stroke="url(#vGradient)"
//                   strokeWidth="2.6"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   fill="none"
//                 />
//                 <path
//                   d="M7.5 4L12 12.5L16.5 4"
//                   stroke="url(#vGradient)"
//                   strokeWidth="1.6"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   fill="none"
//                   opacity="0.5"
//                 />
//               </svg>
//               <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite] ring-2 ring-white z-10" />
//             </div>
//           </button>

//           <nav className="flex flex-col items-center gap-1 mt-4">
//             <RailIcon
//               label="Sessions"
//               active={!panelCollapsed && activeRail === "sessions"}
//               onClick={() => {
//                 setActiveRail("sessions");
//                 setCollapsed(false);
//               }}
//             >
//               <ChatIcon />
//             </RailIcon>

//             <RailIcon
//               label="History"
//               active={!panelCollapsed && activeRail === "history"}
//               onClick={() => {
//                 setActiveRail("history");
//                 setCollapsed(false);
//               }}
//             >
//               <HistoryIcon />
//             </RailIcon>
//           </nav>

//           <div className="flex-1 min-h-8 flex items-center justify-center overflow-hidden select-none pointer-events-none">
//             <span
//               className="text-[18px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.3em] text-[#1E7A56]/30 whitespace-nowrap"
//               style={{
//                 writingMode: "vertical-rl",
//                 transform: "rotate(180deg)",
//               }}
//             >
//               INTELLIGENCE LAYER
//             </span>
//           </div>

//           <div className="mt-auto flex flex-col items-center gap-3">
//             {!isMobile && collapsed && (
//               <RailIcon
//                 label="Expand sidebar"
//                 onClick={() => setCollapsed(false)}
//               >
//                 <PanelLeftOpen size={18} />
//               </RailIcon>
//             )}
//           </div>
//         </aside>

//         {/* Sessions / History panel */}
//         <motion.aside
//           initial={false}
//           animate={!isMobile ? { width: collapsed ? 0 : 256 } : undefined}
//           transition={SPRING}
//           className={`shrink-0 border-r border-black/[0.07] bg-white/35 backdrop-blur-xl flex flex-col overflow-hidden ${
//             isMobile ? "flex-1 min-w-0" : ""
//           }`}
//         >
//           <div
//             className={`flex flex-col h-full ${isMobile ? "w-full" : "w-64"}`}
//           >
//             {/* Single panel header — wordmark + the ONE close button, always present */}
//             <div className="px-4 pt-4 pb-1">
//               <div className="flex items-center justify-between select-none">
//                 <div className="flex items-center gap-1.5">
//                   <span className="text-[19px] font-semibold tracking-[-0.045em] text-neutral-900">
//                     Vortex
//                   </span>
//                   <span className="text-[19px] font-semibold tracking-[-0.045em] text-[#1E7A56]">
//                     AI
//                   </span>
//                 </div>
//                 <CloseButton onClick={handleClose} />
//               </div>
//             </div>

//             {activeRail === "sessions" ? (
//               <>
//                 <div className="px-4 pt-3 pb-2 flex items-center gap-2">
//                   <motion.button
//                     onClick={handleCreateConversation}
//                     whileTap={{ scale: 0.97 }}
//                     className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#14151A] text-white text-[13px] font-medium py-2.5 shadow-sm transition-all duration-200 hover:bg-[#1E7A56] hover:shadow-md"
//                   >
//                     <PlusIcon />
//                     <span>New session</span>
//                   </motion.button>
//                 </div>

//                 <div className="px-4 flex-1 overflow-y-auto">
//                   <p className="flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.16em] text-black/40 mb-3 mt-4">
//                     <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56]" />
//                     Recent Sessions
//                   </p>

//                   <div className="space-y-1">
//                     {conversations.map((conversation) => (
//                       <ConversationRow
//                         key={conversation._id}
//                         conversation={conversation}
//                         isActive={
//                           selectedConversation?._id === conversation._id
//                         }
//                         onClick={() => handleSelectConversation(conversation)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="px-4 pt-2 pb-2">
//                   <div className="relative">
//                     <Search
//                       size={14}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
//                     />
//                     <input
//                       type="text"
//                       value={historySearch}
//                       onChange={(e) => setHistorySearch(e.target.value)}
//                       placeholder="Search history..."
//                       className="w-full rounded-md bg-black/[0.04] pl-8 pr-3 py-2.5 text-sm text-black/80 placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-[#1E7A56]/40"
//                     />
//                   </div>
//                 </div>

//                 <div className="px-4 flex-1 overflow-y-auto pb-4">
//                   {groupedHistory.length === 0 ? (
//                     <p className="text-sm text-black/35 mt-6 text-center">
//                       No matching conversations
//                     </p>
//                   ) : (
//                     groupedHistory.map(([label, items]) => (
//                       <div key={label} className="mb-4">
//                         <p className="text-[13px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.18em] text-[#1E7A56]/70 mb-2 mt-3">
//                           {label}
//                         </p>
//                         <div className="space-y-1">
//                           {items.map((conversation) => (
//                             <ConversationRow
//                               key={conversation._id}
//                               conversation={conversation}
//                               isActive={
//                                 selectedConversation?._id === conversation._id
//                               }
//                               onClick={() =>
//                                 handleSelectConversation(conversation)
//                               }
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </>
//             )}

//             {/* User footer row */}
//             <div
//               className="p-4 border-t border-black/[0.07]"
//               style={
//                 isMobile
//                   ? {
//                       paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
//                     }
//                   : undefined
//               }
//             >
//               <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/60 transition-colors group">
//                 <div className="w-9 h-9 rounded-full bg-[#14151A] flex items-center justify-center overflow-hidden text-white shrink-0">
//                   {userData?.avatar && !imageError ? (
//                     <img
//                       src={userData.avatar}
//                       alt="User avatar"
//                       className="w-full h-full object-cover"
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <User size={16} />
//                   )}
//                 </div>

//                 <div className="flex flex-col min-w-0 flex-1">
//                   <span className="text-sm font-medium text-black/80 truncate">
//                     {userData?.name || userData?.displayName || "User"}
//                   </span>
//                   <span className="text-xs text-black/40">{planLabel}</span>
//                 </div>

//                 <div className="flex items-center gap-1 shrink-0">
//                   <button
//                     onClick={() => setShowBilling(true)}
//                     title="Upgrade plan"
//                     className="w-7 h-7 rounded-md flex items-center justify-center text-black/40 hover:text-[#1E7A56] hover:bg-black/[0.06] transition-colors"
//                   >
//                     <ArrowUpCircle size={16} />
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     title="Log out"
//                     className="w-7 h-7 rounded-md flex items-center justify-center text-black/40 hover:text-black hover:bg-black/[0.06] transition-colors"
//                   >
//                     <LogOut size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.aside>
//       </motion.div>

//       <BillingDrawer
//         open={showBilling}
//         onClose={() => setShowBilling(false)}
//         userData={userData}
//       />
//     </>
//   );
// }

// export default Sidebar;

import {
  User,
  LogOut,
  ArrowUpCircle,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";
import logout from "../features/logout";
import BillingDrawer from "./BillingDrawer";
import { setUserdata } from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import { useNavigate } from "react-router-dom";

const MOBILE_BREAKPOINT = 768; // px — below this, sidebar becomes an overlay drawer
const SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };
const PLAN_LABELS = {
  free: "Free Plan",
  starter: "Starter Plan",
  pro: "Pro Plan",
};

function RailIcon({ children, label, active, onClick }) {
  return (
    <motion.button
      title={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-200 ${
        active
          ? "bg-[#1E7A56]/10 text-[#1E7A56]"
          : "text-black/35 hover:bg-black/[0.04] hover:text-black/70"
      }`}
    >
      {children}
    </motion.button>
  );
}

/** Shared stroke-icon renderer — pass the path's `d` attribute plus optional sizing. */
function Icon({ d, size = 18, strokeWidth = 1.8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path d={d} />
    </svg>
  );
}

const PLUS_D = "M12 5v14M5 12h14";
const CHAT_D =
  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";
const HISTORY_PATHS = [
  "M3 3v5h5",
  "M3.05 13A9 9 0 1 0 6 5.3L3 8",
  "M12 7v5l4 2",
];

function HistoryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {HISTORY_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function VortexMenuTrigger({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      title="Open sidebar"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={SPRING}
      whileTap={{ scale: 0.94 }}
      className="fixed top-[calc(0.75rem+env(safe-area-inset-top))] left-3 z-50 w-9 h-9 rounded-lg bg-white border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-[3.5px] transition-all duration-200 hover:bg-black/[0.02] hover:border-black/[0.14]"
    >
      <span className="w-[14px] h-[1.5px] rounded-full bg-black/70" />
      <span className="w-[14px] h-[1.5px] rounded-full bg-black/70" />
      <span className="w-[14px] h-[1.5px] rounded-full bg-black/70" />
    </motion.button>
  );
}

/** Single, consistent close control used across both the sessions and history panels. */
function CloseButton({ onClick, title = "Close sidebar" }) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-black/40 hover:text-black hover:bg-black/[0.07] transition-colors duration-150"
    >
      <X size={16} strokeWidth={2} />
    </motion.button>
  );
}

/** Single conversation row, reused by both the "sessions" list and the grouped "history" list. */
function ConversationRow({ conversation, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md px-3 py-2.5 transition-colors group ${
        isActive
          ? "bg-[#1E7A56]/10 border border-[#1E7A56]/30"
          : "glass-row hover:bg-white/60"
      }`}
    >
      <p className="text-sm text-black/80 truncate group-hover:text-black">
        {conversation.title || "New Conversation"}
      </p>
      <span className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/35">
        {new Date(conversation.updatedAt).toLocaleString()}
      </span>
    </button>
  );
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function groupConversationsByDate(conversations) {
  const groups = { Today: [], Yesterday: [], "This Week": [], Earlier: [] };
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  conversations.forEach((conv) => {
    const convDayStart = startOfDay(new Date(conv.updatedAt));
    if (convDayStart.getTime() === today.getTime()) groups.Today.push(conv);
    else if (convDayStart.getTime() === yesterday.getTime())
      groups.Yesterday.push(conv);
    else if (convDayStart.getTime() > weekAgo.getTime())
      groups["This Week"].push(conv);
    else groups.Earlier.push(conv);
  });

  return groups;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [imageError, setImageError] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRail, setActiveRail] = useState("sessions"); // "sessions" | "history"
  const [showBilling, setShowBilling] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!userData?.userId) return;
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, [dispatch, userData?.userId]);

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    if (isMobile) setMobileOpen(false);
  };

  const handleCreateConversation = () => {
    dispatch(setSelectedConversation(null));
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUserdata(null));
      dispatch(setSelectedConversation(null));
      dispatch(setConversations([]));
      dispatch(setMessages([]));
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  // Single "close" action — collapses on desktop, fully closes the drawer on mobile.
  const handleClose = () => {
    if (isMobile) setMobileOpen(false);
    else setCollapsed(true);
  };

  const planLabel = PLAN_LABELS[userData?.plan] || "Free Plan";
  const panelCollapsed = !isMobile && collapsed;

  const filteredHistory = conversations.filter((c) =>
    (c.title || "New Conversation")
      .toLowerCase()
      .includes(historySearch.toLowerCase()),
  );
  const groupedHistory = Object.entries(
    groupConversationsByDate(filteredHistory),
  ).filter(([, items]) => items.length > 0);

  return (
    <>
      <AnimatePresence>
        {isMobile && !mobileOpen && (
          <VortexMenuTrigger onClick={() => setMobileOpen(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={isMobile ? { x: mobileOpen ? 0 : "-100%" } : { x: 0 }}
        transition={SPRING}
        style={
          isMobile
            ? {
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }
            : undefined
        }
        className={`flex h-full ${
          isMobile
            ? "fixed inset-y-0 left-0 z-40 w-[82vw] max-w-[320px] shadow-2xl bg-white"
            : "relative"
        }`}
      >
        {/* Icon rail */}
        <aside className="w-16 shrink-0 border-r border-black/[0.10] bg-[#F4F5F2] flex flex-col items-center py-5 gap-6 h-full relative">
          <button
            onClick={() =>
              isMobile ? setMobileOpen(false) : setCollapsed((prev) => !prev)
            }
            title={
              isMobile
                ? "Close menu"
                : collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
            }
            className="w-9 h-9 rounded-md bg-gradient-to-br from-[#14151A] to-[#0B2E22] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-[#1E7A56]/25 blur-md rounded-full scale-75" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="relative z-10"
            >
              <defs>
                <linearGradient id="vGradient" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#5EEAD4" />
                  <stop offset="100%" stopColor="#1E7A56" />
                </linearGradient>
              </defs>
              <path
                d="M3 4L12 20L21 4"
                stroke="url(#vGradient)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M7.5 4L12 12.5L16.5 4"
                stroke="url(#vGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.5"
              />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#1E7A56] motion-safe:animate-[blink_2.2s_ease-in-out_infinite] ring-2 ring-white z-10" />
          </button>

          <nav className="flex flex-col items-center gap-1 mt-4">
            <RailIcon
              label="Sessions"
              active={!panelCollapsed && activeRail === "sessions"}
              onClick={() => {
                setActiveRail("sessions");
                setCollapsed(false);
              }}
            >
              <Icon d={CHAT_D} />
            </RailIcon>

            <RailIcon
              label="History"
              active={!panelCollapsed && activeRail === "history"}
              onClick={() => {
                setActiveRail("history");
                setCollapsed(false);
              }}
            >
              <HistoryIcon />
            </RailIcon>
          </nav>

          <div className="flex-1 min-h-8 flex items-center justify-center overflow-hidden select-none pointer-events-none">
            <span
              className="text-[18px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.3em] text-[#1E7A56]/30 whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              INTELLIGENCE LAYER
            </span>
          </div>

          <div className="mt-auto flex flex-col items-center gap-3">
            {!isMobile && collapsed && (
              <RailIcon
                label="Expand sidebar"
                onClick={() => setCollapsed(false)}
              >
                <PanelLeftOpen size={18} />
              </RailIcon>
            )}
          </div>
        </aside>

        {/* Sessions / History panel */}
        <motion.aside
          initial={false}
          animate={!isMobile ? { width: collapsed ? 0 : 256 } : undefined}
          transition={SPRING}
          className={`shrink-0 border-r border-black/[0.07] bg-white/35 backdrop-blur-xl flex flex-col overflow-hidden ${
            isMobile ? "flex-1 min-w-0" : ""
          }`}
        >
          <div
            className={`flex flex-col h-full ${isMobile ? "w-full" : "w-64"}`}
          >
            {/* Single panel header — wordmark + the ONE close button, always present */}
            <div className="px-4 pt-4 pb-1">
              <div className="flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-[19px] font-semibold tracking-[-0.045em] text-neutral-900">
                    Vortex
                  </span>
                  <span className="text-[19px] font-semibold tracking-[-0.045em] text-[#1E7A56]">
                    AI
                  </span>
                </div>
                <CloseButton onClick={handleClose} />
              </div>
            </div>

            {activeRail === "sessions" ? (
              <>
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <motion.button
                    onClick={handleCreateConversation}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#14151A] text-white text-[13px] font-medium py-2.5 shadow-sm transition-all duration-200 hover:bg-[#1E7A56] hover:shadow-md"
                  >
                    <Icon d={PLUS_D} size={15} strokeWidth={2.5} />
                    <span>New session</span>
                  </motion.button>
                </div>

                <div className="px-4 flex-1 overflow-y-auto">
                  <p className="flex items-center gap-2 text-[11px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.16em] text-black/40 mb-3 mt-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A56]" />
                    Recent Sessions
                  </p>

                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <ConversationRow
                        key={conversation._id}
                        conversation={conversation}
                        isActive={
                          selectedConversation?._id === conversation._id
                        }
                        onClick={() => handleSelectConversation(conversation)}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 pt-2 pb-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30"
                    />
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Search history..."
                      className="w-full rounded-md bg-black/[0.04] pl-8 pr-3 py-2.5 text-sm text-black/80 placeholder:text-black/30 focus:outline-none focus:ring-1 focus:ring-[#1E7A56]/40"
                    />
                  </div>
                </div>

                <div className="px-4 flex-1 overflow-y-auto pb-4">
                  {groupedHistory.length === 0 ? (
                    <p className="text-sm text-black/35 mt-6 text-center">
                      No matching conversations
                    </p>
                  ) : (
                    groupedHistory.map(([label, items]) => (
                      <div key={label} className="mb-4">
                        <p className="text-[13px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.18em] text-[#1E7A56]/70 mb-2 mt-3">
                          {label}
                        </p>
                        <div className="space-y-1">
                          {items.map((conversation) => (
                            <ConversationRow
                              key={conversation._id}
                              conversation={conversation}
                              isActive={
                                selectedConversation?._id === conversation._id
                              }
                              onClick={() =>
                                handleSelectConversation(conversation)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* User footer row */}
            <div
              className="p-4 border-t border-black/[0.07]"
              style={
                isMobile
                  ? {
                      paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/60 transition-colors group">
                <div className="w-9 h-9 rounded-full bg-[#14151A] flex items-center justify-center overflow-hidden text-white shrink-0">
                  {userData?.avatar && !imageError ? (
                    // <img
                    //   src={userData.avatar}
                    //   alt="User avatar"
                    //   className="w-full h-full object-cover"
                    //   onError={() => setImageError(true)}
                    // />

                    <img
                      src={userData.avatar}
                      alt="User avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <User size={16} />
                  )}
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-black/80 truncate">
                    {userData?.name || userData?.displayName || "User"}
                  </span>
                  <span className="text-xs text-black/40">{planLabel}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setShowBilling(true)}
                    title="Upgrade plan"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-black/40 hover:text-[#1E7A56] hover:bg-black/[0.06] transition-colors"
                  >
                    <ArrowUpCircle size={16} />
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-black/40 hover:text-black hover:bg-black/[0.06] transition-colors"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </motion.div>

      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
        userData={userData}
      />
    </>
  );
}

export default Sidebar;
