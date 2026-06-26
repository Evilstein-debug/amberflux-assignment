import "dotenv/config";

// All environment-dependent values live here — never read process.env directly elsewhere
export const config = {
  port: Number(process.env["PORT"] ?? 3001),
  fastApiUrl: process.env["FASTAPI_URL"] ?? "http://localhost:8000",
} as const;
