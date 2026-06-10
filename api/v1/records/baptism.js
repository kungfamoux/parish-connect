// Baptismal Records API with proper middleware
import { corsMiddleware } from '../../middleware/cors.js';
import { withDatabase } from '../../middleware/database.js';
import { errorHandler } from '../../middleware/errorHandler.js';
import { validateRequired } from '../../utils/validation.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.js';

const handler = async (req, res) => {
  const { prisma } = req;

  // Handle POST request for creating new baptismal records
  if (req.method === 'POST') {
    try {
      const body = req.body;

      // Validate required fields
      const validation = validateRequired(body, ['baptismName', 'surname']);
      if (!validation.isValid) {
        return res.status(400).json(errorResponse(validation.message, 400, validation.missingFields));
      }

      // Handle S_NO - either manual or auto-generated
      let finalSNo = null;

      if (body.sNo && body.sNo.trim() !== '') {
        // Manual S_NO provided by admin
        finalSNo = parseInt(body.sNo.trim());

        if (isNaN(finalSNo) || finalSNo <= 0) {
          return res.status(400).json({
            error: 'Invalid S_NO. Must be a positive number.'
          });
        }

        // Check if this S_NO already exists
        const existingRecord = await prisma.baptismRecord.findUnique({
          where: { sNo: finalSNo },
          select: { id: true }
        });

        if (existingRecord) {
          return res.status(400).json({
            error: `S_NO ${finalSNo} already exists. Please choose a different number or use auto-generation.`
          });
        }

        console.log(`Using manually provided S_NO: ${finalSNo}`);
      } else {
        // Auto-generate S_NO using sequence approach
        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts && !finalSNo) {
          try {
            const result = await prisma.$transaction(async (tx) => {
              const existingRecords = await tx.baptismRecord.findMany({
                select: { sNo: true },
                orderBy: { sNo: 'asc' }
              });

              const existingSNos = existingRecords.map(r => r.sNo).filter(sNo => sNo != null);
              let nextSNo = 1;

              if (existingSNos.length > 0) {
                existingSNos.sort((a, b) => a - b);

                for (let i = 0; i < existingSNos.length; i++) {
                  const expectedSNo = i + 1;
                  if (existingSNos[i] !== expectedSNo) {
                    nextSNo = expectedSNo;
                    console.log(`Found gap in sequence: expected ${expectedSNo}, found ${existingSNos[i]}, using ${nextSNo}`);
                    break;
                  }
                }

                if (nextSNo === 1) {
                  nextSNo = existingSNos[existingSNos.length - 1] + 1;
                  console.log(`No gaps found, using next number after highest: ${nextSNo}`);
                }
              }

              const existingCheck = await tx.baptismRecord.findUnique({
                where: { sNo: nextSNo },
                select: { id: true }
              });

              if (existingCheck) {
                console.log(`S_NO ${nextSNo} already taken, scanning for next available`);
                let candidateSNo = nextSNo + 1;
                while (candidateSNo <= nextSNo + 100) {
                  const checkAgain = await tx.baptismRecord.findUnique({
                    where: { sNo: candidateSNo },
                    select: { id: true }
                  });
                  if (!checkAgain) {
                    nextSNo = candidateSNo;
                    console.log(`Found available S_NO: ${nextSNo}`);
                    break;
                  }
                  candidateSNo++;
                }

                if (candidateSNo > nextSNo + 100) {
                  throw new Error('Could not find available S_NO after checking 100 consecutive numbers');
                }
              }

              console.log(`Attempting to create record with auto-generated S_NO: ${nextSNo}`);
              return nextSNo;
            });

            finalSNo = result;

          } catch (createError) {
            attempts++;
            console.log(`Auto-generation attempt ${attempts}/${maxAttempts} failed:`, createError.code || createError.message);

            if (createError.code !== 'P2002' || attempts >= maxAttempts) {
              throw createError;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (!finalSNo) {
          throw new Error(`Failed to auto-generate S_NO after ${maxAttempts} attempts`);
        }
      }

      // Create the baptismal record
      const newRecord = await prisma.baptismRecord.create({
        data: {
          sNo: finalSNo,
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

      console.log('New baptismal record created successfully:', {
        id: newRecord.id,
        sNo: newRecord.sNo,
        name: `${newRecord.baptismName} ${newRecord.surname}`,
        sNoType: body.sNo ? 'manual' : 'auto-generated'
      });

      res.status(201).json({
        message: 'Baptismal record created successfully',
        record: newRecord
      });

    } catch (error) {
      console.error('=== POST ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);

      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        type: error.constructor.name
      });
    }
    return;
  }

  // Handle GET request for fetching baptismal records
  if (req.method === 'GET') {
    let prismaLocal;
    try {
      const { PrismaClient } = await import('@prisma/client');

      prismaLocal = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prismaLocal.$connect();

      const { page = 1, limit = 20, search = '' } = req.query;
      const currentPage = parseInt(page);
      const recordsPerPage = parseInt(limit);
      const offset = (currentPage - 1) * recordsPerPage;

      console.log('=== GET Baptismal Records Request ===');
      console.log('Page:', currentPage, 'Limit:', recordsPerPage, 'Search:', search);

      let whereConditions = {};

      if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0);

        if (searchTerms.length >= 2) {
          const exactMatchConditions = {
            AND: [
              { baptismName: { contains: searchTerms[0], mode: 'insensitive' } },
              { surname: { contains: searchTerms[searchTerms.length - 1], mode: 'insensitive' } }
            ]
          };

          const exactMatch = await prismaLocal.baptismRecord.findMany({
            where: exactMatchConditions,
            take: 1
          });

          whereConditions = exactMatch.length > 0
            ? exactMatchConditions
            : {
                AND: searchTerms.map(term => ({
                  OR: [
                    { baptismName: { contains: term, mode: 'insensitive' } },
                    { otherName: { contains: term, mode: 'insensitive' } },
                    { surname: { contains: term, mode: 'insensitive' } }
                  ]
                }))
              };
        } else {
          whereConditions = {
            AND: [
              { baptismName: { not: null } },
              {
                OR: [
                  { baptismName: { contains: searchTerm, mode: 'insensitive' } },
                  { otherName: { contains: searchTerm, mode: 'insensitive' } },
                  { surname: { contains: searchTerm, mode: 'insensitive' } },
                  { fathersName: { contains: searchTerm, mode: 'insensitive' } },
                  { mothersName: { contains: searchTerm, mode: 'insensitive' } },
                  ...(!isNaN(searchTerm) ? [{ sNo: parseInt(searchTerm) }] : [])
                ]
              }
            ]
          };
        }
      }

      const totalRecords = await prismaLocal.baptismRecord.count({ where: whereConditions });

      const records = await prismaLocal.baptismRecord.findMany({
        where: whereConditions,
        orderBy: [{ sNo: 'asc' }],
        skip: offset,
        take: recordsPerPage
      });

      const safeRecords = (records || []).map(record => ({
        ...record,
        dateOfBirth: record.dateOfBirth ? record.dateOfBirth.toISOString().split('T')[0] : null,
        dateOfBaptism: record.dateOfBaptism ? record.dateOfBaptism.toISOString().split('T')[0] : null,
        firstHolyCommunionDate: record.firstHolyCommunionDate ? record.firstHolyCommunionDate.toISOString().split('T')[0] : null,
        confirmationDate: record.confirmationDate ? record.confirmationDate.toISOString().split('T')[0] : null,
        marriageDate: record.marriageDate ? record.marriageDate.toISOString().split('T')[0] : null,
        dateOfDeath: record.dateOfDeath ? record.dateOfDeath.toISOString().split('T')[0] : null,
        baptismName: record.baptismName || '',
        surname: record.surname || '',
        otherName: record.otherName || '',
        placeOfBaptism: record.placeOfBaptism || '',
        nameOfMinister: record.nameOfMinister || '',
        nameOfGodParents: record.nameOfGodParents || '',
        solemnOrPrivate: record.solemnOrPrivate || '',
        fathersName: record.fathersName || '',
        mothersName: record.mothersName || '',
        homeTown: record.homeTown || '',
        firstHolyCommunionPlace: record.firstHolyCommunionPlace || '',
        firstHolyCommunionMinister: record.firstHolyCommunionMinister || '',
        confirmationPlace: record.confirmationPlace || '',
        confirmationMinister: record.confirmationMinister || '',
        marriagePartnerName: record.marriagePartnerName || '',
        marriagePlace: record.marriagePlace || '',
        marriageWitnesses: record.marriageWitnesses || '',
        marriageMinister: record.marriageMinister || '',
        remarks: record.remarks || ''
      }));

      console.log(`Found ${safeRecords.length} records out of ${totalRecords} total`);

      res.status(200).json({
        records: safeRecords,
        total: totalRecords,
        currentPage,
        totalPages: Math.ceil(totalRecords / recordsPerPage),
        hasNextPage: currentPage < Math.ceil(totalRecords / recordsPerPage),
        hasPrevPage: currentPage > 1
      });

    } catch (error) {
      console.error('=== GET ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);

      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        type: error.constructor.name
      });
    } finally {
      if (prismaLocal) await prismaLocal.$disconnect();
    }
    return;
  }

  // Handle PUT request for updating baptismal records
  if (req.method === 'PUT') {
    let prismaLocal;
    try {
      const { id } = req.query;
      const body = req.body;

      if (!id || !body) {
        return res.status(400).json({ error: 'Missing record ID or update data' });
      }

      const { PrismaClient } = await import('@prisma/client');
      prismaLocal = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prismaLocal.$connect();

      const existingRecord = await prismaLocal.baptismRecord.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRecord) {
        return res.status(404).json({ error: 'Baptismal record not found' });
      }

      const updatedRecord = await prismaLocal.baptismRecord.update({
        where: { id: parseInt(id) },
        data: {
          baptismName: body.baptismName?.trim() || existingRecord.baptismName,
          surname: body.surname?.trim() || existingRecord.surname,
          otherName: body.otherName?.trim() || existingRecord.otherName,
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : existingRecord.dateOfBirth,
          dateOfBaptism: body.dateOfBaptism ? new Date(body.dateOfBaptism) : existingRecord.dateOfBaptism,
          placeOfBaptism: body.placeOfBaptism?.trim() || existingRecord.placeOfBaptism,
          nameOfMinister: body.nameOfMinister?.trim() || existingRecord.nameOfMinister,
          nameOfGodParents: body.nameOfGodParents?.trim() || existingRecord.nameOfGodParents,
          solemnOrPrivate: body.solemnOrPrivate?.trim() || existingRecord.solemnOrPrivate,
          fathersName: body.fathersName?.trim() || existingRecord.fathersName,
          mothersName: body.mothersName?.trim() || existingRecord.mothersName,
          homeTown: body.homeTown?.trim() || existingRecord.homeTown,
          firstHolyCommunionDate: body.firstHolyCommunionDate ? new Date(body.firstHolyCommunionDate) : existingRecord.firstHolyCommunionDate,
          firstHolyCommunionPlace: body.firstHolyCommunionPlace?.trim() || existingRecord.firstHolyCommunionPlace,
          firstHolyCommunionMinister: body.firstHolyCommunionMinister?.trim() || existingRecord.firstHolyCommunionMinister,
          confirmationDate: body.confirmationDate ? new Date(body.confirmationDate) : existingRecord.confirmationDate,
          confirmationPlace: body.confirmationPlace?.trim() || existingRecord.confirmationPlace,
          confirmationMinister: body.confirmationMinister?.trim() || existingRecord.confirmationMinister,
          marriageDate: body.marriageDate ? new Date(body.marriageDate) : existingRecord.marriageDate,
          marriagePartnerName: body.marriagePartnerName?.trim() || existingRecord.marriagePartnerName,
          marriagePlace: body.marriagePlace?.trim() || existingRecord.marriagePlace,
          marriageWitnesses: body.marriageWitnesses?.trim() || existingRecord.marriageWitnesses,
          marriageMinister: body.marriageMinister?.trim() || existingRecord.marriageMinister,
          dateOfDeath: body.dateOfDeath ? new Date(body.dateOfDeath) : existingRecord.dateOfDeath,
          remarks: body.remarks?.trim() || existingRecord.remarks,
        }
      });

      console.log('Baptismal record updated successfully:', {
        id: updatedRecord.id,
        sNo: updatedRecord.sNo,
        name: `${updatedRecord.baptismName} ${updatedRecord.surname}`
      });

      res.status(200).json({
        message: 'Baptismal record updated successfully',
        record: updatedRecord
      });

    } catch (error) {
      console.error('=== PUT ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);

      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        type: error.constructor.name
      });
    } finally {
      if (prismaLocal) await prismaLocal.$disconnect();
    }
    return;
  }

  // Handle DELETE request for deleting baptismal records
  if (req.method === 'DELETE') {
    let prismaLocal;
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Missing record ID' });
      }

      const { PrismaClient } = await import('@prisma/client');
      prismaLocal = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prismaLocal.$connect();

      const existingRecord = await prismaLocal.baptismRecord.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRecord) {
        return res.status(404).json({ error: 'Baptismal record not found' });
      }

      await prismaLocal.baptismRecord.delete({
        where: { id: parseInt(id) }
      });

      console.log('Baptismal record deleted successfully:', {
        id: existingRecord.id,
        sNo: existingRecord.sNo,
        name: `${existingRecord.baptismName} ${existingRecord.surname}`
      });

      res.status(200).json({
        message: 'Baptismal record deleted successfully',
        record: existingRecord
      });

    } catch (error) {
      console.error('=== DELETE ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);

      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        type: error.constructor.name
      });
    } finally {
      if (prismaLocal) await prismaLocal.$disconnect();
    }
    return;
  }

  // Handle unsupported HTTP methods
  res.status(405).json({ error: 'Method not allowed' });
};

// Export with middleware wrapper
export default corsMiddleware(withDatabase(handler));