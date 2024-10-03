/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `PostPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostPlan_title_key" ON "PostPlan"("title");
