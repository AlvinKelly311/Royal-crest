import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  MOMO_BASE_URL: z.string().default("https://sandbox.momodeveloper.mtn.com"),
  MOMO_TARGET_ENV: z.string().default("sandbox"),
  MOMO_SUBSCRIPTION_KEY: z.string().min(1),
  MOMO_API_USER: z.string().min(1),
  MOMO_API_KEY: z.string().min(1),
  MOMO_CURRENCY: z.string().default("EUR"),
});

export const env = schema.parse(process.env);
