import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // On expire le cookie immédiatement
  response.cookies.set('admin_auth', '', { 
    path: '/',
    maxAge: 0 
  });

  return response;
}