// Zonal Council API
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
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

      res.status(200).json(members);
    } catch (error) {
      console.error('Error fetching zonal council members:', error);
      res.status(500).json({ error: 'Failed to fetch zonal council members' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
