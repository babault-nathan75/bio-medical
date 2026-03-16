import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { writeFile } from 'fs/promises';
import path from 'path';

// LECTURE (GET) - Récupère un seul produit
export async function GET(request, { params }) {
  await dbConnect();
  try {
    // MODIF : On attend la résolution des params
    const { id } = await params;
    
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// MODIFICATION (PUT) - Met à jour les infos et les fichiers
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    // MODIF : On attend la résolution des params
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

    const saveFile = async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueName = Date.now() + '-' + file.name.replaceAll(' ', '_');
      const uploadPath = path.join(process.cwd(), 'public/uploads', uniqueName);
      await writeFile(uploadPath, buffer);
      return `/uploads/${uniqueName}`;
    };

    // Vérification fichiers (on évite les fichiers vides ou undefined)
    if (imageFile && typeof imageFile === 'object' && imageFile.name && imageFile.name !== 'undefined') {
      updateData.imageUrl = await saveFile(imageFile);
    }

    if (videoFile && typeof videoFile === 'object' && videoFile.name && videoFile.name !== 'undefined') {
      updateData.videoUrl = await saveFile(videoFile);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return NextResponse.json({ success: false }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Erreur Update:", error);
    return NextResponse.json({ success: false, error: "Erreur lors de la modification" }, { status: 500 });
  }
}

// SUPPRESSION (DELETE)
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    // MODIF : On attend la résolution des params
    const { id } = await params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}