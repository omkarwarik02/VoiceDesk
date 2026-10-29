import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { sql } from "drizzle-orm"; 
import { db } from "./db/client.js";
import { orderRouter } from "./routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "voicedesk-server" });
});
app.use("/api/orders", orderRouter);
app.get("/api/db-check",async(_req,res)=>{
    const result = await db.execute(sql`select now() as time`);
    res.json({ ok:true, dbTime:result.rows[0]})
});

app.listen(env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${env.PORT}`);
});
