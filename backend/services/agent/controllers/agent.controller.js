import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const agent = async (req, res, next) => {
  const { prompt, conversationId, agent: agentType } = req.body;
  const file = req.file;
  const userId = req.headers["x-user-id"];

  try {
    if (!prompt || !conversationId || !userId) {
      return res.status(400).json({
        success: false,
        code: "INVALID_REQUEST",
        message: "prompt, conversationId and userId are required",
      });
    }

    if (!agentType) {
      return res.status(400).json({
        success: false,
        code: "AGENT_REQUIRED",
        message: "agent is required",
      });
    }

    await checkAgentLimit(userId, agentType);

    await addMessage(conversationId, "user", prompt);

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: agentType,
      userId,
      file,
    });

    const response = result?.aiResponse;

    if (!response) {
      console.error("[agent controller] agent returned no aiResponse", {
        agentType,
        routedAgent: result?.agent,
        conversationId,
        userId,
      });

      return res.status(500).json({
        success: false,
        code: "NO_AGENT_RESPONSE",
        message: "Agent produced no response.",
      });
    }

    const images = result?.images ?? [];
    const artifacts = result?.artifacts ?? [];

    await addMessage(conversationId, "assistant", response);

    /*
     * Persist to Chat Service — best effort. A failure here must
     * NOT turn a successful, already-billed agent response into
     * an error for the user, so it's isolated in its own try/catch
     * rather than sharing the outer one.
     */
    try {
      await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
        conversationId,
        role: "user",
        content: prompt,
      });

      await axios.post(`${process.env.CHAT_SERVICE_URL}/save-message`, {
        conversationId,
        role: "assistant",
        content: response,
        images,
        artifacts,
      });
    } catch (chatServiceError) {
      console.error("[agent controller] chat service save failed:", {
        conversationId,
        error: chatServiceError.message,
      });
      // TODO: push to a retry queue instead of silently dropping
    }

    return res.status(200).json({
      success: true,
      content: response,
      agent: result?.agent,
      images,
      artifacts,
      // credits: result?.credits,
      // deductedCredits: result?.deductedCredits,
      credits: result?.creditDeduction?.credits,
      deductedCredits: result?.creditDeduction?.deductedCredits,
    });
  } catch (error) {
    console.error("[agent controller]", error);

    if (error.status) {
      return res.status(error.status).json(error.data);
    }

    if (error.code === "INSUFFICIENT_CREDITS") {
      return res.status(402).json({
        success: false,
        code: "INSUFFICIENT_CREDITS",
        message: "You don't have enough credits to use this agent.",
        credits: error.credits,
        requiredCredits: error.requiredCredits,
        agent: agentType,
      });
    }

    return next(error);
  }
};
