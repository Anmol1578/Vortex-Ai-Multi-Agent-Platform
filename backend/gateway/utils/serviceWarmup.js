import axios from "axios";

const services = [
  {
    name: "Auth",
    url: process.env.AUTH_SERVICE_URL,
  },
  {
    name: "Chat",
    url: process.env.CHAT_SERVICE_URL,
  },
  {
    name: "Agent",
    url: process.env.AGENT_SERVICE_URL,
  },
  {
    name: "Billing",
    url: process.env.BILLING_SERVICE_URL,
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const wakeService = async (service) => {
  if (!service.url) {
    console.warn(`[warmup] ${service.name} URL is missing`);
    return false;
  }

  const url = service.url.replace(/\/$/, "");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await axios.get(`${url}/`, {
        timeout: 30000,
      });

      console.log(`[warmup] ${service.name} is awake`);
      return true;
    } catch (error) {
      console.log(
        `[warmup] ${service.name} attempt ${attempt}/3 failed: ${error.message}`,
      );

      if (attempt < 3) {
        await sleep(3000);
      }
    }
  }

  console.warn(`[warmup] ${service.name} could not be awakened`);
  return false;
};

export const warmupServices = async () => {
  console.log("[warmup] Starting backend service warmup...");

  const results = await Promise.allSettled(
    services.map((service) => wakeService(service)),
  );

  const awake = results.filter(
    (result) => result.status === "fulfilled" && result.value === true,
  ).length;

  console.log(`[warmup] Completed: ${awake}/${services.length} awake`);

  return results;
};