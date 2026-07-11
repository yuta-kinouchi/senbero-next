import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end();
    return;
  }

  const { path, visitorId } = req.body || {};
  if (!path || !visitorId) {
    res.status(400).json({ error: 'path and visitorId are required' });
    return;
  }

  try {
    await prisma.pageView.create({
      data: {
        path,
        visitor_id: visitorId,
        referrer: req.headers.referer || null,
        user_agent: req.headers['user-agent'] || null,
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error recording page view:', error);
    res.status(500).json({ error: 'Failed to record page view' });
  }
}
