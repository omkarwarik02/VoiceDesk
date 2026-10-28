import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(5000),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is missing in .env"),
  DATABASE_URL:z.string().startsWith("postgres","DATABASE_URL must be a Postgres connection string")
});

export const env = EnvSchema.parse(process.env);

