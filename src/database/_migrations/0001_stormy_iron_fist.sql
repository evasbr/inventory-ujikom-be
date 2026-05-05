ALTER TABLE "loans" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "status" SET DEFAULT 'PENDING'::text;--> statement-breakpoint
DROP TYPE "public"."loan_status";--> statement-breakpoint
CREATE TYPE "public"."loan_status" AS ENUM('PENDING', 'REJECTED', 'ONGOING', 'RETURNED', 'OVERDUE');--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"public"."loan_status";--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "status" SET DATA TYPE "public"."loan_status" USING "status"::"public"."loan_status";