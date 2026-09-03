import { deductCredits } from "../utils/deductCredits.js";

export const creditAgent = async (state) => {
  try {
    const agent = state.agent;

    const result = await deductCredits(
      state.userId,
      agent
    );

    return {
      ...state,
      creditDeduction: result,
    };
  } catch (error) {
    if (error.code === "INSUFFICIENT_CREDITS") {
      console.warn(
        `[creditAgent] insufficient credits: available=${error.credits}, required=${error.requiredCredits}`
      );

      throw error;
    }

    console.error("[creditAgent] credit deduction failed:", error);

    throw error;
  }
};