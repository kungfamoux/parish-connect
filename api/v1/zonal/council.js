// Zonal Council API
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

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

      const getZoneNumber = (zone) => {
        if (!zone) return Number.POSITIVE_INFINITY;
        const match = String(zone).match(/zone\s*(\d+)/i);
        return match ? Number.parseInt(match[1], 10) : Number.POSITIVE_INFINITY;
      };

      const sortedMembers = [...members].sort((a, b) => {
        const zoneA = getZoneNumber(a.zone);
        const zoneB = getZoneNumber(b.zone);

        if (zoneA !== zoneB) return zoneA - zoneB;

        if (zoneA !== Number.POSITIVE_INFINITY) {
          if ((a.groupName ?? '') !== (b.groupName ?? '')) {
            return (a.groupName ?? '').localeCompare(b.groupName ?? '', undefined, { sensitivity: 'base' });
          }
          return (a.sNo ?? Number.POSITIVE_INFINITY) - (b.sNo ?? Number.POSITIVE_INFINITY);
        }

        if ((a.groupName ?? '') !== (b.groupName ?? '')) {
          return (a.groupName ?? '').localeCompare(b.groupName ?? '', undefined, { sensitivity: 'base' });
        }
        return (a.sNo ?? Number.POSITIVE_INFINITY) - (b.sNo ?? Number.POSITIVE_INFINITY);
      });

      res.status(200).json(sortedMembers);
    } catch (error) {
      console.error('Error fetching zonal council members:', error);
      res.status(500).json({ error: 'Failed to fetch zonal council members', details: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
