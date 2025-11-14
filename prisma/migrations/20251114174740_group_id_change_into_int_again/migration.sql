/*
  Warnings:

  - The primary key for the `Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `GroupLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Participant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `groupId` on the `ExerciseRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `participantId` on the `ExerciseRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `participantId` on the `GroupLike` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupId` on the `GroupLike` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupid` on the `Medal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `groupid` on the `Participant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ExerciseRecord" DROP CONSTRAINT "ExerciseRecord_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseRecord" DROP CONSTRAINT "ExerciseRecord_participantId_fkey";

-- DropForeignKey
ALTER TABLE "GroupLike" DROP CONSTRAINT "GroupLike_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupLike" DROP CONSTRAINT "GroupLike_participantId_fkey";

-- DropForeignKey
ALTER TABLE "Medal" DROP CONSTRAINT "Medal_groupid_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_groupid_fkey";

-- AlterTable
ALTER TABLE "ExerciseRecord" DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
DROP COLUMN "participantId",
ADD COLUMN     "participantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP CONSTRAINT "Group_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GroupLike" DROP CONSTRAINT "GroupLike_pkey",
DROP COLUMN "participantId",
ADD COLUMN     "participantId" INTEGER NOT NULL,
DROP COLUMN "groupId",
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD CONSTRAINT "GroupLike_pkey" PRIMARY KEY ("participantId", "groupId");

-- AlterTable
ALTER TABLE "Medal" DROP COLUMN "groupid",
ADD COLUMN     "groupid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "groupid",
ADD COLUMN     "groupid" INTEGER NOT NULL,
ADD CONSTRAINT "Participant_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "ExerciseRecord_groupId_idx" ON "ExerciseRecord"("groupId");

-- CreateIndex
CREATE INDEX "ExerciseRecord_participantId_idx" ON "ExerciseRecord"("participantId");

-- CreateIndex
CREATE INDEX "ExerciseRecord_groupId_createdAt_idx" ON "ExerciseRecord"("groupId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_groupid_nickname_key" ON "Participant"("groupid", "nickname");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupLike" ADD CONSTRAINT "GroupLike_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupLike" ADD CONSTRAINT "GroupLike_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRecord" ADD CONSTRAINT "ExerciseRecord_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRecord" ADD CONSTRAINT "ExerciseRecord_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
