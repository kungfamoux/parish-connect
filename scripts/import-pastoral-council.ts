import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
  log: ['info', 'warn', 'error'],
});

async function importPastoralCouncilMembers() {
  try {
    console.log('Starting pastoral council members import...');

    const councilMembers = [
      {
        sNo: 1,
        name: "Very Rev. Msgr. A. Anijielo",
        zone: null,
        position: "Parish Priest Chairman"
      },
      {
        sNo: 2,
        name: "Rev. Fr. Chinoso Odoh",
        zone: null,
        position: "Vicar Member"
      },
      {
        sNo: 3,
        name: "Dr Ifendu Ohabuike",
        zone: null,
        position: "DDL Member"
      },
      {
        sNo: 4,
        name: "Mr Paul Agu",
        zone: "Zone 12",
        position: "1st Vice Chairman"
      },
      {
        sNo: 5,
        name: "Chief (Sir) O.O. Apiakason",
        zone: "Zone 1",
        position: "2nd Vice Chairman"
      },
      {
        sNo: 6,
        name: "Dr Ifeanyi Ugwu",
        zone: "Zone 8",
        position: "Secretary"
      },
      {
        sNo: 7,
        name: "Mrs Rose Ozodiegwu",
        zone: "Zone 7",
        position: "Asst. Secretary"
      },
      {
        sNo: 8,
        name: "Chief Mrs. J. I. Obi",
        zone: "Zone 11",
        position: "Fin. Secretary"
      },
      {
        sNo: 9,
        name: "Amb. Paulinus Eze",
        zone: "Zone 3",
        position: "Treasurer"
      },
      {
        sNo: 10,
        name: "Mr Emmanuel Chime",
        zone: "Zone 13",
        position: "P.R.O"
      }
    ];

    console.log(`Importing ${councilMembers.length} pastoral council members...`);

    // Clear existing data first
    await prisma.parishPastoralCouncil.deleteMany();
    console.log('Cleared existing pastoral council data');

    // Insert new data
    const result = await prisma.parishPastoralCouncil.createMany({
      data: councilMembers,
      skipDuplicates: true,
    });

    console.log(`Successfully imported ${result.count} pastoral council members`);

    // Verify the import
    const totalMembers = await prisma.parishPastoralCouncil.count();
    console.log(`Total members in database: ${totalMembers}`);

    // Display imported members
    const importedMembers = await prisma.parishPastoralCouncil.findMany({
      orderBy: { sNo: 'asc' }
    });

    console.log('\nImported Members:');
    importedMembers.forEach(member => {
      console.log(`${member.sNo}. ${member.name} - ${member.zone || 'N/A'} - ${member.position}`);
    });

  } catch (error) {
    console.error('Error importing pastoral council members:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importPastoralCouncilMembers()
  .then(() => {
    console.log('Pastoral council import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Pastoral council import failed:', error);
    process.exit(1);
  });

export default importPastoralCouncilMembers;
