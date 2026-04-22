// API with real database connection - Prisma client generation fix
export default async (req, res) => {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
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

        // Get next serial number
        const lastRecord = await prisma.baptismRecord.findFirst({
          orderBy: { sNo: 'desc' }
        });
        
        const nextSNo = lastRecord ? lastRecord.sNo + 1 : 1;

        // Create new baptismal record
        const newRecord = await prisma.baptismRecord.create({
          data: {
            sNo: nextSNo,
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
            confirmationDate: body.confirmationDate ? new Date(body.confirmationDate) : null,
            confirmationPlace: body.confirmationPlace?.trim() || null,
            marriageDate: body.marriageDate ? new Date(body.marriageDate) : null,
            marriagePartnerName: body.marriagePartnerName?.trim() || null,
            marriagePlace: body.marriagePlace?.trim() || null,
            dateOfDeath: body.dateOfDeath ? new Date(body.dateOfDeath) : null,
            remarks: body.remarks?.trim() || null,
          }
        });

        console.log('Created new baptismal record:', newRecord.id);

        res.status(201).json({
          message: 'Baptismal record created successfully',
          record: newRecord
        });

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
          { sNo: 2, name: "Rev. Fr. Chinoso Odoh", zone: null, position: "Vicar Member" },
          { sNo: 3, name: "Dr Ifendu Ohabuike", zone: null, position: "DDL Member" },
          { sNo: 4, name: "Mr Paul Agu", zone: "Zone 12", position: "1st Vice Chairman" },
          { sNo: 5, name: "Chief (Sir) O.O. Apiakason", zone: "Zone 1", position: "2nd Vice Chairman" },
          { sNo: 6, name: "Dr Ifeanyi Ugwu", zone: "Zone 8", position: "Secretary" },
          { sNo: 7, name: "Mrs Rose Ozodiegwu", zone: "Zone 7", position: "Asst. Secretary" },
          { sNo: 8, name: "Chief Mrs. J. I. Obi", zone: "Zone 11", position: "Fin. Secretary" },
          { sNo: 9, name: "Amb. Paulinus Eze", zone: "Zone 3", position: "Treasurer" },
          { sNo: 10, name: "Mr Emmanuel Chime", zone: "Zone 13", position: "P.R.O" }
        ];

        const result = await prisma.parishPastoralCouncil.createMany({
          data: councilMembers,
          skipDuplicates: true,
        });

        console.log('Inserted pastoral council members:', result.count);

        res.status(201).json({
          message: 'Pastoral council members initialized successfully',
          inserted: result.count
        });
      }

    } catch (error) {
      console.error('POST request error:', error);
      res.status(500).json({ 
        error: 'Failed to process POST request',
        message: error.message
      });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
    return;
  }

  // Handle DELETE request for deleting baptismal records
  if (req.method === 'DELETE') {
    let prisma;
    try {
      // Initialize Prisma client
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prisma.$connect();

      const { id, deleteEmpty } = req.query;

      // Delete specific record by ID
      if (id) {
        const recordId = parseInt(id);
        if (isNaN(recordId)) {
          res.status(400).json({ error: 'Invalid record ID' });
          return;
        }

        // Check if record exists
        const existingRecord = await prisma.baptismRecord.findUnique({
          where: { id: recordId }
        });

        if (!existingRecord) {
          res.status(404).json({ error: 'Record not found' });
          return;
        }

        const deletedRecord = await prisma.baptismRecord.delete({
          where: { id: recordId }
        });

        console.log('Deleted baptismal record:', deletedRecord.id);

        res.status(200).json({
          message: 'Record deleted successfully',
          deletedRecord: {
            id: deletedRecord.id,
            sNo: deletedRecord.sNo,
            baptismName: deletedRecord.baptismName
          }
        });

      } 
      // Delete all empty records
      else if (deleteEmpty === 'true') {
        // Find records with all essential fields empty or null
        const emptyRecords = await prisma.baptismRecord.findMany({
          where: {
            OR: [
              { baptismName: { equals: '' } },
              { baptismName: null },
              { surname: { equals: '' } },
              { surname: null },
            ]
          }
        });

        if (emptyRecords.length === 0) {
          res.status(200).json({
            message: 'No empty records found',
            deletedCount: 0
          });
          return;
        }

        // Delete all empty records
        const deleteResult = await prisma.baptismRecord.deleteMany({
          where: {
            OR: [
              { baptismName: { equals: '' } },
              { baptismName: null },
              { surname: { equals: '' } },
              { surname: null },
            ]
          }
        });

        console.log('Deleted empty baptismal records:', deleteResult.count);

        res.status(200).json({
          message: `Deleted ${deleteResult.count} empty records successfully`,
          deletedCount: deleteResult.count,
          deletedRecords: emptyRecords.map(record => ({
            id: record.id,
            sNo: record.sNo,
            baptismName: record.baptismName,
            surname: record.surname
          }))
        });
      } else {
        res.status(400).json({ 
          error: 'Invalid request. Provide either "id" to delete specific record or "deleteEmpty=true" to delete empty records' 
        });
      }

    } catch (error) {
      console.error('Delete baptismal records error:', error);
      res.status(500).json({ 
        error: 'Failed to delete baptismal records',
        message: error.message
      });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
    return;
  }

  // Handle PUT request for updating baptismal records
  if (req.method === 'PUT') {
    let prisma;
    try {
      // Initialize Prisma client
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prisma.$connect();

      const { id } = req.query;
      const body = req.body;

      if (!id) {
        res.status(400).json({ error: 'Record ID is required' });
        return;
      }

      const recordId = parseInt(id);
      if (isNaN(recordId)) {
        res.status(400).json({ error: 'Invalid record ID' });
        return;
      }

      // Check if record exists
      const existingRecord = await prisma.baptismRecord.findUnique({
        where: { id: recordId }
      });

      if (!existingRecord) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

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

      // Update the record
      const updatedRecord = await prisma.baptismRecord.update({
        where: { id: recordId },
        data: {
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
          confirmationDate: body.confirmationDate ? new Date(body.confirmationDate) : null,
          confirmationPlace: body.confirmationPlace?.trim() || null,
          marriageDate: body.marriageDate ? new Date(body.marriageDate) : null,
          marriagePartnerName: body.marriagePartnerName?.trim() || null,
          marriagePlace: body.marriagePlace?.trim() || null,
          dateOfDeath: body.dateOfDeath ? new Date(body.dateOfDeath) : null,
          remarks: body.remarks?.trim() || null,
        }
      });

      console.log('Updated baptismal record:', updatedRecord.id);

      res.status(200).json({
        message: 'Baptismal record updated successfully',
        record: updatedRecord
      });

    } catch (error) {
      console.error('Update baptismal records error:', error);
      res.status(500).json({ 
        error: 'Failed to update baptismal records',
        message: error.message
      });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
    return;
  }

  try {
    console.log('=== API Request ===');
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'Database configuration error',
        message: 'DATABASE_URL environment variable is not set in Vercel'
      });
    }

    // Generate Prisma client on-demand
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      accelerateUrl: process.env.DATABASE_URL,
      log: ['info', 'warn', 'error'],
    });
    
    const { page = 1, limit = 20, search = '' } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const skip = (parsedPage - 1) * parsedLimit;

    console.log('Parsed params:', { page: parsedPage, limit: parsedLimit, search });

    // Build search conditions
    let where = {};
    if (search && search.trim()) {
      const searchTerm = search.trim();
      
      // Only search if term is reasonable (not too short or just special characters)
      if (searchTerm.length >= 2 && /^[a-zA-Z0-9\s\-']+$/.test(searchTerm)) {
        
        // Split search term into words for better full name matching
        const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
        console.log('Search words:', searchWords);
        
        // Create search conditions
        let searchConditions = [];
        
        // Always include the original full term search (for backward compatibility)
        searchConditions.push(
          { baptismName: { contains: searchTerm, mode: 'insensitive' } },
          { surname: { contains: searchTerm, mode: 'insensitive' } },
          { otherName: { contains: searchTerm, mode: 'insensitive' } },
          { fathersName: { contains: searchTerm, mode: 'insensitive' } },
          { mothersName: { contains: searchTerm, mode: 'insensitive' } }
        );
        
        // For full names (multiple words), create more sophisticated search
        if (searchWords.length > 1) {
          // Create combinations for full name search
          // e.g., "GEORGENA NGOZICHUKWUKA ONU" should match:
          // - baptismName="GEORGENA" AND surname="ONU" (if otherName contains middle name)
          // - baptismName="GEORGENA" AND surname contains "ONU"
          // - baptismName contains "GEORGENA" AND surname="ONU"
          
          // Try different combinations of name fields
          for (let i = 0; i < searchWords.length; i++) {
            for (let j = i + 1; j < searchWords.length; j++) {
              const firstWord = searchWords[i];
              const secondWord = searchWords[j];
              
              // Check baptismName + surname combinations
              searchConditions.push({
                AND: [
                  { baptismName: { contains: firstWord, mode: 'insensitive' } },
                  { surname: { contains: secondWord, mode: 'insensitive' } }
                ]
              });
              
              // Check baptismName + otherName combinations
              searchConditions.push({
                AND: [
                  { baptismName: { contains: firstWord, mode: 'insensitive' } },
                  { otherName: { contains: secondWord, mode: 'insensitive' } }
                ]
              });
              
              // Check otherName + surname combinations
              searchConditions.push({
                AND: [
                  { otherName: { contains: firstWord, mode: 'insensitive' } },
                  { surname: { contains: secondWord, mode: 'insensitive' } }
                ]
              });
            }
          }
          
          // For three-word names, try first + last combinations
          if (searchWords.length >= 3) {
            const firstName = searchWords[0];
            const lastName = searchWords[searchWords.length - 1];
            
            searchConditions.push({
              AND: [
                { baptismName: { contains: firstName, mode: 'insensitive' } },
                { surname: { contains: lastName, mode: 'insensitive' } }
              ]
            });
            
            // Also try with otherName containing middle name
            searchConditions.push({
              AND: [
                { baptismName: { contains: firstName, mode: 'insensitive' } },
                { otherName: { contains: searchWords[1], mode: 'insensitive' } },
                { surname: { contains: lastName, mode: 'insensitive' } }
              ]
            });
          }
        }
        
        // Add individual word searches for flexibility
        searchWords.forEach(word => {
          if (word.length >= 2) {
            searchConditions.push(
              { baptismName: { contains: word, mode: 'insensitive' } },
              { surname: { contains: word, mode: 'insensitive' } },
              { otherName: { contains: word, mode: 'insensitive' } }
            );
          }
        });
        
        // Try to add serial number search if it's a pure number
        if (/^\d+$/.test(searchTerm)) {
          searchConditions.push({ sNo: parseInt(searchTerm) });
        }
        
        where = { OR: searchConditions };
        
        console.log('Enhanced search where clause with', searchConditions.length, 'conditions');
      } else {
        console.log('Search term too short or contains invalid characters:', searchTerm);
      }
    }

    // Test database connection first
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    // Get total count
    console.log('Executing count query...');
    const total = await prisma.baptismRecord.count({ where });
    console.log('Count result:', total);

    // Get records with pagination
    console.log('Executing findMany query...');
    const records = await prisma.baptismRecord.findMany({
      where,
      skip,
      take: parsedLimit,
      orderBy: { sNo: 'asc' },
    });
    console.log('Records found:', records.length);

    const response = {
      records,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };

    console.log('Sending response:', JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.constructor.name,
      details: 'Prisma client generation issue - may need to run prisma generate in build process'
    });
  } finally {
    // Note: prisma cleanup handled by garbage collection in serverless
  }
};
