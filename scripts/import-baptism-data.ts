import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: '.env' });

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function importBaptismData() {
  try {
    console.log('Starting baptism data import...');
    console.log('Clearing existing baptism records...');
    await prisma.baptismRecord.deleteMany({});

    const filePath = path.join(__dirname, '../BAPTISM REGISTER OF ST MARY PARISH TRANS EKULU ENUGU MAIN-1.xlsx');
    console.log(`Reading file from: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets['BAPTISM REGISTER'];
    if (!sheet) {
      throw new Error('Sheet "BAPTISM REGISTER" not found in XLSX file.');
    }

    const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
      header: 1,
      raw: true,
    });

    // Row 1 is title headers and row 2 is subheaders. Data starts at row 3.
    const dataRows = rows.slice(2);
    const normalizeText = (value: unknown): string | null => {
      if (value === null || value === undefined) return null;
      const text = String(value).trim();
      return text === '' ? null : text;
    };

    const parseDate = (value: unknown): Date | null => {
      if (value === null || value === undefined || value === '') return null;

      if (value instanceof Date && !isNaN(value.getTime())) {
        return value;
      }

      if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (!parsed) return null;
        return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      }

      const parsed = new Date(String(value));
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    const transformedRows = dataRows
      .map((row) => {
        const sNoValue = row[0];
        const sNo = typeof sNoValue === 'number' ? sNoValue : parseInt(String(sNoValue ?? ''), 10);

        return {
          sNo: Number.isFinite(sNo) ? sNo : null,
          dateOfBaptism: parseDate(row[1]),
          baptismName: normalizeText(row[2]),
          otherName: normalizeText(row[3]),
          surname: normalizeText(row[4]),
          dateOfBirth: parseDate(row[5]),
          placeOfBaptism: normalizeText(row[6]),
          homeTown: normalizeText(row[7]),
          fathersName: normalizeText(row[8]),
          mothersName: normalizeText(row[9]),
          solemnOrPrivate: normalizeText(row[10]),
          nameOfGodParents: normalizeText(row[11]),
          nameOfMinister: normalizeText(row[12]),
          firstHolyCommunionDate: parseDate(row[13]),
          firstHolyCommunionPlace: normalizeText(row[14]),
          firstHolyCommunionMinister: normalizeText(row[15]),
          confirmationDate: parseDate(row[16]),
          confirmationPlace: normalizeText(row[17]),
          confirmationMinister: normalizeText(row[18]),
          marriageDate: parseDate(row[19]),
          marriagePartnerName: normalizeText(row[20]),
          marriagePlace: normalizeText(row[21]),
          marriageWitnesses: normalizeText(row[22]),
          marriageMinister: normalizeText(row[23]),
          dateOfDeath: parseDate(row[24]),
          remarks: normalizeText(row[25]),
        };
      })
      .filter((record) => {
        return (
          record.sNo !== null &&
          record.sNo >= 1 &&
          record.sNo <= 8466
        );
      });

    console.log(`Processing ${transformedRows.length} records with S/NO 1..8466 from XLSX`);
    
    // Process records in batches to avoid overwhelming the database
    const batchSize = 100;
    let totalImported = 0;
    
    for (let i = 0; i < transformedRows.length; i += batchSize) {
      const transformedBatch = transformedRows.slice(i, i + batchSize);

      // Insert batch into database
      await prisma.baptismRecord.createMany({
        data: transformedBatch,
        skipDuplicates: true,
      });
      
      totalImported += transformedBatch.length;
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedRows.length / batchSize)} (${totalImported} records total)`);
    }
    
    console.log('Import completed successfully!');
    console.log(`Total records imported: ${totalImported}`);
    
  } catch (error) {
    console.error('Error importing baptism data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importBaptismData()
  .then(() => {
    console.log('Import script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import script failed:', error);
    process.exit(1);
  });

export default importBaptismData;
