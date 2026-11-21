ALTER TABLE "agent_threads" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "agent_threads" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;