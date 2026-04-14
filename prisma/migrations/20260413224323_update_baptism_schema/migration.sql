/*
  Warnings:

  - A unique constraint covering the columns `[serial_number]` on the table `baptism_records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "baptism_records_serial_number_key" ON "baptism_records"("serial_number");

-- CreateIndex
CREATE INDEX "baptism_records_serial_number_idx" ON "baptism_records"("serial_number");

-- CreateIndex
CREATE INDEX "baptism_records_baptism_name_idx" ON "baptism_records"("baptism_name");

-- CreateIndex
CREATE INDEX "baptism_records_surname_idx" ON "baptism_records"("surname");

-- CreateIndex
CREATE INDEX "baptism_records_date_of_baptism_idx" ON "baptism_records"("date_of_baptism");
