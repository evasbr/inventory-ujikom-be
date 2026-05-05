CREATE TYPE "public"."inventory_status" AS ENUM('AVAILABLE', 'BORROWED', 'BROKEN');--> statement-breakpoint
CREATE TYPE "public"."loan_status" AS ENUM('BORROWED', 'RETURNED', 'OVERDUE');--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" "inventory_status" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_id" uuid NOT NULL,
	"borrower_name" varchar(255) NOT NULL,
	"loan_date" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp,
	"return_date" timestamp,
	"status" "loan_status" DEFAULT 'BORROWED' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;