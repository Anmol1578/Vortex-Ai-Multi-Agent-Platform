import redis from "../../../shared/redis/redis.js";

const Limits = {
  chat: 20,
  search: 5,
  coding: 5,
  pdf: 5,
  ppt: 5,
  vision: 5,
  pdfRag: 5,
  imageAnalyzer: 5,
};

export const checkAgentLimit = async (userId, agent) => {
  const max = Limits[agent] || Limits["chat"];
  const key = `rate:${userId}:${agent}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  let ttl = await redis.ttl(key);
  if (ttl < 0) {
    await redis.expire(key, 60);
    ttl = 60;
  }

  if (count > max) {
    const minutes = Math.floor(ttl / 60);
    const seconds = ttl % 60;
    const time = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const error = new Error(`Rate limit exceeded for ${agent}.`);
    error.status = 429;
    error.data = {
      success: false,
      code: "RATE_LIMIT_EXCEEDED",
      agent,
      limit: max,
      remainingTime: ttl,
      retryAfter: time,
      message: `Rate limit exceeded for ${agent}. Try again in ${time}.`,
    };
    throw error;
  }

  return {
    success: true,
    agent,
    limit: max,
    remaining: max - count,
    resetIn: ttl,
  };
};