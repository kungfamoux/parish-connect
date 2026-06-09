-- CreateTable
CREATE TABLE "zonal_council_members" (
    "id" SERIAL NOT NULL,
    "S_NO" INTEGER NOT NULL,
    "NAME" TEXT,
    "IS_VACANT" BOOLEAN NOT NULL DEFAULT false,
    "POSITION" TEXT NOT NULL,
    "PHONE" TEXT,
    "RECORD_TYPE" TEXT NOT NULL,
    "ZONE" TEXT,
    "GROUP_NAME" TEXT NOT NULL,
    "ELECTION_YEAR" INTEGER NOT NULL,
    "IS_ACTIVE" BOOLEAN NOT NULL DEFAULT true,
    "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zonal_council_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "zonal_council_members_S_NO_idx" ON "zonal_council_members"("S_NO");

-- CreateIndex
CREATE INDEX "zonal_council_members_NAME_idx" ON "zonal_council_members"("NAME");

-- CreateIndex
CREATE INDEX "zonal_council_members_POSITION_idx" ON "zonal_council_members"("POSITION");

-- CreateIndex
CREATE INDEX "zonal_council_members_ZONE_idx" ON "zonal_council_members"("ZONE");

-- CreateIndex
CREATE INDEX "zonal_council_members_GROUP_NAME_idx" ON "zonal_council_members"("GROUP_NAME");

-- CreateIndex
CREATE INDEX "zonal_council_members_ELECTION_YEAR_idx" ON "zonal_council_members"("ELECTION_YEAR");
