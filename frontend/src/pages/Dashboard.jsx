import React from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import { useDispatch } from "react-redux";
import { addConversation } from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";

function Dashboard() {
  const dispatch = useDispatch();

  const handleNewSession = async () => {
    const conversation = await createConversation();

    console.log("Created Conversation:", conversation);

    if (conversation) {
      dispatch(addConversation(conversation));
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F7F7F5] overflow-hidden">
      <Sidebar onNewSession={handleNewSession} />
      <ChatArea />
    </div>
  );
}

export default Dashboard;
