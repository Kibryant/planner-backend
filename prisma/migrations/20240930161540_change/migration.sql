-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_revenueGoalId_fkey";

-- DropForeignKey
ALTER TABLE "PostPlan" DROP CONSTRAINT "PostPlan_userId_fkey";

-- DropForeignKey
ALTER TABLE "RevenueGoal" DROP CONSTRAINT "RevenueGoal_userId_fkey";

-- AlterTable
ALTER TABLE "RevenueGoal" ALTER COLUMN "monthlyGoal" DROP NOT NULL,
ALTER COLUMN "dailyGoal" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PostPlan" ADD CONSTRAINT "PostPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueGoal" ADD CONSTRAINT "RevenueGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_revenueGoalId_fkey" FOREIGN KEY ("revenueGoalId") REFERENCES "RevenueGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
