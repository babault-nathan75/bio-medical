import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Connexion à la base de données
    await dbConnect();

    // 2. (Optionnel) Vider la collection pour éviter les doublons si tu rafraîchis la page
    await Product.deleteMany();

    // 3. Préparation de tes produits bio indiens
    const sampleProducts = [
      {
        name: "Ashwagandha Bio Premium",
        description: "Plante ayurvédique adaptogène puissante pour réduire le stress, améliorer le sommeil et booster l'énergie naturelle.",
        price: 5500,
        category: "Énergie & Stress",
        stockQuantity: 25,
      },
      {
        name: "Curcuma + Poivre Noir",
        description: "Anti-inflammatoire naturel très puissant. Idéal pour soulager les douleurs articulaires et protéger le système immunitaire.",
        price: 4000,
        category: "Articulations",
        stockQuantity: 15,
      },
      {
        name: "Triphala Détox",
        description: "Mélange traditionnel de trois fruits indiens pour purifier l'organisme et réguler en douceur le transit intestinal.",
        price: 3500,
        category: "Digestion",
        stockQuantity: 0, // Mis à 0 pour que tu puisses voir l'effet "Rupture" et le bouton grisé !
      },
      {
        name: "Baume Ayurvédique Apaisant",
        description: "Baume naturel aux huiles essentielles indiennes. Soulage instantanément les maux de tête et les tensions musculaires.",
        price: 2500,
        category: "Douleur",
        stockQuantity: 50,
      },
      {
        name: "Huile de Neem Pure",
        description: "Huile végétale antibactérienne et antifongique, parfaite pour les soins de la peau et du cuir chevelu.",
        price: 3000,
        category: "Soin",
        stockQuantity: 10,
      },
      {
        name: "Moringa en Poudre",
        description: "Super-aliment riche en vitamines et minéraux. Un concentré de nutriments pour revitaliser le corps.",
        price: 4500,
        category: "Complément",
        stockQuantity: 30,
      }
    ];

    // 4. Insertion dans MongoDB
    await Product.insertMany(sampleProducts);

    // 5. Réponse de succès
    return NextResponse.json({ 
      success: true,
      message: "Génial ! La base de données a été remplie avec succès.", 
      insertedCount: sampleProducts.length 
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur Seed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur lors de l'initialisation de la base de données." 
    }, { status: 500 });
  }
}