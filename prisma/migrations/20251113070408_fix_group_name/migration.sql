/*
  Warnings:

  - You are about to drop the column `name` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `GroipLike` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupName]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupName` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroipLike" DROP CONSTRAINT "GroipLike_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroipLike" DROP CONSTRAINT "GroipLike_participantId_fkey";

-- DropIndex
DROP INDEX "Group_name_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "name",
ADD COLUMN     "groupName" TEXT NOT NULL;

-- DropTable
DROP TABLE "GroipLike";

-- CreateTable
CREATE TABLE "GroupLike" (
    "participantId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "GroupLike_pkey" PRIMARY KEY ("participantId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupName_key" ON "Group"("groupName");

-- AddForeignKey
ALTER TABLE "GroupLike" ADD CONSTRAINT "GroupLike_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupLike" ADD CONSTRAINT "GroupLike_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
