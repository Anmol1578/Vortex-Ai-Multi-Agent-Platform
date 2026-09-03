import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
    justCreated: false,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setJustCreated: (state, action) => {
      state.justCreated = action.payload;
    },
    setConvTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conv) =>
        conv._id == conversationId ? { ...conv, title } : conv,
      );
      if (state.selectedConversation?._id == conversationId) {
        state.selectedConversation = { ...state.selectedConversation, title };
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  setJustCreated,
  setConvTitle,
} = conversationSlice.actions;
export default conversationSlice.reducer;
