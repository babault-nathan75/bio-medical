import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const { id } = await params;

    // Utilisation d'une agrégation pour transformer l'ObjectId en String
    const orders = await Order.aggregate([
      {
        $addFields: {
          idString: { $toString: "$_id" } // On crée un champ texte temporaire
        }
      },
      {
        $match: {
          idString: { $regex: `${id}$`, $options: 'i' } // On cherche la fin de la chaîne
        }
      }
    ]);

    const order = orders[0]; // On prend le premier résultat trouvé

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Commande introuvable" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Erreur de recherche :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur lors de la recherche" }, 
      { status: 400 }
    );
  }
}