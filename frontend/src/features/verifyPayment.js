import api from "../../utils/axios";

export const verifyPayment = async (payload, userId) => {
  try {
    const { data } = await api.post("/api/billing/verify-payment", payload, {
      headers: { "x-user-id": userId },
    });
    return data;
  } catch (error) {
    console.log("verifyPayment error:", error);
    return null;
  }
};
