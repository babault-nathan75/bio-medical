import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/adminSession';

// Routes API admin qui doivent rester ouvertes (sinon impossible de se connecter / déconnecter)
const PUBLIC_ADMIN_API = ['/api/admin/login', '/api/admin/logout'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Page de login admin libre d'accès
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi =
    pathname.startsWith('/api/admin') && !PUBLIC_ADMIN_API.includes(pathname);

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (valid) {
    return NextResponse.next();
  }

  // API admin -> 401 JSON, page admin -> redirection vers /admin/login
  if (isAdminApi) {
    return NextResponse.json(
      { success: false, error: 'Authentification requise' },
      { status: 401 }
    );
  }

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
