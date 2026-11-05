import cors from "cors";
import multer from "multer";
import { env } from "./config/env.js";
import { sql } from "drizzle-orm";
import { db } from "./db/client.js";
import { orderRouter } from "./routes/order.routes.js";
import { agentRouter } from "./routes/agent.route.js";
import { checkpointer } from "./agent/agent.js";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { HttpError } from "./utils/httpError.js";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth } from "./middlewares/requireAuth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY, secretKey:process.env.CLERK_SECRET_KEY, }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "voicedesk-server" });
});
app.use("/api/orders", requireAuth, orderRouter);
app.use("/api/agent", requireAuth, agentRouter);
app.get("/api/db-check", async (_req, res) => {
  const result = await db.execute(sql`select now() as time`);
  res.json({ ok: true, dbTime: result.rows[0] });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ ok: false, error: err.message });
  }

  console.error(err);
  res.status(500).json({ ok: false, error: "Something went wrong" });
});

await checkpointer.setup();

app.listen(env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${env.PORT}`);
});
