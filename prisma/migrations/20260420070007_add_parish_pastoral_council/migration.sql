-- CreateTable
CREATE TABLE "parish_pastoral_council" (
    "id" SERIAL NOT NULL,
    "S_NO" INTEGER NOT NULL,
    "NAME" TEXT NOT NULL,
    "ZONE" TEXT,
    "POSITION" TEXT NOT NULL,
    "IS_ACTIVE" BOOLEAN NOT NULL DEFAULT true,
    "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parish_pastoral_council_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parish_pastoral_council_S_NO_idx" ON "parish_pastoral_council"("S_NO");

-- CreateIndex
CREATE INDEX "parish_pastoral_council_NAME_idx" ON "parish_pastoral_council"("NAME");

-- CreateIndex
CREATE INDEX "parish_pastoral_council_POSITION_idx" ON "parish_pastoral_council"("POSITION");
