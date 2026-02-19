import { NextResponse } from 'next/server';

// On utilise 'export default' pour le nouveau fichier proxy.js
export default function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protection des routes /admin (sauf la page login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    
    // Vérification du cookie
    const authCookie = request.cookies.get('admin_auth');

    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// La configuration du matcher reste la même
export const config = {
  matcher: ['/admin/:path*'],
};