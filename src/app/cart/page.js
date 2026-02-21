"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  // Ajout de updateQuantity récupéré depuis le contexte
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calcul du prix total du panier
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar backLink="/shop" />

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#2D2D2D]">Mon <span className="text-[#B57C4F]">Panier</span></h1>
          <p className="text-gray-500 mt-2">Vérifiez vos articles avant de passer commande.</p>
        </header>

        {cart.length === 0 ? (
          // --- ÉTAT : PANIER VIDE ---
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <span className="text-8xl mb-6 grayscale opacity-20">🛒</span>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8 max-w-md">Vous n&apos;avez pas encore ajouté de soins ou de médicaments à votre panier.</p>
            <Link href="/shop" className="px-8 py-4 bg-[#B57C4F] text-white font-bold rounded-xl hover:bg-[#9C6840] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
              Retourner à la boutique
            </Link>
          </div>
        ) : (
          // --- ÉTAT : PANIER REMPLI ---
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Liste des articles */}
            <div className="lg:w-2/3 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center gap-4 sm:gap-6 group">
                  
                  {/* Image miniature */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-[#F2D0B4]/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-3xl sm:text-4xl drop-shadow-sm">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full rounded-xl" /> : '💊'}
                    </span>
                  </div>
                  
                  {/* Infos du produit & Contrôleur de quantité */}
                  <div className="flex-grow">
                    <span className="text-[10px] sm:text-xs font-bold text-[#B57C4F] uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#2D2D2D] leading-tight">{item.name}</h3>
                    
                    {/* NOUVEAU : Contrôleur de quantité interactif */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-gray-500 text-sm hidden sm:inline">Quantité :</span>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-[#2D2D2D] min-w-[2.5rem] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prix et Suppression */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="text-lg sm:text-xl font-black text-[#2D2D2D]">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} <span className="text-xs text-gray-400 font-medium">€</span>
                    </span>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <span className="hidden sm:inline">Retirer</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Résumé de la commande (Panneau latéral) */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 sticky top-28">
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 border-b border-gray-100 pb-4">Résumé de la commande</h2>
                
                <div className="space-y-4 text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Montant du produit</span>
                    <span className="font-semibold">{totalPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">Le montant de la livraison vous sera communiqué lors de la livraison</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-[#2D2D2D]">Total</span>
                    <span className="text-3xl font-black text-[#B57C4F]">
                      {totalPrice.toLocaleString('fr-FR')} <span className="text-lg text-gray-500 font-medium">€</span>
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full py-4 bg-[#2D2D2D] text-white font-bold text-lg rounded-xl hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Valider la commande
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Paiement sécurisé
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}