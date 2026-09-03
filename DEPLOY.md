# Deploying Vortex to Render

## What changed from your original code
1. **`backend/services/auth/controllers/auth.controller.js`** — session cookie now
   uses `sameSite: "none", secure: true` in production (was `strict`/`false`,
   which silently breaks login the moment frontend and backend are on
   different domains).
2. **`backend/services/auth/config/firebase.js`** — now reads credentials from
   `FIREBASE_SERVICE_ACCOUNT_JSON` when set, falling back to the local
   `serviceAccountKey.json` file for local dev only.
3. **`backend/services/auth/.dockerignore`** — `serviceAccountKey.json` is now
   excluded from the Docker image, so the raw key never ships in a container.
4. **`render.yaml`** (new) — the full 7-service blueprint.

## One-time setup before you click "Apply"
- **Rotate the Firebase key.** It was sitting as a plaintext file in your
  upload — even though it never hit GitHub, treat it as burned. Generate a
  new service account key in the Firebase console, then paste its full JSON
  as the `FIREBASE_SERVICE_ACCOUNT_JSON` value when Render prompts for it
  (must be valid JSON on one line).
- **MongoDB**: this project has no DB hosted on Render — create a free
  MongoDB Atlas cluster, and under Network Access allow `0.0.0.0/0` (or
  Render's published egress IPs) so `vortex-auth`, `vortex-chat`,
  `vortex-agent`, and `vortex-billing` can all reach it. Use the same
  connection string (with a distinct DB name per service, or one shared DB —
  your call) for each `MONGO_URI` prompt.
- **Qdrant**: spin up a free Qdrant Cloud cluster and grab its URL for
  `QDRANT_URL`.
- **S3 bucket**: create one for uploaded PDFs/images and note the region,
  bucket name, and an IAM key pair scoped to it.
- **Razorpay / Groq / Google AI Studio / OpenRouter / Tavily**: grab API keys
  from each dashboard.

## Deploying
1. Push `render.yaml` (and the code fixes above) to your repo's default branch.
2. In the Render Dashboard: **New +** → **Blueprint** → select this repo.
3. Render will show all 7 services it's about to create. Every `sync: false`
   variable will prompt you for a value right there — fill them in.
4. Click **Apply**. First build will take a while (5 Docker images + a Vite
   build).
5. Once `vortex-gateway` and `vortex-frontend` are live, check their actual
   `.onrender.com` URLs (Render appends a random suffix if your chosen name
   is taken) and update:
   - `FRONTEND_URL` on `vortex-gateway` to match the real frontend URL
   - `VITE_SERVER_URL` on `vortex-frontend` to match the real gateway URL
   Both are currently hardcoded to the "clean" names in `render.yaml` — fix
   and manually redeploy both services if Render had to rename either one.

## Known limitations to keep in mind
- Uploaded files land on local disk (`services/agent/config/temp`) before
  being pushed to S3. That's fine for a single instance since the file is
  written and forwarded within one request, but don't scale `vortex-agent`
  to multiple instances without moving that to direct-to-S3 streaming or a
  shared volume — Render's disk isn't shared across instances and is wiped
  on every deploy.
- `vortex-auth`'s `/user/:userId`, `/update-plan`, and `/deduct-credits`
  routes have no auth of their own — they're safe *only* because
  `vortex-auth` is a private service. Don't ever change it to `type: web`
  without adding real authentication to those routes first.
- Double check the Gemini model id `gemini-3.6-flash` in
  `services/agent/config/llmModels.js` is a real, currently available model
  before you rely on it — verify against Google's current model list.
