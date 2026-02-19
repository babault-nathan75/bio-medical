import { NextResponse } from 'next/server';

// On utilise 'export default' pour être sûr que Next.js 16 le reconnaisse immédiatement
export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // On protège toutes les routes /admin sauf la page de login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    
    // Récupération du cookie d'authentification
    const authCookie = request.cookies.get('admin_auth');

    // Si pas de cookie valide, redirection vers le login
    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// L'objet config DOIT rester un export nommé
export const config = {
  matcher: ['/admin/:path*'],
};