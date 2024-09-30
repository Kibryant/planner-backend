/*
  Warnings:

  - You are about to drop the `DailyGoal` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dailyGoal` to the `RevenueGoal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyGoal" DROP CONSTRAINT "DailyGoal_revenueGoalId_fkey";

-- AlterTable
ALTER TABLE "RevenueGoal" ADD COLUMN     "dailyGoal" TEXT NOT NULL;

-- DropTable
DROP TABLE "DailyGoal";
