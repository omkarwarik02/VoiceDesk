CREATE TABLE "agent_threads" (
	"thread_id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "user_id" text NOT NULL;