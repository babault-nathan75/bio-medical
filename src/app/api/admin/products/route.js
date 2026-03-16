import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    await dbConnect();
    
    // On récupère toutes les données du formulaire (fichiers + textes)
    const data = await request.formData();
    
    // Extraction des textes
    const name = data.get('name');
    const description = data.get('description');
    const price = data.get('price');
    const stockQuantity = data.get('stockQuantity');
    const category = data.get('category'); // <--- MODIFICATION 1 : On récupère la catégorie
    
    // Extraction des fichiers
    const imageFile = data.get('image');
    const videoFile = data.get('video');

    let imageUrl = '';
    let videoUrl = '';

    // Fonction utilitaire pour sauvegarder un fichier sur ton PC (dans public/uploads)
    const saveFile = async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // On crée un nom unique pour éviter d'écraser des fichiers du même nom
      const uniqueName = Date.now() + '-' + file.name.replaceAll(' ', '_');
      const uploadPath = path.join(process.cwd(), 'public/uploads', uniqueName);
      await writeFile(uploadPath, buffer);
      return `/uploads/${uniqueName}`; // C'est le lien qu'on va sauvegarder dans MongoDB
    };

    // Si une image a été uploadée, on la sauvegarde
    if (imageFile && imageFile.name !== 'undefined') {
      imageUrl = await saveFile(imageFile);
    }

    // Si une vidéo a été uploadée, on la sauvegarde
    if (videoFile && videoFile.name !== 'undefined') {
      videoUrl = await saveFile(videoFile);
    }

    // On crée le produit dans MongoDB avec les liens des fichiers
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price), // Number() gère très bien les décimales envoyées par le step="0.01"
      stockQuantity: Number(stockQuantity),
      category, // <--- MODIFICATION 2 : On l'ajoute à la création du produit
      imageUrl,
      videoUrl
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("Erreur Upload:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}