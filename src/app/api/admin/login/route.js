import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();

    // On compare le mot de passe envoyé avec celui du fichier .env
    if (password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // On crée un cookie sécurisé valable 1 jour (86400 secondes)
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 
      });
      
      return response;
    }

    return NextResponse.json({ success: false, error: 'Mot de passe incorrect' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}