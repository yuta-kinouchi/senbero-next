import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 常にBasic認証を必要とするパス(管理画面・管理API)。
// PUBLIC_SITE_ENABLED=true の場合、これ以外の公開ページ(検索・店舗詳細等)は
// Basic認証をスキップし、検索エンジンからクロールできるようにする。
const ALWAYS_PROTECTED_PREFIXES = ['/admin', '/api/admin'];

function requiresAuth(pathname: string): boolean {
  if (process.env.PUBLIC_SITE_ENABLED !== 'true') {
    return true;
  }
  return ALWAYS_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  if (!requiresAuth(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
    });
  }

  const auth = authHeader.split(' ')[1];
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');

  if (user !== process.env.BASIC_AUTH_USER || pwd !== process.env.BASIC_AUTH_PASS) {
    return new NextResponse(null, {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' }
    });
  }

  return NextResponse.next();
}