import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "Connexion à Bio Medical réussie !" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Échec de la connexion" }, { status: 500 });
  }
}