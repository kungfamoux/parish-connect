import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  adapter: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19MMF1qQmVSX0dpZ3FVcVJOamJGSFAiLCJhcGlfa2V5IjoiMDFLUDRFSkpGSFhLOVczR01OSjhOMTlBR04iLCJ0ZW5hbnRfaWQiOiI4NWIwMDMwNDNkZmU0MGJkOGEwMTA1M2MzNTQzYjY4OTgyMzZjYTFkNjQ0ZGVlYzVlZWRmMzU0NzhmMWMwMjViIiwiaW50ZXJuYWxfc2VjcmV0IjoiZTk0MGRjMTctMGY3Ny00YmRiLWE3NmMtMWI4ZTdiNzI0ZmE2In0.5Jir42H_60iCRCLMeIFBR4to-j0jqYG5IpHSGDDZzJo",
});

async function checkImport() {
  try {
    const count = await prisma.baptismRecord.count();
    console.log(`Total records in database: ${count}`);
    
    if (count > 0) {
      const firstRecord = await prisma.baptismRecord.findFirst({
        where: { sNo: { not: null } }
      });
      const lastRecord = await prisma.baptismRecord.findFirst({
        where: { sNo: { not: null } },
        orderBy: { sNo: 'desc' }
      });
      
      console.log('\nFirst record:');
      console.log(`S_NO: ${firstRecord?.sNo}`);
      console.log(`BAPTISM_NAME: ${firstRecord?.baptismName}`);
      console.log(`SURNAME: ${firstRecord?.surname}`);
      console.log(`DATE_OF_BAPTISM: ${firstRecord?.dateOfBaptism}`);
      
      console.log('\nLast record:');
      console.log(`S_NO: ${lastRecord?.sNo}`);
      console.log(`BAPTISM_NAME: ${lastRecord?.baptismName}`);
      console.log(`SURNAME: ${lastRecord?.surname}`);
      console.log(`DATE_OF_BAPTISM: ${lastRecord?.dateOfBaptism}`);
    }
    
  } catch (error) {
    console.error('Error checking import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImport();
