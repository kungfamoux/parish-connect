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
      // Check if this is a baptismal record creation (has baptismal record fields)
      const body = req.body;
      if (body && body.baptismName) {

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
          let newRecord = null;
          let attempts = 0;
          const maxAttempts = 50;
          
          while (attempts < maxAttempts && !newRecord) {
            try {
              // Find the next available S_NO by checking for gaps
              const result = await prisma.$transaction(async (tx) => {
                // Get all existing S_NO values to find gaps
                const existingRecords = await tx.baptismRecord.findMany({
                  select: { sNo: true },
                  orderBy: { sNo: 'asc' }
                });
                
                const existingSNos = existingRecords.map(r => r.sNo).filter(sNo => sNo != null);
                
                // Find the next available S_NO by looking for gaps
                let nextSNo = 1;
                
                // If we have existing records, find the first gap
                if (existingSNos.length > 0) {
                  // Sort the S_NOs to ensure proper order
                  existingSNos.sort((a, b) => a - b);
                  
                  // Look for gaps in the sequence starting from 1
                  for (let i = 0; i < existingSNos.length; i++) {
                    const expectedSNo = i + 1;
                    if (existingSNos[i] !== expectedSNo) {
                      // Found a gap - use this number
                      nextSNo = expectedSNo;
                      console.log(`Found gap in sequence: expected ${expectedSNo}, found ${existingSNos[i]}, using ${nextSNo}`);
                      break;
                    }
                  }
                  
                  // If no gaps found, use the next number after the highest
                  if (nextSNo === 1) {
                    nextSNo = existingSNos[existingSNos.length - 1] + 1;
                    console.log(`No gaps found, using next number after highest: ${nextSNo}`);
                  }
                }
                
                // Double-check this S_NO doesn't exist (including empty records)
                const existingCheck = await tx.baptismRecord.findUnique({
                  where: { sNo: nextSNo },
                  select: { id: true, baptismName: true, surname: true }
                });
                
                if (existingCheck) {
                  console.log(`S_NO ${nextSNo} exists but is empty/incomplete, skipping to next available`);
                  // Find the next available S_NO by incrementing until we find a free one
                  let candidateSNo = nextSNo + 1;
                  while (candidateSNo <= nextSNo + 100) { // Prevent infinite loop
                    const checkAgain = await tx.baptismRecord.findUnique({
                      where: { sNo: candidateSNo },
                      select: { id: true }
                    });
                    if (!checkAgain) {
                      nextSNo = candidateSNo;
                      console.log(`Found available S_NO after skipping existing: ${nextSNo}`);
                      break;
                    }
                    candidateSNo++;
                  }
                  
                  if (candidateSNo > nextSNo + 100) {
                    throw new Error('Could not find available S_NO after checking 100 consecutive numbers');
                  }
                }
                
                console.log(`Attempting to create record with auto-generated S_NO: ${nextSNo}`);
                
                // Final verification - this should not happen due to our logic above
                if (existingCheck) {
                  throw new Error(`S_NO ${nextSNo} already exists despite all checks`);
                }
                
                return nextSNo;
              });
              
              finalSNo = result;
              break;
              
            } catch (createError) {
              attempts++;
              console.log(`Auto-generation attempt ${attempts}/${maxAttempts} failed:`, createError.code || createError.message);
              
              // If it's not a unique constraint error, or we've tried too many times, re-throw
              if (createError.code !== 'P2002' || attempts >= maxAttempts) {
                throw createError;
              }
              
              // Longer delay for sequence approach
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
          
          if (!finalSNo) {
            throw new Error(`Failed to auto-generate S_NO after ${maxAttempts} attempts`);
          }
        }
        
        // Create the baptismal record with the determined S_NO
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

  // Handle GET request for fetching baptismal records
  if (req.method === 'GET') {
    let prisma;
    try {
      // Initialize Prisma client
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prisma.$connect();

      const { page = 1, limit = 20, search = '' } = req.query;
      const currentPage = parseInt(page);
      const recordsPerPage = parseInt(limit);
      const offset = (currentPage - 1) * recordsPerPage;

      console.log('=== GET Baptismal Records Request ===');
      console.log('Page:', currentPage);
      console.log('Limit:', recordsPerPage);
      console.log('Search:', search);

      // Build search conditions
      let whereConditions = {
        baptismName: { not: null }
      };

      if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        const searchTerms = searchTerm.split(/\s+/).filter(term => term.length > 0);
        
        if (searchTerms.length > 0) {
          // Enhanced search logic for full names
          if (searchTerms.length >= 2) {
            // Try exact match for full names (2+ words)
            const exactConditions = searchTerms.map((term, index) => {
              if (index === 0) {
                return {
                  OR: [
                    { baptismName: { contains: term, mode: 'insensitive' } },
                    { otherName: { contains: term, mode: 'insensitive' } },
                    { surname: { contains: term, mode: 'insensitive' } }
                  ]
                };
              } else {
                return {
                  OR: [
                    { baptismName: { contains: term, mode: 'insensitive' } },
                    { otherName: { contains: term, mode: 'insensitive' } },
                    { surname: { contains: term, mode: 'insensitive' } }
                  ]
                };
              }
            });

            // Try exact full name match first
            const exactMatchConditions = {
              AND: [
                { baptismName: { contains: searchTerms[0], mode: 'insensitive' } },
                { surname: { contains: searchTerms[searchTerms.length - 1], mode: 'insensitive' } }
              ]
            };

            // Check for exact full name match
            const exactMatch = await prisma.baptismRecord.findMany({
              where: exactMatchConditions,
              take: 1
            });

            if (exactMatch.length > 0) {
              whereConditions = exactMatchConditions;
            } else {
              // Fall back to broader search
              whereConditions = {
                AND: exactConditions
              };
            }
          } else {
            // Single term search
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
                    { sNo: !isNaN(searchTerm) ? parseInt(searchTerm) : undefined }
                  ].filter(condition => condition !== undefined)
                }
              ]
            };
          }
        }
      }

      // Get total count for pagination
      const totalRecords = await prisma.baptismRecord.count({
        where: whereConditions
      });

      // Get records with pagination
      const records = await prisma.baptismRecord.findMany({
        where: whereConditions,
        orderBy: [
          { sNo: 'asc' }
        ],
        skip: offset,
        take: recordsPerPage
      });

      // Ensure records is an array and handle null/undefined values
      const safeRecords = (records || []).map(record => ({
        ...record,
        // Ensure date fields are properly formatted
        dateOfBirth: record.dateOfBirth ? record.dateOfBirth.toISOString().split('T')[0] : null,
        dateOfBaptism: record.dateOfBaptism ? record.dateOfBaptism.toISOString().split('T')[0] : null,
        firstHolyCommunionDate: record.firstHolyCommunionDate ? record.firstHolyCommunionDate.toISOString().split('T')[0] : null,
        confirmationDate: record.confirmationDate ? record.confirmationDate.toISOString().split('T')[0] : null,
        marriageDate: record.marriageDate ? record.marriageDate.toISOString().split('T')[0] : null,
        dateOfDeath: record.dateOfDeath ? record.dateOfDeath.toISOString().split('T')[0] : null,
        // Ensure string fields are not null
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
      const { id } = req.query;
      const body = req.body;

      if (!id || !body) {
        return res.status(400).json({ 
          error: 'Missing record ID or update data' 
        });
      }

      // Initialize Prisma client
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prisma.$connect();

      // Check if record exists
      const existingRecord = await prisma.baptismRecord.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRecord) {
        return res.status(404).json({ 
          error: 'Baptismal record not found' 
        });
      }

      // Update the record
      const updatedRecord = await prisma.baptismRecord.update({
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
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ 
          error: 'Missing record ID' 
        });
      }

      // Initialize Prisma client
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL,
        log: ['info', 'warn', 'error'],
      });

      await prisma.$connect();

      // Check if record exists
      const existingRecord = await prisma.baptismRecord.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingRecord) {
        return res.status(404).json({ 
          error: 'Baptismal record not found' 
        });
      }

      // Delete the record
      await prisma.baptismRecord.delete({
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
      if (prisma) {
        await prisma.$disconnect();
      }
    }
    return;
  }

  // Handle unsupported HTTP methods
  res.status(405).json({ error: 'Method not allowed' });
};

// Export with middleware wrapper
export default corsMiddleware(withDatabase(handler));
