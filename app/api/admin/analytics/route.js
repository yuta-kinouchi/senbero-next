import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const [totalViews, todayViews, last7DaysViews, topPagesRaw, dailyRaw, uniqueVisitorGroups] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { created_at: { gte: startOfToday } } }),
      prisma.pageView.count({ where: { created_at: { gte: startOfWeek } } }),
      prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 5,
      }),
      prisma.$queryRaw`
        SELECT DATE("created_at") as date, COUNT(*)::int as count
        FROM "PageView"
        WHERE "created_at" >= ${startOfWeek}
        GROUP BY DATE("created_at")
        ORDER BY date ASC
      `,
      prisma.pageView.groupBy({
        by: ['visitor_id'],
        where: { created_at: { gte: startOfWeek } },
      }),
    ]);

    return NextResponse.json({
      totalViews,
      todayViews,
      last7DaysViews,
      uniqueVisitors7d: uniqueVisitorGroups.length,
      topPages: topPagesRaw.map((p) => ({ path: p.path, count: p._count.path })),
      daily: dailyRaw.map((d) => ({ date: d.date, count: Number(d.count) })),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
