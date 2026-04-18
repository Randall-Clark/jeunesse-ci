CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "guide_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"guide_id" integer NOT NULL,
	"order" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"tips" text[] DEFAULT '{}' NOT NULL,
	"documents" text[] DEFAULT '{}' NOT NULL,
	"related_resource_ids" integer[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"step_count" integer DEFAULT 0 NOT NULL,
	"duration" text NOT NULL,
	"difficulty" text NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"address" text,
	"city" text NOT NULL,
	"phone" text,
	"email" text,
	"website" text,
	"services" text[] DEFAULT '{}' NOT NULL,
	"opening_hours" text
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content" text,
	"type" text NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deadline" timestamp with time zone,
	"source" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL
);
