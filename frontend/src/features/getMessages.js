import api from "../../utils/axios";

async function getMessages(id) {
  try {
    const { data } = await api.get(`/api/chat/get-messages/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    return data;
  } catch (error) {
    console.log("Get messages error:", error);
    return [];
  }
}

export default getMessages;
