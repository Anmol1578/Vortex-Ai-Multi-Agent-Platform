import api from "../../utils/axios";

export const createOrder = async ({ plan, userId }) => {
  try {
    const { data } = await api.post(
      "/api/billing/create-order",
      { plan },
      { headers: { "x-user-id": userId } },
    );
    return data;
  } catch (error) {
    console.log("createOrder error:", error);
    return null;
  }
};
    