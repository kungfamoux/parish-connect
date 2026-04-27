// Search suggestions API for baptismal records
import { corsMiddleware } from '../../middleware/cors.js';
import { withDatabase } from '../../middleware/database.js';
import { successResponse, errorResponse } from '../../utils/response.js';

const handler = async (req, res) => {
  const { prisma } = req;

  // Handle GET request for search suggestions
  if (req.method === 'GET') {
    try {

      const { q = '' } = req.query;
      const query = q.trim();

      console.log('=== Search Suggestions Request ===');
      console.log('Query:', query);

      if (query.length < 2) {
        return res.json([]);
      }

      // Get search suggestions from multiple fields
      const suggestions = new Set();

      // Get name suggestions (baptism name + surname combinations)
      const nameSuggestions = await prisma.baptismRecord.findMany({
        where: {
          OR: [
            { baptismName: { contains: query, mode: 'insensitive' } },
            { surname: { contains: query, mode: 'insensitive' } },
            { otherName: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          baptismName: true,
          surname: true,
          otherName: true
        },
        take: 20,
        orderBy: [
          { baptismName: 'asc' },
          { surname: 'asc' }
        ]
      });

      // Add full name combinations
      nameSuggestions.forEach(record => {
        if (record.baptismName && record.surname) {
          const fullName = `${record.baptismName} ${record.surname}`.trim();
          if (fullName.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(fullName);
          }
        }
        
        // Add individual names
        if (record.baptismName && record.baptismName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(record.baptismName);
        }
        if (record.surname && record.surname.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(record.surname);
        }
        if (record.otherName && record.otherName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(record.otherName);
        }
      });

      // Get parent name suggestions
      const parentSuggestions = await prisma.baptismRecord.findMany({
        where: {
          OR: [
            { fathersName: { contains: query, mode: 'insensitive' } },
            { mothersName: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          fathersName: true,
          mothersName: true
        },
        take: 10
      });

      parentSuggestions.forEach(record => {
        if (record.fathersName && record.fathersName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(record.fathersName);
        }
        if (record.mothersName && record.mothersName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(record.mothersName);
        }
      });

      // Get place suggestions
      const placeSuggestions = await prisma.baptismRecord.findMany({
        where: {
          placeOfBaptism: { contains: query, mode: 'insensitive' }
        },
        select: {
          placeOfBaptism: true
        },
        take: 10,
        distinct: ['placeOfBaptism']
      });

      placeSuggestions.forEach(record => {
        if (record.placeOfBaptism) {
          suggestions.add(record.placeOfBaptism);
        }
      });

      // Get minister suggestions
      const ministerSuggestions = await prisma.baptismRecord.findMany({
        where: {
          nameOfMinister: { contains: query, mode: 'insensitive' }
        },
        select: {
          nameOfMinister: true
        },
        take: 10,
        distinct: ['nameOfMinister']
      });

      ministerSuggestions.forEach(record => {
        if (record.nameOfMinister) {
          suggestions.add(record.nameOfMinister);
        }
      });

      // Convert to array, sort by relevance (exact matches first, then starts with, then contains)
      const suggestionsArray = Array.from(suggestions);
      const sortedSuggestions = suggestionsArray.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const queryLower = query.toLowerCase();

        // Exact match first
        if (aLower === queryLower) return -1;
        if (bLower === queryLower) return 1;

        // Starts with query second
        const aStarts = aLower.startsWith(queryLower);
        const bStarts = bLower.startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Then by length (shorter first)
        return a.length - b.length;
      });

      // Return top suggestions
      const finalSuggestions = sortedSuggestions.slice(0, 10);

      console.log('Suggestions found:', finalSuggestions.length);
      console.log('Suggestions:', finalSuggestions);

      res.json(finalSuggestions);

    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch search suggestions'
      });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
  } else {
    res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }
};

// Export with middleware wrapper
export default corsMiddleware(withDatabase(handler));
