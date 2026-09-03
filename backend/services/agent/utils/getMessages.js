import axios from "axios";

export const getMessages = async (conversationId) => {
  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "[getMessages] failed to fetch history:",
      error?.response?.data ?? error.message,
    );
    return []; 
  }
};
