"use client";

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product, isAvailable, showText = false }) {
  const { addToCart } = useCart();

  return (
    <button 
      disabled={!isAvailable}
      onClick={(e) => {
        e.preventDefault(); // Empêche le clic de nous faire changer de page (si le bouton est dans un lien)
        addToCart(product);
      }}
      className={`transition-all shadow-md relative z-10 flex items-center justify-center ${
        showText 
          ? 'w-full py-4 rounded-xl font-bold text-lg gap-3' // Style pour la page de détails
          : 'p-3 rounded-xl' // Style pour la carte produit de la boutique
      } ${
        isAvailable 
          ? 'bg-[#2D2D2D] text-white hover:bg-[#B57C4F] hover:shadow-lg hover:-translate-y-0.5' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      {showText && (isAvailable ? 'Ajouter au panier' : 'Rupture de stock')}
    </button>
  );
}