import { NextResponse } from 'next/server';
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/adminSession';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Configuration serveur incomplète' },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ success: true });

    // Cookie signé, valable 24h, httpOnly + sameSite strict
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur Login Admin:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
