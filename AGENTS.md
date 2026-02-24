# Agents

## Cursor Cloud specific instructions

### Overview
Vexa AI is a fullstack TypeScript application: Express backend + React/Vite frontend, served together on port 5000. Uses in-memory storage at runtime (no database required).

### Running the dev server
```
VITE_OPENAI_API_KEY=<key> npm run dev
```
The server starts on port 5000 and serves both the API and the Vite-powered React frontend. Without a valid `VITE_OPENAI_API_KEY`, the app loads and functions but chat responses return a graceful error message.

### Key commands
- `npm run dev` — start dev server (Express + Vite HMR on port 5000)
- `npm run check` — TypeScript type checking (pre-existing type errors exist in the repo, especially in `client/src/expo-components/` which requires React Native types not installed at the web level)
- `npm run build` — production build (Vite client + esbuild server)

### Caveats
- The `npm run check` (`tsc`) command exits with errors due to pre-existing type issues (Expo/React Native modules, some type mismatches). This does not prevent the dev server from running, as `tsx` does not enforce strict type checks.
- No ESLint or Prettier configuration exists in the repo; linting is limited to `tsc`.
- The `VITE_OPENAI_API_KEY` env var is read by both server (`server/routes.ts`) and client (via Vite's env injection). A dummy value allows the server to start; real AI responses require a valid OpenAI key.
- `client/src/expo-components/` contains React Native/Expo mobile components with their own `package.json`. These are not part of the web dev workflow and can be ignored unless working on mobile features.
