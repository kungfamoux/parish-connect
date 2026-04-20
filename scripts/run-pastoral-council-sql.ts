import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
  log: ['info', 'warn', 'error'],
});

async function insertPastoralCouncilMembers() {
  try {
    console.log('Starting pastoral council members insertion via raw SQL...');

    // Check if table exists and is empty
    const existingCount = await prisma.parishPastoralCouncil.count();
    console.log(`Existing members count: ${existingCount}`);

    if (existingCount > 0) {
      console.log('Pastoral council members already exist. Skipping insertion.');
      return;
    }

    // Insert members using raw SQL
    const sqlQuery = `
      INSERT INTO "parish_pastoral_council" ("S_NO", "NAME", "ZONE", "POSITION", "IS_ACTIVE", "CREATED_AT", "UPDATED_AT") VALUES
      (1, 'Very Rev. Msgr. A. Anijielo', NULL, 'Parish Priest Chairman', true, NOW(), NOW()),
      (2, 'Rev. Fr. Chinoso Odoh', NULL, 'Vicar Member', true, NOW(), NOW()),
      (3, 'Dr Ifendu Ohabuike', NULL, 'DDL Member', true, NOW(), NOW()),
      (4, 'Mr Paul Agu', 'Zone 12', '1st Vice Chairman', true, NOW(), NOW()),
      (5, 'Chief (Sir) O.O. Apiakason', 'Zone 1', '2nd Vice Chairman', true, NOW(), NOW()),
      (6, 'Dr Ifeanyi Ugwu', 'Zone 8', 'Secretary', true, NOW(), NOW()),
      (7, 'Mrs Rose Ozodiegwu', 'Zone 7', 'Asst. Secretary', true, NOW(), NOW()),
      (8, 'Chief Mrs. J. I. Obi', 'Zone 11', 'Fin. Secretary', true, NOW(), NOW()),
      (9, 'Amb. Paulinus Eze', 'Zone 3', 'Treasurer', true, NOW(), NOW()),
      (10, 'Mr Emmanuel Chime', 'Zone 13', 'P.R.O', true, NOW(), NOW())
      ON CONFLICT ("S_NO") DO NOTHING;
    `;

    // Execute raw SQL
    const result = await prisma.$executeRaw`INSERT INTO "parish_pastoral_council" ("S_NO", "NAME", "ZONE", "POSITION", "IS_ACTIVE", "CREATED_AT", "UPDATED_AT") VALUES
      (1, 'Very Rev. Msgr. A. Anijielo', NULL, 'Parish Priest Chairman', true, NOW(), NOW()),
      (2, 'Rev. Fr. Chinoso Odoh', NULL, 'Vicar Member', true, NOW(), NOW()),
      (3, 'Dr Ifendu Ohabuike', NULL, 'DDL Member', true, NOW(), NOW()),
      (4, 'Mr Paul Agu', 'Zone 12', '1st Vice Chairman', true, NOW(), NOW()),
      (5, 'Chief (Sir) O.O. Apiakason', 'Zone 1', '2nd Vice Chairman', true, NOW(), NOW()),
      (6, 'Dr Ifeanyi Ugwu', 'Zone 8', 'Secretary', true, NOW(), NOW()),
      (7, 'Mrs Rose Ozodiegwu', 'Zone 7', 'Asst. Secretary', true, NOW(), NOW()),
      (8, 'Chief Mrs. J. I. Obi', 'Zone 11', 'Fin. Secretary', true, NOW(), NOW()),
      (9, 'Amb. Paulinus Eze', 'Zone 3', 'Treasurer', true, NOW(), NOW()),
      (10, 'Mr Emmanuel Chime', 'Zone 13', 'P.R.O', true, NOW(), NOW())
      ON CONFLICT ("S_NO") DO NOTHING`;

    console.log(`Inserted ${result} pastoral council members`);

    // Verify the insertion
    const totalCount = await prisma.parishPastoralCouncil.count();
    console.log(`Total members in database: ${totalCount}`);

    // Display inserted members
    const members = await prisma.parishPastoralCouncil.findMany({
      orderBy: { sNo: 'asc' }
    });

    console.log('\nInserted Members:');
    members.forEach(member => {
      console.log(`${member.sNo}. ${member.name} - ${member.zone || 'N/A'} - ${member.position}`);
    });

  } catch (error) {
    console.error('Error inserting pastoral council members:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

insertPastoralCouncilMembers()
  .then(() => {
    console.log('Pastoral council SQL insertion completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Pastoral council SQL insertion failed:', error);
    process.exit(1);
  });

export default insertPastoralCouncilMembers;
