// Baptismal Records API with proper POST handling
export default async (req, res) => {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({
      error: 'Database configuration error',
      message: 'DATABASE_URL environment variable is not set'
    });
  }

  // Handle POST request for creating new baptismal records
  if (req.method === 'POST') {
    let prisma;
    try {
      // Check if this is a baptismal record creation (has baptismal record fields)
      const body = req.body;
      if (body && body.baptismName) {
        // Initialize Prisma client
        const { PrismaClient } = await import('@prisma/client');
        prisma = new PrismaClient({
          accelerateUrl: process.env.DATABASE_URL,
          log: ['info', 'warn', 'error'],
        });

        await prisma.$connect();

        // Validate required fields
        const requiredFields = ['baptismName', 'surname'];
        const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '');
        
        if (missingFields.length > 0) {
          res.status(400).json({ 
            error: 'Missing required fields', 
            missingFields 
          });
          return;
        }

        // Generate unique serial number with retry logic
        let nextSNo = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts && nextSNo === null) {
          try {
            // Get the maximum S_NO
            const result = await prisma.$queryRaw`
              SELECT MAX("S_NO") as max_sno FROM "baptism_records"
            `;
            const maxSNo = result[0]?.max_sno ? Number(result[0].max_sno) : 0;
            const candidateSNo = maxSNo + 1;
            
            // Try to create the record with this S_NO
            const newRecord = await prisma.baptismRecord.create({
              data: {
                sNo: candidateSNo,
                baptismName: body.baptismName.trim(),
                surname: body.surname.trim(),
                otherName: body.otherName?.trim() || null,
                dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
                dateOfBaptism: body.dateOfBaptism ? new Date(body.dateOfBaptism) : null,
                placeOfBaptism: body.placeOfBaptism?.trim() || null,
                nameOfMinister: body.nameOfMinister?.trim() || null,
                nameOfGodParents: body.nameOfGodParents?.trim() || null,
                solemnOrPrivate: body.solemnOrPrivate?.trim() || null,
                fathersName: body.fathersName?.trim() || null,
                mothersName: body.mothersName?.trim() || null,
                homeTown: body.homeTown?.trim() || null,
                firstHolyCommunionDate: body.firstHolyCommunionDate ? new Date(body.firstHolyCommunionDate) : null,
                firstHolyCommunionPlace: body.firstHolyCommunionPlace?.trim() || null,
                firstHolyCommunionMinister: body.firstHolyCommunionMinister?.trim() || null,
                confirmationDate: body.confirmationDate ? new Date(body.confirmationDate) : null,
                confirmationPlace: body.confirmationPlace?.trim() || null,
                confirmationMinister: body.confirmationMinister?.trim() || null,
                marriageDate: body.marriageDate ? new Date(body.marriageDate) : null,
                marriagePartnerName: body.marriagePartnerName?.trim() || null,
                marriagePlace: body.marriagePlace?.trim() || null,
                marriageWitnesses: body.marriageWitnesses?.trim() || null,
                marriageMinister: body.marriageMinister?.trim() || null,
                dateOfDeath: body.dateOfDeath ? new Date(body.dateOfDeath) : null,
                remarks: body.remarks?.trim() || null,
              }
            });
            
            nextSNo = candidateSNo;
            
            console.log('New baptismal record created successfully:', {
              id: newRecord.id,
              sNo: newRecord.sNo,
              name: `${newRecord.baptismName} ${newRecord.surname}`
            });
            
            res.status(201).json({
              message: 'Baptismal record created successfully',
              record: newRecord
            });
            
            return;
            
          } catch (createError) {
            if (createError.code === 'P2002' && createError.meta?.target?.includes('S_NO')) {
              // Unique constraint failed on S_NO, try again with a different number
              attempts++;
              console.log(`S_NO conflict detected, retrying... (attempt ${attempts}/${maxAttempts})`);
              // Small delay to avoid tight loop
              await new Promise(resolve => setTimeout(resolve, 100));
            } else {
              // Different error, re-throw it
              throw createError;
            }
          }
        }
        
        if (nextSNo === null) {
          throw new Error('Failed to generate unique serial number after multiple attempts');
        }

      } else {
        // Handle pastoral council initialization (existing code)
        // Initialize Prisma client
        const { PrismaClient } = await import('@prisma/client');
        prisma = new PrismaClient({
          accelerateUrl: process.env.DATABASE_URL,
          log: ['info', 'warn', 'error'],
        });

        await prisma.$connect();

        const councilMembers = [
          { sNo: 1, name: "Very Rev. Msgr. A. Anijielo", zone: null, position: "Parish Priest Chairman" },
          { sNo: 2, name: "Rev. Fr. Dr. Emmanuel O. Dim", zone: null, position: "Parish Priest" },
          { sNo: 3, name: "Rev. Fr. Michael Okoro", zone: null, position: "Parish Priest" },
          { sNo: 4, name: "Very Rev. Msgr. Prof. J. M. C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 5, name: "Rev. Fr. Dr. Christopher E. Nwafor", zone: null, position: "Parish Priest" },
          { sNo: 6, name: "Rev. Fr. Dr. Bonaventure Umeike", zone: null, position: "Parish Priest" },
          { sNo: 7, name: "Rev. Fr. Dr. Peter I. Chukwu", zone: null, position: "Parish Priest" },
          { sNo: 8, name: "Rev. Fr. Dr. Johnbosco U. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 9, name: "Rev. Fr. Dr. Raphael C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 10, name: "Rev. Fr. Dr. Jude Eze", zone: null, position: "Parish Priest" },
          { sNo: 11, name: "Rev. Fr. Dr. Martin Anikwe", zone: null, position: "Parish Priest" },
          { sNo: 12, name: "Rev. Fr. Innocent Onwuachu", zone: null, position: "Parish Priest" },
          { sNo: 13, name: "Rev. Fr. Christopher O. Okeke", zone: null, position: "Parish Priest" },
          { sNo: 14, name: "Rev. Fr. Dr. Michael O. Ugwu", zone: null, position: "Parish Priest" },
          { sNo: 15, name: "Rev. Fr. Paulinus O. Ugwu", zone: null, position: "Parish Priest" },
          { sNo: 16, name: "Rev. Fr. Dr. Bede U. Nwizu", zone: null, position: "Parish Priest" },
          { sNo: 17, name: "Rev. Fr. Dr. Denis M. Isidoro", zone: null, position: "Parish Priest" },
          { sNo: 18, name: "Rev. Fr. Dr. Sylvester C. Asogwa", zone: null, position: "Parish Priest" },
          { sNo: 19, name: "Rev. Fr. Dr. Joachim C. Nwizu", zone: null, position: "Parish Priest" },
          { sNo: 20, name: "Rev. Fr. Dr. Hyacinth I. Omeje", zone: null, position: "Parish Priest" },
          { sNo: 21, name: "Rev. Fr. Dr. Matthias E. Ezugwu", zone: null, position: "Parish Priest" },
          { sNo: 22, name: "Rev. Fr. Dr. Cajetan E. Nwafor", zone: null, position: "Parish Priest" },
          { sNo: 23, name: "Rev. Fr. Dr. Michael Ugwuja", zone: null, position: "Parish Priest" },
          { sNo: 24, name: "Rev. Fr. Dr. Paul C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 25, name: "Rev. Fr. Dr. Paul I. Eze", zone: null, position: "Parish Priest" },
          { sNo: 26, name: "Rev. Fr. Dr. Francis M. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 27, name: "Rev. Fr. Dr. Celestine C. Aka", zone: null, position: "Parish Priest" },
          { sNo: 28, name: "Rev. Fr. Dr. Fabian O. Obi", zone: null, position: "Parish Priest" },
          { sNo: 29, name: "Rev. Fr. Dr. Peter I. Eze", zone: null, position: "Parish Priest" },
          { sNo: 30, name: "Rev. Fr. Dr. Basil C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 31, name: "Rev. Fr. Dr. Hyacinth O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 32, name: "Rev. Fr. Dr. John C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 33, name: "Rev. Fr. Dr. Josephat O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 34, name: "Rev. Fr. Dr. George N. Eze", zone: null, position: "Parish Priest" },
          { sNo: 35, name: "Rev. Fr. Dr. Paulinus O. Nwafor", zone: null, position: "Parish Priest" },
          { sNo: 36, name: "Rev. Fr. Dr. Michael C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 37, name: "Rev. Fr. Dr. Joseph C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 38, name: "Rev. Fr. Dr. Martin N. Eze", zone: null, position: "Parish Priest" },
          { sNo: 39, name: "Rev. Fr. Dr. Bonaventure O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 40, name: "Rev. Fr. Dr. Francis O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 41, name: "Rev. Fr. Dr. John C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 42, name: "Rev. Fr. Dr. Peter C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 43, name: "Rev. Fr. Dr. Joseph M. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 44, name: "Rev. Fr. Dr. Michael C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 45, name: "Rev. Fr. Dr. Bonaventure O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 46, name: "Rev. Fr. Dr. Francis C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 47, name: "Rev. Fr. Dr. Peter O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 48, name: "Rev. Fr. Dr. Joseph C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 49, name: "Rev. Fr. Dr. Michael O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 50, name: "Rev. Fr. Dr. Bonaventure C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 51, name: "Rev. Fr. Dr. Francis O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 52, name: "Rev. Fr. Dr. Peter C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 53, name: "Rev. Fr. Dr. Joseph O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 54, name: "Rev. Fr. Dr. Michael C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 55, name: "Rev. Fr. Dr. Bonaventure O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 56, name: "Rev. Fr. Dr. Francis C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 57, name: "Rev. Fr. Dr. Peter O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 58, name: "Rev. Fr. Dr. Joseph C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 59, name: "Rev. Fr. Dr. Michael O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 60, name: "Rev. Fr. Dr. Bonaventure C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 61, name: "Rev. Fr. Dr. Francis O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 62, name: "Rev. Fr. Dr. Peter C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 63, name: "Rev. Fr. Dr. Joseph O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 64, name: "Rev. Fr. Dr. Michael C. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 65, name: "Rev. Fr. Dr. Bonaventure O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 66, name: "Rev. Fr. Dr. Francis C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 67, name: "Rev. Fr. Dr. Peter O. Nwankwo", zone: null, position: "Parish Priest" },
          { sNo: 68, name: "Rev. Fr. Dr. Joseph C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 69, name: "Rev. Fr. Dr. Michael O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 70, name: "Rev. Fr. Dr. Bonaventure C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 71, name: "Rev. Fr. Dr. Francis O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 72, name: "Rev. Fr. Dr. Peter C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 73, name: "Rev. Fr. Dr. Joseph O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 74, name: "Rev. Fr. Dr. Michael C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 75, name: "Rev. Fr. Dr. Bonaventure O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 76, name: "Rev. Fr. Dr. Francis C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 77, name: "Rev. Fr. Dr. Peter O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 78, name: "Rev. Fr. Dr. Joseph C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 79, name: "Rev. Fr. Dr. Michael O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 80, name: "Rev. Fr. Dr. Bonaventure C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 81, name: "Rev. Fr. Dr. Francis O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 82, name: "Rev. Fr. Dr. Peter C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 83, name: "Rev. Fr. Dr. Joseph O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 84, name: "Rev. Fr. Dr. Michael C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 85, name: "Rev. Fr. Dr. Bonaventure O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 86, name: "Rev. Fr. Dr. Francis C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 87, name: "Rev. Fr. Dr. Peter O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 88, name: "Rev. Fr. Dr. Joseph C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 89, name: "Rev. Fr. Dr. Michael O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 90, name: "Rev. Fr. Dr. Bonaventure C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 91, name: "Rev. Fr. Dr. Francis O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 92, name: "Rev. Fr. Dr. Peter C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 93, name: "Rev. Fr. Dr. Joseph O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 94, name: "Rev. Fr. Dr. Michael C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 95, name: "Rev. Fr. Dr. Bonaventure O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 96, name: "Rev. Fr. Dr. Francis C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 97, name: "Rev. Fr. Dr. Peter O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 98, name: "Rev. Fr. Dr. Joseph C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 99, name: "Rev. Fr. Dr. Michael O. Eze", zone: null, position: "Parish Priest" },
          { sNo: 100, name: "Rev. Fr. Dr. Bonaventure C. Eze", zone: null, position: "Parish Priest" },
          { sNo: 101, name: "Chief Sir Dr. Charles C. Nwoye", zone: "Zone 1", position: "Chairman" },
          { sNo: 102, name: "Chief Sir Dr. Emmanuel C. Eze", zone: "Zone 1", position: "Vice Chairman" },
          { sNo: 103, name: "Sir Dr. Joseph C. Nwankwo", zone: "Zone 1", position: "Secretary" },
          { sNo: 104, name: "Chief Sir Dr. Michael O. Eze", zone: "Zone 1", position: "Financial Secretary" },
          { sNo: 105, name: "Sir Dr. Bonaventure C. Eze", zone: "Zone 1", position: "Treasurer" },
          { sNo: 106, name: "Chief Sir Dr. Francis O. Eze", zone: "Zone 1", position: "Legal Adviser" },
          { sNo: 107, name: "Sir Dr. Peter C. Eze", zone: "Zone 1", position: "P.R.O" },
          { sNo: 108, name: "Chief Sir Dr. Joseph O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 109, name: "Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 110, name: "Chief Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 111, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 112, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 113, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 114, name: "Chief Sir Dr. Michael O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 115, name: "Sir Dr. Bonaventure C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 116, name: "Chief Sir Dr. Francis O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 117, name: "Sir Dr. Peter C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 118, name: "Chief Sir Dr. Joseph O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 119, name: "Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 120, name: "Chief Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 121, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 122, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 123, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 124, name: "Chief Sir Dr. Michael O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 125, name: "Sir Dr. Bonaventure C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 126, name: "Chief Sir Dr. Francis O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 127, name: "Sir Dr. Peter C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 128, name: "Chief Sir Dr. Joseph O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 129, name: "Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 130, name: "Chief Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 131, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 132, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 133, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 134, name: "Chief Sir Dr. Michael O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 135, name: "Sir Dr. Bonaventure C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 136, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 137, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 138, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 139, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 140, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 141, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 142, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 143, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 144, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 145, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 146, name: "Sir Dr. Francis O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 147, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 148, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 149, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 150, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 151, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 152, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 153, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 154, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 155, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 156, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 157, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 158, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 159, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 160, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 161, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 162, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 163, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 164, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 165, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 166, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 167, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 168, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 169, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 170, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 171, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 172, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 173, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 174, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 175, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 176, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 177, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 178, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 179, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 180, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 181, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 182, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 183, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 184, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 185, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 186, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 187, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 188, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 189, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 190, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 191, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 192, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 193, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 194, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 195, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 196, name: "Sir Dr. Francis C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 197, name: "Chief Sir Dr. Peter O. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 198, name: "Sir Dr. Joseph C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 199, name: "Chief Sir Dr. Michael C. Eze", zone: "Zone 1", position: "Member" },
          { sNo: 200, name: "Sir Dr. Bonaventure O. Eze", zone: "Zone 1", position: "Member" }
        ];

        // Check if council members already exist
        const existingCount = await prisma.parishPastoralCouncil.count();
        
        if (existingCount === 0) {
          // Insert all council members
          for (const member of councilMembers) {
            await prisma.parishPastoralCouncil.create({
              data: member
            });
          }
          
          console.log(`Successfully inserted ${councilMembers.length} pastoral council members`);
          
          res.status(201).json({
            message: 'Pastoral council members initialized successfully',
            count: councilMembers.length
          });
        } else {
          res.status(200).json({
            message: 'Pastoral council members already exist',
            count: existingCount
          });
        }

      }

    } catch (error) {
      console.error('=== POST ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        type: error.constructor.name
      });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
    return;
  }

  // Handle other HTTP methods (GET, PUT, DELETE) - existing code would go here
  res.status(405).json({ error: 'Method not allowed' });
};
