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

// Render's free tier spins a service down after ~15 min with no incoming
// requests. We treat "the platform is being used" as any request hitting
// the gateway's /api routes. As long as that happened recently, we ping
// ALL services (not just the one the user is currently hitting) so a
// service the user hasn't touched in a while - e.g. Billing while they've
// only been chatting - doesn't 502 the first time they open it. If the
// gateway sees no activity for a full window, we stop pinging and let
// every service fall asleep on its own.
const ACTIVITY_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const KEEPALIVE_INTERVAL_MS = 10 * 60 * 1000; // ping every 10 min (< 15 min window)

let lastActivityAt = 0; // 0 = no activity yet since boot

export const recordActivity = () => {
  lastActivityAt = Date.now();
};

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

const pingService = async (service) => {
  if (!service.url) return false;

  const url = service.url.replace(/\/$/, "");

  try {
    await axios.get(`${url}/`, { timeout: 10000 });
    console.log(`[keepalive] ${service.name} pinged OK`);
    return true;
  } catch (error) {
    console.log(`[keepalive] ${service.name} ping failed: ${error.message}`);
    return false;
  }
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

export const startKeepAlive = () => {
  setInterval(async () => {
    if (lastActivityAt === 0) {
      return; // nobody has hit the gateway yet since boot
    }

    const idleForMs = Date.now() - lastActivityAt;

    if (idleForMs > ACTIVITY_WINDOW_MS) {
      console.log(
        `[keepalive] No gateway activity for ${Math.round(idleForMs / 60000)} min - skipping ping, letting services sleep`,
      );
      return;
    }

    console.log("[keepalive] Gateway recently active - pinging all services");
    await Promise.allSettled(services.map((service) => pingService(service)));
  }, KEEPALIVE_INTERVAL_MS);

  console.log(
    `[keepalive] Started - checking every ${KEEPALIVE_INTERVAL_MS / 60000} min`,
  );
};
