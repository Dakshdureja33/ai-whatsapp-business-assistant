#!/usr/bin/env bash
set -e

# ------------------------------------------------------------
# 1️⃣ Start localtunnel (public URL) on port 8000
# ------------------------------------------------------------
# Install localtunnel if not present (npx -y does it automatically)
LT_URL=$(npx -y localtunnel --port 8000 | tail -n1)
# The command prints something like "yoururl.loca.lt" on the last line
# Extract only the URL (remove any surrounding text)
LT_URL=$(echo "$LT_URL" | grep -Eo 'https?://[^ ]+')

echo "🌐 Public tunnel URL: $LT_URL"

# ------------------------------------------------------------
# 2️⃣ Write the URL into backend/.env (creates or updates WEBHOOK_URL)
# ------------------------------------------------------------
ENV_FILE="/Users/dakshdureja/new project/backend/.env"
# Ensure the line exists and replace if it does
if grep -q '^WEBHOOK_URL=' "$ENV_FILE"; then
  sed -i '' "s|^WEBHOOK_URL=.*|WEBHOOK_URL=$LT_URL/api/webhooks|" "$ENV_FILE"
else
  echo "WEBHOOK_URL=$LT_URL/api/webhooks" >> "$ENV_FILE"
fi

# ------------------------------------------------------------
# 3️⃣ Start FastAPI backend (uvicorn) in background
# ------------------------------------------------------------
cd "/Users/dakshdureja/new project/backend"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "🚀 FastAPI backend started (PID $BACKEND_PID)"

# ------------------------------------------------------------
# 4️⃣ Start Next.js frontend (npm run dev) in background
# ------------------------------------------------------------
cd "/Users/dakshdureja/new project/frontend"
npm run dev &
FRONTEND_PID=$!

echo "⚡ Next.js frontend started (PID $FRONTEND_PID)"

# ------------------------------------------------------------
# 5️⃣ Wait for user to stop the demo (Ctrl‑C)
# ------------------------------------------------------------
function cleanup() {
  echo "\n🛑 Stopping demo..."
  kill $BACKEND_PID $FRONTEND_PID || true
  exit 0
}
trap cleanup INT TERM

# Keep script alive while background processes run
wait $BACKEND_PID $FRONTEND_PID
