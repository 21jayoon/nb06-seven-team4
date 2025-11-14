-- CreateEnum
CREATE TYPE "exerciseType" AS ENUM ('RUN', 'CYCLE', 'SWIM');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('OVERTENMEMBER', 'OVERHUNDREADRECORD', 'OVERHUNDREADLIKE');

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,
    "description" TEXT,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "tag" TEXT[],
    "discordwebhookurl" TEXT,
    "discordserverinviteurl" TEXT,
    "goalNumber" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isowner" BOOLEAN NOT NULL,
    "groupid" INTEGER NOT NULL,
    "hasLiked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseRecord" (
    "id" SERIAL NOT NULL,
    "exerciseType" "exerciseType" NOT NULL,
    "description" TEXT,
    "time" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "photos" TEXT[],
    "authorNickname" TEXT NOT NULL,
    "authorPassword" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medal" (
    "id" SERIAL NOT NULL,
    "type" "Type" NOT NULL,
    "groupid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupName_key" ON "Group"("groupName");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_groupid_nickname_key" ON "Participant"("groupid", "nickname");

-- CreateIndex
CREATE INDEX "ExerciseRecord_groupId_idx" ON "ExerciseRecord"("groupId");

-- CreateIndex
CREATE INDEX "ExerciseRecord_groupId_createdAt_idx" ON "ExerciseRecord"("groupId", "createdAt");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRecord" ADD CONSTRAINT "ExerciseRecord_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
