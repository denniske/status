# Migration `20200912181402-delay-in-minutes`

This migration has been generated by Dennis Keil at 9/12/2020, 8:14:02 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Component" ADD COLUMN "delayInMinutes" integer   NOT NULL DEFAULT 1

ALTER TABLE "public"."Metric" ADD COLUMN "delayInMinutes" integer   NOT NULL DEFAULT 1
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200909185918-status-reponse-time-nullable..20200912181402-delay-in-minutes
--- datamodel.dml
+++ datamodel.dml
@@ -2,13 +2,14 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
+  binaryTargets = ["native", "darwin", "debian-openssl-1.1.x"]
 }
 model Group {
   id           Int      @default(autoincrement()) @id
@@ -19,16 +20,17 @@
 }
 model Component {
-  id          Int      @default(autoincrement()) @id
+  id                Int      @default(autoincrement()) @id
-  groupId     Int
-  group       Group    @relation(fields: [groupId], references: [id])
+  groupId           Int
+  group             Group    @relation(fields: [groupId], references: [id])
-  name        String
-  statusUrl   String
-  status      Status[]
+  name              String
+  statusUrl         String
+  delayInMinutes    Int      @default(1)
+  status            Status[]
 }
 model Status {
   componentId    Int
@@ -42,17 +44,18 @@
 }
 model Metric {
-  id          Int      @default(autoincrement()) @id
+  id                Int      @default(autoincrement()) @id
-  groupId     Int
-  group       Group    @relation(fields: [groupId], references: [id])
+  groupId           Int
+  group             Group    @relation(fields: [groupId], references: [id])
-  name        String
-  url         String
-  path        String
-  values      Value[]
+  name              String
+  url               String
+  path              String
+  delayInMinutes    Int      @default(1)
+  values            Value[]
 }
 model Value {
   metricId     Int
```


