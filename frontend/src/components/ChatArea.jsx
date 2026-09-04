import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ArtifactPanel from "../components/ArtifactPanel";
import getMessages from "../features/getMessages";
import { setMessages, setIsLoading } from "../redux/messageSlice";
import { setJustCreated } from "../redux/conversationSlice";

const MOBILE_BREAKPOINT = 768;

const COMPACT_BREAKPOINT = 1024;

const PANEL_MIN_WIDTH = 380;
const PANEL_MAX_WIDTH = 880;
const PANEL_MAX_VIEWPORT_RATIO = 0.65;

const SPRING = { type: "spring", stiffness: 320, damping: 34, mass: 0.9 };

function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

function ChatArea() {
  const dispatch = useDispatch();
  const viewportWidth = useViewport();
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const usePanelOverlay = viewportWidth < COMPACT_BREAKPOINT;

  const { selectedConversation, justCreated } = useSelector(
    (state) => state.conversation,
  );
  const messages = useSelector((state) => state.message.messages ?? []);

  const thinking = useSelector((state) => state.message.isLoading);

  const [mode, setMode] = useState("auto");
  const [input, setInput] = useState("");
  const [activeAgent, setActiveAgent] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState(null);
  const [panelWidth, setPanelWidth] = useState(null);

  const scrollRef = useRef(null);

  const justCreatedRef = useRef(justCreated);
  useEffect(() => {
    justCreatedRef.current = justCreated;
  }, [justCreated]);

  useEffect(() => {
    if (!selectedConversation?._id) {
      dispatch(setMessages([]));
      return;
    }
    if (justCreatedRef.current) {
      dispatch(setJustCreated(false));
      return;
    }
    const idAtRequestTime = selectedConversation._id;
    const loadMessages = async () => {
      const data = await getMessages(idAtRequestTime);
      if (idAtRequestTime !== selectedConversation?._id) return;
      dispatch(setMessages(Array.isArray(data) ? data : []));
    };
    loadMessages();
  }, [selectedConversation?._id, dispatch]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "auto",
      });
    });
  }, [messages]);

  const allArtifacts = useMemo(() => {
    const list = [];
    messages.forEach((m, mi) => {
      (m.artifacts || []).forEach((artifact, ai) => {
        list.push({
          id: `${mi}-${ai}`,
          artifact,
          agent: m.agent,
          createdAt: m.createdAt || m.timestamp || null,
        });
      });
    });
    return list;
  }, [messages]);

  useEffect(() => {
    setPanelOpen(false);
    setSelectedArtifactId(null);
    setPanelWidth(null);
  }, [selectedConversation?._id]);

  const handleOpenArtifactFromMessage = (artifact) => {
    const entry = allArtifacts.find((e) => e.artifact === artifact);
    setSelectedArtifactId(entry ? entry.id : null);
    setPanelOpen(true);
  };

  const handleOpenArtifactsList = () => {
    setSelectedArtifactId(null);
    setPanelOpen(true);
  };

  const handleClosePanel = () => setPanelOpen(false);
  const handleSetThinking = (value) => dispatch(setIsLoading(value));

  const desktopWidthPx = useMemo(() => {
    const viewportCap = viewportWidth * PANEL_MAX_VIEWPORT_RATIO;
    const upperBound = Math.min(PANEL_MAX_WIDTH, viewportCap);
    const requested = panelWidth ?? 440;
    return Math.round(
      Math.max(PANEL_MIN_WIDTH, Math.min(requested, upperBound)),
    );
  }, [panelWidth, viewportWidth]);

  return (
    <div className="flex-1 flex min-w-0 h-full relative overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Nav
          artifactCount={allArtifacts.length}
          onOpenArtifacts={handleOpenArtifactsList}
        />

        <MessageList
          messages={messages}
          thinking={thinking}
          activeAgent={activeAgent}
          onSuggest={(text) => setInput(text)}
          onOpenArtifact={handleOpenArtifactFromMessage}
          scrollRef={scrollRef}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          mode={mode}
          setMode={setMode}
          setThinking={handleSetThinking}
          setActiveAgent={setActiveAgent}
        />
      </div>

      {usePanelOverlay ? (
        <AnimatePresence>
          {panelOpen && (
            <>
              <motion.div
                key="artifact-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={handleClosePanel}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
              />
              <motion.div
                key="artifact-panel"
                initial={{ right: "-100%" }} // was: x: "100%"
                animate={{ right: 0 }} // was: x: 0
                exit={{ right: "-100%" }} // was: x: "100%"
                transition={SPRING}
                className={`fixed inset-y-0 z-40 shadow-2xl ${
                  // dropped "right-0" — right is now animated directly
                  isMobile ? "w-full" : "w-full max-w-[520px]"
                }`}
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
              >
                <ArtifactPanel
                  artifacts={allArtifacts}
                  selectedId={selectedArtifactId}
                  onSelect={setSelectedArtifactId}
                  onClose={handleClosePanel}
                  onWidthChange={setPanelWidth}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      ) : (
        <motion.div
          initial={false}
          animate={{
            width: panelOpen ? desktopWidthPx : 0,
            opacity: panelOpen ? 1 : 0,
          }}
          transition={SPRING}
          className="shrink-0 h-full overflow-hidden"
        >
          <ArtifactPanel
            artifacts={allArtifacts}
            selectedId={selectedArtifactId}
            onSelect={setSelectedArtifactId}
            onClose={handleClosePanel}
            onWidthChange={setPanelWidth}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ChatArea;
