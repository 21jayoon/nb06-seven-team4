/*
  Warnings:

  - You are about to drop the column `groupName` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Group_groupName_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "groupName",
DROP COLUMN "likes",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");
