"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'; // Import requis
import Navbar from '@/components/Navbar';

// 1. On isole le contenu qui utilise useSearchParams
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  // On extrait les 6 derniers caractères pour le suivi client
  const trackingCode = orderId ? orderId.slice(-6).toUpperCase() : null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 md:p-16">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
        ✓
      </div>
      
      <h1 className="text-3xl font-black text-[#2D2D2D] mb-4">
        Commande <span className="text-[#B57C4F]">Confirmée !</span>
      </h1>
      
      <p className="text-gray-500 mb-2">
        Merci pour votre confiance. Votre commande a été enregistrée avec succès.
      </p>
      
      {orderId && (
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
            Votre code de suivi (6 caractères)
          </p>
          <p className="text-xl font-mono font-bold text-[#B57C4F] bg-[#B57C4F]/5 py-2 px-4 rounded-lg inline-block">
            {trackingCode}
          </p>
          <p className="text-[9px] text-gray-400 mt-2 italic">
            Référence complète : {orderId}
          </p>
        </div>
      )}

      <div className="bg-[#F8F9FA] rounded-2xl p-6 mb-10 text-left border border-gray-100">
        <h3 className="font-bold text-[#2D2D2D] mb-2 text-sm uppercase tracking-wide">Prochaines étapes :</h3>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-[#B57C4F]">1.</span> 
            Un conseiller Bio Medical va vous appeler pour confirmer l&apos;adresse.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#B57C4F]">2.</span> 
            Le montant de la livraison vous sera communiqué lors de cet appel.
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-[#B57C4F]">3.</span> 
            Paiement à la livraison ou selon les modalités convenues.
          </li>
        </ul>
      </div>

      <Link href="/shop" className="inline-block px-10 py-4 bg-[#2D2D2D] text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
        Continuer mes achats
      </Link>
    </div>
  );
}

// 2. Le composant principal exporté
export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar backLink="/shop" />
      
      <main className="max-w-2xl mx-auto p-6 md:p-20 text-center">
        {/* Le Suspense permet à Next.js de passer l'étape du build sans erreur */}
        <Suspense fallback={
          <div className="bg-white rounded-3xl shadow-xl p-16 text-gray-400 font-medium">
            Chargement de la confirmation...
          </div>
        }>
          <OrderSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}