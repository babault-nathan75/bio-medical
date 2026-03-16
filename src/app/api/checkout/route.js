// src/app/api/checkout/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Votre fonction de connexion
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function POST(req) {
  try {
    await dbConnect();
    const { items, customerDetails } = await req.json();

    // 1. Vérifier et mettre à jour le stock pour chaque article
    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product || product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${item.name}` },
          { status: 400 }
        );
      }

      // Décrémentation du stock
      product.stockQuantity -= item.quantity;
      await product.save();
    }

    // 2. Créer la commande en base de données
    const newOrder = await Order.create({
      items,
      customerDetails,
      totalPrice: items.reduce((t, i) => t + (i.price * i.quantity), 0),
      status: 'En attente'
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}