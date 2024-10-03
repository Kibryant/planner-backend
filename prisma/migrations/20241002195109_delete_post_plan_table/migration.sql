/*
  Warnings:

  - You are about to drop the `PostPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostPlan" DROP CONSTRAINT "PostPlan_userId_fkey";

-- DropTable
DROP TABLE "PostPlan";

-- DropEnum
DROP TYPE "Month";

-- DropEnum
DROP TYPE "WeekDay";
