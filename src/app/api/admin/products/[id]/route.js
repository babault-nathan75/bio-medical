import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { v2 as cloudinary } from 'cloudinary';

// Configuration sécurisée de Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Fonction utilitaire pour envoyer vers Cloudinary
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

// LECTURE (GET)
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// MODIFICATION (PUT)
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const data = await request.formData();
    
    // Préparation des données texte
    const updateData = {
      name: data.get('name'),
      description: data.get('description'),
      price: Number(data.get('price')),
      category: data.get('category'),
      stockQuantity: Number(data.get('stockQuantity'))
    };

    const imageFile = data.get('image');
    const videoFile = data.get('video');

    // Gestion de la nouvelle image sur Cloudinary
    if (imageFile && typeof imageFile === 'object' && imageFile.name && imageFile.name !== 'undefined' && imageFile.size > 0) {
      updateData.imageUrl = await uploadToCloudinary(imageFile, 'image');
    }

    // Gestion de la nouvelle vidéo sur Cloudinary
    if (videoFile && typeof videoFile === 'object' && videoFile.name && videoFile.name !== 'undefined' && videoFile.size > 0) {
      updateData.videoUrl = await uploadToCloudinary(videoFile, 'video');
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return NextResponse.json({ success: false }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Erreur Update Bio Medical:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la modification sur Cloudinary" }, { status: 500 });
  }
}

// SUPPRESSION (DELETE)
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}