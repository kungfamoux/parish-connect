const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function checkEmptyBaptismalRecords() {
  try {
    console.log('Checking baptismal records for empty rows...\n');

    // Get total records count
    const totalRecords = await prisma.baptismRecord.count();
    console.log(`Total records in database: ${totalRecords}\n`);

    // Check for completely empty records (all essential fields are null/empty)
    const completelyEmptyRecords = await prisma.baptismRecord.findMany({
      where: {
        AND: [
          { baptismName: { is: null } },
          { surname: { is: null } },
          { fathersName: { is: null } },
          { mothersName: { is: null } },
          { dateOfBaptism: { is: null } }
        ]
      },
      select: {
        id: true,
        sNo: true,
        baptismName: true,
        surname: true,
        fathersName: true,
        mothersName: true,
        dateOfBaptism: true,
        createdAt: true
      }
    });

    console.log(`Found ${completelyEmptyRecords.length} completely empty records:`);
    completelyEmptyRecords.forEach(record => {
      console.log(`  ID: ${record.id}, S/No: ${record.sNo || 'N/A'}, Created: ${record.createdAt}`);
    });

    // Check for records with missing essential information
    const recordsWithMissingEssentialInfo = await prisma.baptismRecord.findMany({
      where: {
        OR: [
          { baptismName: { is: null } },
          { baptismName: { equals: '' } },
          { surname: { is: null } },
          { surname: { equals: '' } }
        ]
      },
      select: {
        id: true,
        sNo: true,
        baptismName: true,
        surname: true,
        fathersName: true,
        mothersName: true,
        dateOfBaptism: true,
        createdAt: true
      },
      orderBy: { id: 'asc' }
    });

    console.log(`\nFound ${recordsWithMissingEssentialInfo.length} records with missing essential info (name or surname):`);
    recordsWithMissingEssentialInfo.forEach(record => {
      console.log(`  ID: ${record.id}, S/No: ${record.sNo || 'N/A'}, Name: "${record.baptismName || 'N/A'}", Surname: "${record.surname || 'N/A'}"`);
    });

    // Check for records with empty string values
    const recordsWithEmptyStrings = await prisma.baptismRecord.findMany({
      where: {
        OR: [
          { baptismName: { equals: '' } },
          { surname: { equals: '' } },
          { fathersName: { equals: '' } },
          { mothersName: { equals: '' } }
        ]
      },
      select: {
        id: true,
        sNo: true,
        baptismName: true,
        surname: true,
        fathersName: true,
        mothersName: true,
        dateOfBaptism: true,
        createdAt: true
      }
    });

    console.log(`\nFound ${recordsWithEmptyStrings.length} records with empty string values:`);
    recordsWithEmptyStrings.forEach(record => {
      console.log(`  ID: ${record.id}, S/No: ${record.sNo || 'N/A'}, Baptism Name: "${record.baptismName || 'N/A'}", Surname: "${record.surname || 'N/A'}"`);
    });

    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total records: ${totalRecords}`);
    console.log(`Completely empty: ${completelyEmptyRecords.length}`);
    console.log(`Missing essential info: ${recordsWithMissingEssentialInfo.length}`);
    console.log(`Empty strings: ${recordsWithEmptyStrings.length}`);

    if (completelyEmptyRecords.length > 0) {
      console.log('\nIDs of completely empty records to delete:');
      console.log(completelyEmptyRecords.map(r => r.id).join(', '));
    }

  } catch (error) {
    console.error('Error checking baptismal records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmptyBaptismalRecords();
