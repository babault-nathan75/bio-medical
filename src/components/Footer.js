import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#f0f4f4] text-[#2D2D2D] pt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Ligne des Garanties (Image 3) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-gray-300">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2">⭐</span>
            <span className="text-xs font-bold uppercase">Excellente Qualité</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2">🔄</span>
            <span className="text-xs font-bold uppercase">Rétractation</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2">🚚</span>
            <span className="text-xs font-bold uppercase">Livraison Rapide</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl mb-2">🔒</span>
            <span className="text-xs font-bold uppercase">Sécurité</span>
          </div>
        </div>

        {/* Liens et Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
          <div>
            <h4 className="font-bold uppercase text-sm mb-6">Contact</h4>
            <p className="text-sm text-gray-500 mb-2">+33 1 79 75 37 38</p>
            <p className="text-sm text-gray-500">biomedicalparis@gmail.com</p>
          </div>
          <div>
            <h4 className="font-bold uppercase text-sm mb-6">Catégories Principales</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>Bien-être</li>
              <li>Énergie & Sommeil</li>
              <li>Soins Ayurvédiques</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase text-sm mb-6">Modes de paiement</h4>
            <div className="flex gap-4 opacity-50">
              <span className="text-2xl">💳</span>
              <span className="text-2xl">🏦</span>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-gray-300 text-center text-[10px] uppercase tracking-widest text-gray-400">
          © 2026 <Link href="/admin/login" >Bio Medical</Link> - Tout pour votre santé et votre beauté
        </div>
      </div>
    </footer>
  );
}