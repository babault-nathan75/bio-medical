import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

// MODIFICATION (PUT)
export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!category) return NextResponse.json({ success: false }, { status: 404 });
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// SUPPRESSION (DELETE)
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const deletedCategory = await Category.deleteOne({ _id: id });
    if (!deletedCategory) return NextResponse.json({ success: false }, { status: 404 });
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}