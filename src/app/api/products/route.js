import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    
    // On récupère tous les produits, triés par date de création (du plus récent au plus ancien)
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la récupération des produits' }, { status: 500 });
  }
}