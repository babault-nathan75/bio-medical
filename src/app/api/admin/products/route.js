import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary (Assure-toi d'avoir les variables dans ton .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fonction utilitaire pour envoyer un fichier vers Cloudinary
const uploadToCloudinary = async (file, resourceType = 'auto') => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: 'bio-medical-products', 
        resource_type: resourceType 
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.formData();
    
    const name = data.get('name');
    const description = data.get('description');
    const price = data.get('price');
    const stockQuantity = data.get('stockQuantity');
    const category = data.get('category');
    
    const imageFile = data.get('image');
    const videoFile = data.get('video');

    let imageUrl = '';
    let videoUrl = '';

    // Upload de l'image vers Cloudinary (si présente)
    if (imageFile && imageFile.name !== 'undefined' && imageFile.size > 0) {
      imageUrl = await uploadToCloudinary(imageFile, 'image');
    }

    // Upload de la vidéo vers Cloudinary (si présente)
    if (videoFile && videoFile.name !== 'undefined' && videoFile.size > 0) {
      videoUrl = await uploadToCloudinary(videoFile, 'video');
    }

    // Création du produit dans MongoDB avec les URL Cloudinary
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      category,
      imageUrl, // Sera maintenant : https://res.cloudinary.com/...
      videoUrl  // Sera maintenant : https://res.cloudinary.com/...
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("Erreur Upload Bio Medical:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du produit" }, 
      { status: 500 }
    );
  }
}