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
    const category = data.get('category');
    const stockQuantity = data.get('stockQuantity');
    
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
    if (imageFile && imageFile.name) {
      imageUrl = await saveFile(imageFile);
    }

    // Si une vidéo a été uploadée, on la sauvegarde
    if (videoFile && videoFile.name) {
      videoUrl = await saveFile(videoFile);
    }

    // On crée le produit dans MongoDB avec les liens des fichiers
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stockQuantity: Number(stockQuantity),
      imageUrl,
      videoUrl
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("Erreur Upload:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}