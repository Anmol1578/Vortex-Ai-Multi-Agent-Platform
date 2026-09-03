// import React from "react";
// import { useSelector } from "react-redux";

// function Nav() {
//   const { selectedConversation } = useSelector((state) => state.conversation);
//   const { messages } = useSelector((state) => state.message);
//   const messageCount = messages.length;

//   if (!selectedConversation) {
//     return null;
//   }

//   return (
//     <div className="relative h-14 border-b border-black/[0.07] flex items-center gap-4 px-6 bg-white/35 backdrop-blur-xl z-10 overflow-hidden motion-safe:animate-[fadeUp_0.5s_ease-out_both]">
//       <p className="text-sm font-medium">
//         {selectedConversation.title || "Active session"}
//       </p>

//       <span className="w-1 h-1 rounded-full bg-black/20" />
//       <span className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/35">
//         {messageCount} {messageCount === 1 ? "message" : "messages"}
//       </span>

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 overflow-hidden"
//       >
//         <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-[sheen_7s_ease-in-out_infinite]" />
//       </div>
//     </div>
//   );
// }

// export default Nav;

import React from "react";
import { useSelector } from "react-redux";
import { FileCode2, MessageSquare } from "lucide-react";

function Nav({ artifactCount = 0, onOpenArtifacts }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const messageCount = messages.length;

  if (!selectedConversation) {
    return null;
  }

  return (
    <div
      className="
        sticky top-0 z-20
        min-h-14
        border-b border-black/[0.07]
        flex items-center gap-3 sm:gap-4
        pl-[4.25rem] pr-3 sm:px-6
        bg-white/35 backdrop-blur-xl
        overflow-hidden
        relative
        motion-safe:animate-[fadeUp_0.5s_ease-out_both]
      "
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <p className="text-sm font-medium truncate min-w-0">
          {selectedConversation.title || "Active session"}
        </p>

        <span className="hidden sm:block w-1 h-1 rounded-full bg-black/20 shrink-0" />

        <span className="hidden sm:inline text-[11px] font-[IBM_Plex_Mono,monospace] text-black/35 shrink-0 whitespace-nowrap">
          {messageCount} {messageCount === 1 ? "message" : "messages"}
        </span>

        <span className="sm:hidden flex items-center gap-1 text-[10px] font-[IBM_Plex_Mono,monospace] text-black/35 shrink-0">
          {messageCount}
          <MessageSquare size={12} />
        </span>
      </div>

      {onOpenArtifacts && (
        <button
          onClick={onOpenArtifacts}
          title="View artifacts"
          className="
            shrink-0
            flex items-center gap-1.5 h-8 pl-2.5 pr-3
            rounded-full border border-black/[0.08] bg-white
            text-black/55 shadow-sm
            hover:text-[#1E7A56] hover:border-[#1E7A56]/30
            active:scale-95
            transition-all duration-150
          "
        >
          <FileCode2 size={14} />
          {artifactCount > 0 && (
            <span className="text-[11px] font-[IBM_Plex_Mono,monospace] font-medium leading-none">
              {artifactCount}
            </span>
          )}
        </button>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-[sheen_7s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

export default Nav;
