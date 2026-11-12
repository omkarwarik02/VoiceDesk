import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(5000),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is missing in .env"),
  DATABASE_URL:z.string().startsWith("postgres","DATABASE_URL must be a Postgres connection string"),
   CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),   // new
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),  
  FRONTEND_URL: z.string().default("http://localhost:5173"), 
});

export const env = EnvSchema.parse(process.env);

