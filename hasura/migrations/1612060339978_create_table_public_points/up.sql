CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."points"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "the_geom" text NOT NULL, "cartodb_id" integer NOT NULL, "tipo" text NOT NULL, "latitude" float8 NOT NULL, "longitude" float8 NOT NULL, "color" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
