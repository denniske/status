# Migration `20200912193247-alert3`

This migration has been generated by Dennis Keil at 9/12/2020, 9:32:47 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Alert" ADD COLUMN "conditionValue" Decimal(65,30)   ,
ALTER COLUMN "condition" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200912192711-alert2..20200912193247-alert3
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -74,7 +74,8 @@
   component         Component?   @relation(fields: [componentId], references: [id])
   metricId          Int?
   metric            Metric?      @relation(fields: [metricId], references: [id])
-  condition         String
+  condition         String?
+  conditionValue    Float?
   activated         Boolean      @default(false)
 }
```

