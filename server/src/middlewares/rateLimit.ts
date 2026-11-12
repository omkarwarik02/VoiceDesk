import { getAuth } from '@clerk/express'
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'

export const agentlimiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	limit: 10, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
    keyGenerator:(req) => getAuth(req).userId ?? ipKeyGenerator(req.ip ?? ""),
    message: { ok: false, error: "Too many requests. Please wait a minute and try again." },
	
})