/*
  Warnings:

  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevenueGoal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_revenueGoalId_fkey";

-- DropForeignKey
ALTER TABLE "RevenueGoal" DROP CONSTRAINT "RevenueGoal_userId_fkey";

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "RevenueGoal";
