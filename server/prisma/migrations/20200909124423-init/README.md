# Migration `20200909124423-init`

This migration has been generated by Dennis Keil at 9/9/2020, 2:44:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Group" (
"id" SERIAL,
"name" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Component" (
"id" SERIAL,
"groupId" integer   NOT NULL ,
"name" text   NOT NULL ,
"statusUrl" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Status" (
"componentId" integer   NOT NULL ,
"date" timestamp(3)   NOT NULL ,
"available" boolean   NOT NULL ,
PRIMARY KEY ("componentId","date")
)

CREATE TABLE "public"."Metric" (
"id" SERIAL,
"groupId" integer   NOT NULL ,
"name" text   NOT NULL ,
"url" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Value" (
"metricId" integer   NOT NULL ,
"date" timestamp(3)   NOT NULL ,
"value" Decimal(65,30)   NOT NULL ,
PRIMARY KEY ("metricId","date")
)

ALTER TABLE "public"."Component" ADD FOREIGN KEY ("groupId")REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Status" ADD FOREIGN KEY ("componentId")REFERENCES "public"."Component"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Metric" ADD FOREIGN KEY ("groupId")REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Value" ADD FOREIGN KEY ("metricId")REFERENCES "public"."Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200909124423-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,63 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Group {
+  id           Int      @default(autoincrement()) @id
+  name         String
+
+  components   Component[]
+  metrics      Metric[]
+}
+
+
+model Component {
+  id          Int      @default(autoincrement()) @id
+
+  groupId     Int
+  group       Group    @relation(fields: [groupId], references: [id])
+
+  name        String
+  statusUrl   String
+  status      Status[]
+}
+
+model Status {
+  componentId  Int
+  component    Component   @relation(fields: [componentId], references: [id])
+
+  date         DateTime
+  available    Boolean
+
+  @@id([componentId, date])
+}
+
+
+model Metric {
+  id          Int      @default(autoincrement()) @id
+
+  groupId     Int
+  group       Group    @relation(fields: [groupId], references: [id])
+
+  name        String
+  url         String
+  values      Value[]
+}
+
+model Value {
+  metricId     Int
+  metric       Metric   @relation(fields: [metricId], references: [id])
+
+  date         DateTime
+  value        Float
+
+  @@id([metricId, date])
+}
```


