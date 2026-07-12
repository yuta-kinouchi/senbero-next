import { seedRestaurantsFromCsv } from '@/lib/seedRestaurants';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import path from 'path';

const prisma = new PrismaClient();

// 本番DBへ直接接続せずにdata/restaurants.csvを反映するための管理用エンドポイント。
// middlewareにより/api/admin配下は常にBasic認証で保護される。
// Vercelのサーバーレス関数のデフォルトタイムアウトでは足りない可能性があるため延長
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function runSeed() {
  const filePath = path.join(process.cwd(), 'data', 'restaurants.csv');
  const logs = [];
  const result = await seedRestaurantsFromCsv(prisma, filePath, (msg) => logs.push(msg));

  return NextResponse.json({
    ok: result.errors.length === 0,
    ...result,
    // ログは長いので末尾だけ返す
    recentLogs: logs.slice(-10),
  }, { status: result.errors.length === 0 ? 200 : 500 });
}

export async function POST() {
  try {
    return await runSeed();
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json({ ok: false, error: String(error.message || error) }, { status: 500 });
  }
}

// ブラウザのアドレスバーから直接叩けるようGETも許可(管理者専用・Basic認証必須)
export async function GET() {
  return POST();
}
