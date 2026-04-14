import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  accelerateUrl: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19MMF1qQmVSX0dpZ3FVcVJOamJGSFAiLCJhcGlfa2V5IjoiMDFLUDRFSkpGSFhLOVczR01OSjhOMTlBR04iLCJ0ZW5hbnRfaWQiOiI4NWIwMDMwNDNkZmU0MGJkOGEwMTA1M2MzNTQzYjY4OTgyMzZjYTFkNjQ0ZGVlYzVlZWRmMzU0NzhmMWMwMjViIiwiaW50ZXJuYWxfc2VjcmV0IjoiZTk0MGRjMTctMGY3Ny00YmRiLWE3NmMtMWI4ZTdiNzI0ZmE2In0.5Jir42H_60iCRCLMeIFBR4to-j0jqYG5IpHSGDDZzJo",
}).$extends(withAccelerate());

async function verifyImport() {
  try {
    console.log('Verifying baptism records import...');
    
    // Get total count
    const totalCount = await prisma.baptismRecord.count();
    console.log(`\nTotal records in database: ${totalCount}`);
    
    if (totalCount > 0) {
      // Get first record
      const firstRecord = await prisma.baptismRecord.findFirst({
        where: { sNo: { not: null } }
      });
      
      // Get last record
      const lastRecord = await prisma.baptismRecord.findFirst({
        where: { sNo: { not: null } },
        orderBy: { sNo: 'desc' }
      });
      
      console.log('\nFirst record:');
      console.log(`  S_NO: ${firstRecord?.sNo}`);
      console.log(`  BAPTISM_NAME: ${firstRecord?.baptismName}`);
      console.log(`  SURNAME: ${firstRecord?.surname}`);
      console.log(`  DATE_OF_BAPTISM: ${firstRecord?.dateOfBaptism?.toISOString().split('T')[0]}`);
      
      console.log('\nLast record:');
      console.log(`  S_NO: ${lastRecord?.sNo}`);
      console.log(`  BAPTISM_NAME: ${lastRecord?.baptismName}`);
      console.log(`  SURNAME: ${lastRecord?.surname}`);
      console.log(`  DATE_OF_BAPTISM: ${lastRecord?.dateOfBaptism?.toISOString().split('T')[0]}`);
      
      // Check for null values in key fields
      const nullBaptismNames = await prisma.baptismRecord.count({
        where: { baptismName: null }
      });
      const nullSurnames = await prisma.baptismRecord.count({
        where: { surname: null }
      });
      
      console.log('\nData quality check:');
      console.log(`  Records with null baptism names: ${nullBaptismNames}`);
      console.log(`  Records with null surnames: ${nullSurnames}`);
    }
    
  } catch (error) {
    console.error('Error verifying import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyImport();
