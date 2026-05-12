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

const EUR_TO_FCFA = 655.957;

// Détermine l'adresse mail administrative destinataire selon le pays.
// Fallback : ADMIN_EMAIL_FR / ADMIN_EMAIL_CI -> EMAIL_USER (compte d'envoi).
function getAdminRecipient(country) {
  if (country === 'CI') return process.env.ADMIN_EMAIL_CI || process.env.EMAIL_USER;
  if (country === 'SN') return process.env.ADMIN_EMAIL_SN || process.env.ADMIN_EMAIL_CI || process.env.EMAIL_USER;
  return process.env.ADMIN_EMAIL_FR || process.env.EMAIL_USER;
}

function formatAmount(amountEur, country) {
  if (country === 'CI' || country === 'SN') {
    return `${Math.round(amountEur * EUR_TO_FCFA).toLocaleString('fr-FR')} FCFA`;
  }
  return `${amountEur.toLocaleString('fr-FR')} €`;
}

const COUNTRY_LABELS = { FR: 'France', CI: "Côte d'Ivoire", SN: 'Sénégal' };

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { customer, orderItems, totalPrice } = body;
    const allowedCountries = ['FR', 'CI', 'SN'];
    const country = allowedCountries.includes(customer?.country) ? customer.country : 'FR';

    // 1. MISE À JOUR DES STOCKS
    await Promise.all(
      orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity }
        });
      })
    );

    // 2. CRÉATION DE LA COMMANDE EN BASE (le pays est stocké dans customer.country)
    const newOrder = await Order.create({
      customer: { ...customer, country },
      orderItems,
      totalPrice,
    });
    const orderIdShort = newOrder._id.toString().slice(-6).toUpperCase();

    // 3. PRÉPARATION DES CONTENUS
    const itemsList = orderItems.map(item =>
      `<li>${item.name} (x${item.quantity}) — ${formatAmount(item.price * item.quantity, country)}</li>`
    ).join('');

    const totalFormatted = formatAmount(totalPrice, country);
    const countryLabel = COUNTRY_LABELS[country] || 'France';

    // --- MAIL POUR LE CLIENT ---
    const mailClient = {
      from: `"Bio Medical" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Confirmation de votre commande #${orderIdShort}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #B57C4F;">Merci pour votre confiance, ${customer.name} !</h2>
          <p>Nous avons bien enregistré votre commande <strong>#${orderIdShort}</strong> (${countryLabel}).</p>
          <p>Un de nos conseillers va vous appeler au <strong>${customer.phone}</strong> pour confirmer l'heure de livraison à l'adresse suivante :</p>
          <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #B57C4F;">
            ${customer.address}, ${customer.city}
          </p>
          <h3>Résumé de vos articles :</h3>
          <ul>${itemsList}</ul>
          <p><strong>Total à payer à la livraison : ${totalFormatted}</strong></p>
          <br>
          <p>À très bientôt,<br>L'équipe Bio Medical</p>
        </div>
      `,
    };

    // --- MAIL POUR L'ADMIN (destinataire selon le pays) ---
    const adminRecipient = getAdminRecipient(country);
    const mailAdmin = {
      from: `"Système Bio Medical" <${process.env.EMAIL_USER}>`,
      to: adminRecipient,
      subject: `🔴 [${countryLabel}] Nouvelle commande de ${customer.name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: red;">Nouvelle commande reçue (${countryLabel}) !</h2>
          <p><strong>ID Commande :</strong> #${newOrder._id}</p>
          <hr>
          <p><strong>CLIENT :</strong> ${customer.name}</p>
          <p><strong>TÉLÉPHONE :</strong> ${customer.phone}</p>
          <p><strong>EMAIL :</strong> ${customer.email}</p>
          <p><strong>ADRESSE :</strong> ${customer.address}, ${customer.city}</p>
          <p><strong>PAYS :</strong> ${countryLabel}</p>
          <hr>
          <h3>CONTENU :</h3>
          <ul>${itemsList}</ul>
          <p><strong>TOTAL À ENCAISSER : ${totalFormatted}</strong></p>
          <br>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/orders" style="background: #333; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir dans l'interface Admin</a>
        </div>
      `,
    };

    // 4. ENVOI DES MAILS
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
