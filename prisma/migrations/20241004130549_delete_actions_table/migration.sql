/*
  Warnings:

  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_revenueGoalId_fkey";

-- AlterTable
ALTER TABLE "RevenueGoal" ADD COLUMN     "actions" TEXT[];

-- DropTable
DROP TABLE "Action";
