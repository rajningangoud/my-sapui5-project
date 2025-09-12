# SAP UI5 Friends Management App (Complete)

This archive contains a complete SAPUI5 frontend (`webapp/`) and an Express backend (`server/`) that serves a simple friends list REST API (`/api/friends`).

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```
3. Open the app in your browser:
   `http://localhost:4002/` (or the port printed by the server)


## Project layout
- `webapp/` — SAPUI5 application
- `server/` — Express backend and `friends.json` data file
- `package.json` — scripts to run the server

## Notes
- The server serves static files from `webapp/` and provides the REST API under `/api/friends`.
- If you want the app to persist changes, make sure the process has write permission on `server/friends.json`.
