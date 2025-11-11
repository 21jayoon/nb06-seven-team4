-- CreateEnum
CREATE TYPE "exerciseType" AS ENUM ('RUN', 'CIYCLE', 'SWIM');

-- CreateEnum
CREATE TYPE "medalType" AS ENUM ('OVERTENMEMBER', 'OVERHUNDREADRECORD', 'OVERHUNDREADLIKE');

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "tag" TEXT[],
    "discordwebhookurl" TEXT,
    "discordserverinviteurl" TEXT,
    "goldnumber" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
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
CREATE TABLE "GroipLike" (
    "participantId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "GroipLike_pkey" PRIMARY KEY ("participantId","groupId")
);

-- CreateTable
CREATE TABLE "ExerciseRecord" (
    "id" SERIAL NOT NULL,
    "exercisetype" "exerciseType" NOT NULL,
    "description" TEXT,
    "playtime" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medal" (
    "id" SERIAL NOT NULL,
    "medaltype" "medalType" NOT NULL,
    "groupid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_groupid_nickname_key" ON "Participant"("groupid", "nickname");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroipLike" ADD CONSTRAINT "GroipLike_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroipLike" ADD CONSTRAINT "GroipLike_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
