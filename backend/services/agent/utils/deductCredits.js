import axios from "axios";

export const deductCredits = async (userId, agent) => {
  try {
    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/deduct-credits`,
      {
        userId,
        agent,
      },
    );

    return data;
  } catch (error) {
    const data = error.response?.data;

    console.error("[deductCredits]", data || error.message);

    /*
     * Convert Auth Service's insufficient-credit response
     * into a predictable error for the Agent Service.
     */
    if (data?.message === "Insufficient credits") {
      const creditError = new Error(
        "You don't have enough credits to use this agent.",
      );

      creditError.code = "INSUFFICIENT_CREDITS";
      creditError.credits = data.credits;
      creditError.requiredCredits = data.requiredCredits;

      throw creditError;
    }

    /*
     * Preserve other errors.
     */
    throw error;
  }
};
