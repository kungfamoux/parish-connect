import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  accelerateUrl: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19MMF9qQmVSX0dpZ3FVcVJOamJGSFAiLCJhcGlfa2V5IjoiMDFLUDRFSkpGSFhLOVczR01OSjhOMTlBR04iLCJ0ZW5hbnRfaWQiOiI4NWIwMDMwNDNkZmU0MGJkOGEwMTA1M2MzNTQzYjY4OTgyMzZjYTFkNjQ0ZGVlYzVlZWRmMzU0NzhmMWMwMjViIiwiaW50ZXJuYWxfc2VjcmV0IjoiZTk0MGRjMTctMGY3Ny00YmRiLWE3NmMtMWI4ZTdiNzI0ZmE2In0.5Jir42H_60iCRCLMeIFBR4to-j0jqYG5IpHSGDDZzJo",
}).$extends(withAccelerate());

async function importBaptismData() {
  try {
    console.log('Starting baptism data import...');
    
    // Read the JSON file
    const filePath = path.join(__dirname, '../BAPTISM REGISTER OF ST MARY PARISH TRANS EKULU ENUGU_fixed.json');
    console.log(`Reading file from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log(`File size: ${fileContent.length} characters`);
    
    const data = JSON.parse(fileContent);
    console.log('JSON parsed successfully');
    
    console.log(`Found ${data.metadata.total_records} records to import`);
    
    const baptismRecords = data.sheets['BAPTISM REGISTER'];
    console.log(`Total records in JSON: ${baptismRecords.length}`);
    
    // Skip the first record (template row with null values)
    const validRecords = baptismRecords.filter((record: any, index: number) => 
      index === 0 || record.serial_number !== null
    );
    
    console.log(`Processing ${validRecords.length} valid records`);
    
    // Process records in batches to avoid overwhelming the database
    const batchSize = 100;
    let totalImported = 0;
    
    for (let i = 0; i < validRecords.length; i += batchSize) {
      const batch = validRecords.slice(i, i + batchSize);
      
      const transformedBatch = batch.map((record: any) => {
      // Helper function to parse various date formats
      const parseDate = (dateStr: string | null): Date | null => {
        if (!dateStr || dateStr === "null" || dateStr === "") return null;
        
        try {
          let date: Date;
          
          // Handle ISO format (YYYY-MM-DDTHH:mm:ss)
          if (dateStr.includes('T')) {
            date = new Date(dateStr);
          }
          // Handle DD/MM/YYYY format
          else if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              const [day, month, year] = parts;
              date = new Date(`${year}-${month}-${day}`);
            } else {
              return null;
            }
          }
          // Handle YYYY-MM-DD format
          else if (dateStr.includes('-') && !dateStr.includes('T')) {
            date = new Date(dateStr);
          }
          else {
            // Fallback
            date = new Date(dateStr);
          }
          
          // Check if the date is valid
          if (isNaN(date.getTime())) {
            console.warn(`Invalid date detected: ${dateStr}`);
            return null;
          }
          
          return date;
        } catch (error) {
          console.warn(`Failed to parse date: ${dateStr}`, error);
          return null;
        }
      };

      return {
        sNo: record.serial_number ? parseInt(record.serial_number.toString()) : null,
        dateOfBaptism: parseDate(record.date_of_baptism),
        baptismName: record.baptism_name?.toString() || null,
        otherName: record.other_names?.toString() || null,
        surname: record.surname?.toString() || null,
        dateOfBirth: parseDate(record.date_of_birth),
        placeOfBaptism: record.place_of_baptism?.toString() || null,
        homeTown: record.home_town?.toString() || null,
        fathersName: record.fathers_name?.toString() || null,
        mothersName: record.mothers_name?.toString() || null,
        solemnOrPrivate: record.solemn_or_private?.toString() || null,
        nameOfGodParents: record.name_of_god_parents?.toString() || null,
        nameOfMinister: record.name_of_minister?.toString() || null,
        firstHolyCommunionDate: parseDate(record.first_holy_communion_date),
        firstHolyCommunionPlace: record.first_holy_communion_place?.toString() || null,
        firstHolyCommunionMinister: record.first_holy_communion_minister?.toString() || null,
        confirmationDate: parseDate(record.confirmation_date),
        confirmationPlace: record.confirmation_place?.toString() || null,
        confirmationMinister: record.confirmation_minister?.toString() || null,
        marriageDate: parseDate(record.marriage_date),
        marriagePartnerName: record.marriage_partner_name?.toString() || null,
        marriagePlace: record.marriage_place?.toString() || null,
        marriageWitnesses: record.marriage_witnesses?.toString() || null,
        marriageMinister: record.marriage_minister?.toString() || null,
        dateOfDeath: parseDate(record.date_of_death),
        remarks: record.remarks?.toString() || null,
      };
    });
      
      // Insert batch into database
      await prisma.baptismRecord.createMany({
        data: transformedBatch,
        skipDuplicates: true,
      });
      
      totalImported += transformedBatch.length;
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(validRecords.length / batchSize)} (${totalImported} records total)`);
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
