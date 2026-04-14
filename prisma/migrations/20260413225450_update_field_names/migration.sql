/*
  Warnings:

  - You are about to drop the column `baptism_name` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `confirmation_date` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `confirmation_minister` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `confirmation_place` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_baptism` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_death` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `extra_field_1` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `extra_field_2` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `fathers_name` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `first_holy_communion_date` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `first_holy_communion_minister` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `first_holy_communion_place` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `home_town` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `marriage_date` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `marriage_minister` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `marriage_partner_name` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `marriage_place` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `marriage_witnesses` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `mothers_name` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `name_of_god_parents` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `name_of_minister` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `other_names` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `place_of_baptism` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `serial_number` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `solemn_or_private` on the `baptism_records` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `baptism_records` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[S_NO]` on the table `baptism_records` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "baptism_records_baptism_name_idx";

-- DropIndex
DROP INDEX "baptism_records_date_of_baptism_idx";

-- DropIndex
DROP INDEX "baptism_records_serial_number_idx";

-- DropIndex
DROP INDEX "baptism_records_serial_number_key";

-- DropIndex
DROP INDEX "baptism_records_surname_idx";

-- AlterTable
ALTER TABLE "baptism_records" DROP COLUMN "baptism_name",
DROP COLUMN "confirmation_date",
DROP COLUMN "confirmation_minister",
DROP COLUMN "confirmation_place",
DROP COLUMN "date_of_baptism",
DROP COLUMN "date_of_birth",
DROP COLUMN "date_of_death",
DROP COLUMN "extra_field_1",
DROP COLUMN "extra_field_2",
DROP COLUMN "fathers_name",
DROP COLUMN "first_holy_communion_date",
DROP COLUMN "first_holy_communion_minister",
DROP COLUMN "first_holy_communion_place",
DROP COLUMN "home_town",
DROP COLUMN "marriage_date",
DROP COLUMN "marriage_minister",
DROP COLUMN "marriage_partner_name",
DROP COLUMN "marriage_place",
DROP COLUMN "marriage_witnesses",
DROP COLUMN "mothers_name",
DROP COLUMN "name_of_god_parents",
DROP COLUMN "name_of_minister",
DROP COLUMN "other_names",
DROP COLUMN "place_of_baptism",
DROP COLUMN "remarks",
DROP COLUMN "serial_number",
DROP COLUMN "solemn_or_private",
DROP COLUMN "surname",
ADD COLUMN     "BAPTISM_NAME" TEXT,
ADD COLUMN     "CONFIRMATION_DATE" TIMESTAMP(3),
ADD COLUMN     "CONFIRMATION_MINISTER" TEXT,
ADD COLUMN     "CONFIRMATION_PLACE" TEXT,
ADD COLUMN     "DATE_OF_BAPTISM" TIMESTAMP(3),
ADD COLUMN     "DATE_OF_BIRTH" TIMESTAMP(3),
ADD COLUMN     "DATE_OF_DEATH" TIMESTAMP(3),
ADD COLUMN     "FATHERS_NAME" TEXT,
ADD COLUMN     "FIRST_HOLY_COMMUNION_DATE" TIMESTAMP(3),
ADD COLUMN     "FIRST_HOLY_COMMUNION_MINISTER" TEXT,
ADD COLUMN     "FIRST_HOLY_COMMUNION_PLACE" TEXT,
ADD COLUMN     "HOME_TOWN" TEXT,
ADD COLUMN     "MARRIAGE_DATE" TIMESTAMP(3),
ADD COLUMN     "MARRIAGE_MINISTER" TEXT,
ADD COLUMN     "MARRIAGE_PLACE" TEXT,
ADD COLUMN     "MOTHERS_NAME" TEXT,
ADD COLUMN     "NAME_OF_GOD_PARENTS" TEXT,
ADD COLUMN     "NAME_OF_MINISTER" TEXT,
ADD COLUMN     "NAME_OF_PARTNER" TEXT,
ADD COLUMN     "OTHER_NAME_S" TEXT,
ADD COLUMN     "PLACE_OF_BAPTISM" TEXT,
ADD COLUMN     "REMARKS" TEXT,
ADD COLUMN     "SOLEMN_OR_PRIVATE" TEXT,
ADD COLUMN     "SURNAME" TEXT,
ADD COLUMN     "S_NO" INTEGER,
ADD COLUMN     "WITNESS_S" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "baptism_records_S_NO_key" ON "baptism_records"("S_NO");

-- CreateIndex
CREATE INDEX "baptism_records_S_NO_idx" ON "baptism_records"("S_NO");

-- CreateIndex
CREATE INDEX "baptism_records_BAPTISM_NAME_idx" ON "baptism_records"("BAPTISM_NAME");

-- CreateIndex
CREATE INDEX "baptism_records_SURNAME_idx" ON "baptism_records"("SURNAME");

-- CreateIndex
CREATE INDEX "baptism_records_DATE_OF_BAPTISM_idx" ON "baptism_records"("DATE_OF_BAPTISM");
