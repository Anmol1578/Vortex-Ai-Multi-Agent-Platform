import api from "../../utils/axios";

async function sendMessage(formData) {
  const { data } = await api.post("/api/agent/chat", formData);
  return data;
}

export default sendMessage;
