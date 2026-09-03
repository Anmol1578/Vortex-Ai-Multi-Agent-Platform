import { cert, initializeApp } from "firebase-admin";

/*
 * In production (Render), pass the full service-account JSON as a single
 * env var (FIREBASE_SERVICE_ACCOUNT_JSON) instead of shipping the raw key
 * file inside the Docker image. Locally, we still fall back to
 * ./serviceAccountKey.json for convenience if the env var isn't set.
 */
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  const module = await import("../serviceAccountKey.json", {
    with: { type: "json" },
  });
  serviceAccount = module.default;
}

export const app = initializeApp({
  credential: cert(serviceAccount),
});
