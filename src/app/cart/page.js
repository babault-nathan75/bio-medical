"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calcul du prix total du panier
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar backLink="/shop" />

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#2D2D2D]">
            Mon <span className="text-[#B57C4F]">Panier</span>
          </h1>
          <p className="text-gray-500 mt-2">Vérifiez vos articles avant de passer commande.</p>
        </header>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <span className="text-8xl mb-6 grayscale opacity-20">🛒</span>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8 max-w-md">Vous n&apos;avez pas encore ajouté de soins ou de médicaments à votre panier.</p>
            <Link href="/shop" className="px-8 py-4 bg-[#B57C4F] text-white font-bold rounded-xl hover:bg-[#9C6840] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1">
              Retourner à la boutique
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Liste des articles */}
            <div className="lg:w-2/3 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex items-center gap-4 sm:gap-6 group">
                  
                  {/* Image miniature */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-[#F2D0B4]/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-3xl sm:text-4xl drop-shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full rounded-xl" />
                      ) : (
                        '💊'
                      )}
                    </span>
                  </div>
                  
                  {/* Infos du produit & Contrôleur de quantité */}
                  <div className="flex-grow">
                    <span className="text-[10px] sm:text-xs font-bold text-[#B57C4F] uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-base sm:text-lg font-bold text-[#2D2D2D] leading-tight">{item.name}</h3>
                    
                    {/* Alerte stock faible */}
                    {item.stockQuantity <= 5 && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">
                        Plus que {item.stockQuantity} en stock !
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-30 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold text-[#2D2D2D] min-w-[2.5rem] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          // DESACTIVE LE BOUTON SI LE STOCK EST ATTEINT
                          disabled={item.quantity >= item.stockQuantity}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title={item.quantity >= item.stockQuantity ? "Stock maximum atteint" : "Augmenter"}
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

            {/* Résumé de la commande */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 sticky top-28">
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 border-b border-gray-100 pb-4">Résumé</h2>
                
                <div className="space-y-4 text-gray-600 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-semibold">{totalPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                  <p className="text-green-600 text-xs font-medium bg-green-50 p-3 rounded-xl">
                    Le montant de la livraison vous sera communiqué par téléphone lors de la confirmation.
                  </p>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-[#2D2D2D]">Total</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#B57C4F]">
                        {totalPrice.toLocaleString('fr-FR')}
                      </span>
                      <span className="ml-1 text-xs text-gray-500 font-medium uppercase">€</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="w-full py-4 bg-[#2D2D2D] text-white font-bold text-lg rounded-xl hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                  Commander
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}