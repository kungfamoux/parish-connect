// Zonal Council API
import { corsMiddleware } from '../../middleware/cors.js';
import { withDatabase } from '../../middleware/database.js';
import { errorHandler } from '../../middleware/errorHandler.js';
import { successResponse, errorResponse } from '../../utils/response.js';

const handler = async (req, res) => {
  const { prisma } = req;

  // Handle GET request for fetching zonal council members
  if (req.method === 'GET') {
    try {
      const members = await prisma.zonalCouncilMember.findMany({
        where: {
          isActive: true,
          electionYear: 2026
        },
        orderBy: [
          { zone: 'asc' },
          { groupName: 'asc' },
          { sNo: 'asc' }
        ]
      });

      return res.status(200).json(successResponse(members, 'Zonal council members fetched successfully'));
    } catch (error) {
      console.error('Error fetching zonal council members:', error);
      return res.status(500).json(errorResponse('Failed to fetch zonal council members', 500));
    }
  }

  // Handle unsupported methods
  return res.status(405).json(errorResponse('Method not allowed', 405));
};

// Apply middleware
export default corsMiddleware(withDatabase(errorHandler(handler)));
