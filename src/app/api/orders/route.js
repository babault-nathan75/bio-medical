import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    // Création de la commande dans la base de données
    const newOrder = await Order.create(body);
    
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Erreur création commande:", error);
    return NextResponse.json({ success: false, error: "Impossible de créer la commande" }, { status: 400 });
  }
}