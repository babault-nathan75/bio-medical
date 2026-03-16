import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Rappel : Code de 16 caractères Google
  },
});

export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const { customer, orderItems, totalPrice } = body;

    // 1. MISE À JOUR DES STOCKS
    await Promise.all(
      orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity }
        });
      })
    );

    // 2. CRÉATION DE LA COMMANDE EN BASE
    const newOrder = await Order.create(body);
    const orderIdShort = newOrder._id.toString().slice(-6).toUpperCase();

    // 3. PRÉPARATION DES CONTENUS
    const itemsList = orderItems.map(item => 
      `<li>${item.name} (x${item.quantity})</li>`
    ).join('');

    // --- MAIL POUR LE CLIENT (Style professionnel et rassurant) ---
    const mailClient = {
      from: `"Bio Medical" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Confirmation de votre commande #${orderIdShort}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #B57C4F;">Merci pour votre confiance, ${customer.name} !</h2>
          <p>Nous avons bien enregistré votre commande <strong>#${orderIdShort}</strong>.</p>
          <p>Un de nos conseillers va vous appeler au <strong>${customer.phone}</strong> pour confirmer l'heure de livraison à l'adresse suivante :</p>
          <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #B57C4F;">
            ${customer.address}, ${customer.city}
          </p>
          <h3>Résumé de vos articles :</h3>
          <ul>${itemsList}</ul>
          <p><strong>Total à payer à la livraison : ${totalPrice.toLocaleString()} €</strong></p>
          <br>
          <p>À très bientôt,<br>L'équipe Bio Medical</p>
        </div>
      `,
    };

    // --- MAIL POUR L'ADMIN (Style alerte et logistique) ---
    const mailAdmin = {
      from: `"Système Bio Medical" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🔴 ALERTE : Nouvelle commande de ${customer.name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: red;">Nouvelle commande reçue !</h2>
          <p><strong>ID Commande :</strong> #${newOrder._id}</p>
          <hr>
          <p><strong>CLIENT :</strong> ${customer.name}</p>
          <p><strong>TÉLÉPHONE :</strong> ${customer.phone}</p>
          <p><strong>EMAIL :</strong> ${customer.email}</p>
          <p><strong>ADRESSE :</strong> ${customer.address}, ${customer.city}</p>
          <hr>
          <h3>CONTENU :</h3>
          <ul>${itemsList}</ul>
          <p><strong>TOTAL À ENCAISSER : ${totalPrice.toLocaleString()} €</strong></p>
          <br>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" style="background: #333; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans l'interface Admin</a>
        </div>
      `,
    };

    // 4. ENVOI DES MAILS
    // On utilise try/catch pour ne pas bloquer le client si l'envoi échoue
    try {
      await Promise.all([
        transporter.sendMail(mailClient),
        transporter.sendMail(mailAdmin)
      ]);
    } catch (mailError) {
      console.error("Erreur Nodemailer :", mailError.message);
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });

  } catch (error) {
    console.error("Erreur API :", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}