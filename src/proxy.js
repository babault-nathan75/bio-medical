import { NextResponse } from 'next/server';

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  // On protège TOUT ce qui commence par /admin
  // SAUF la page /admin/login (sinon on ne peut jamais se connecter)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    
    // Vérification du cookie de session
    const authCookie = request.cookies.get('admin_auth');

    // Si le cookie est absent ou n'est pas "true"
    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Le matcher indique à Next.js de n'exécuter ce script que sur les routes admin
export const config = {
  matcher: ['/admin/:path*'],
};