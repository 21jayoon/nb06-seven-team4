/*
  Warnings:

  - You are about to drop the column `medaltype` on the `Medal` table. All the data in the column will be lost.
  - Added the required column `type` to the `Medal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medal" DROP COLUMN "medaltype",
ADD COLUMN     "type" "medalType" NOT NULL;
