"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrderStatus(null); // Réinitialise l'affichage
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success) {
        setOrderStatus(data.order);
      } else {
        alert("Commande introuvable. Vérifiez l'ID envoyé.");
      }
    } catch (err) {
      alert("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar backLink="/shop" />
      <main className="max-w-2xl mx-auto pt-32 px-6 pb-20">
        <h1 className="text-3xl font-black mb-8 text-center">Suivre mon <span className="text-[#B57C4F]">Colis</span></h1>
        
        <form onSubmit={handleTrack} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 mb-10">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Code de commande (6 derniers caractères)</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Ex: 1A2345"
              className="flex-grow px-6 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#B57C4F]/20 border border-transparent focus:border-[#B57C4F] transition-all uppercase"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <button 
              disabled={loading}
              className="bg-[#2D2D2D] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#B57C4F] transition-all disabled:bg-gray-300 shadow-lg"
            >
              {loading ? "Recherche..." : "Vérifier"}
            </button>
          </div>
        </form>

        {orderStatus && (
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Statut et ID */}
            <div className="flex justify-between items-start mb-8">
               <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                 orderStatus.status === 'Livrée' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
               }`}>
                 {orderStatus.status}
               </span>
            </div>

            {/* Détails Client */}
            <div className="space-y-4 border-t border-gray-50 pt-6">
              <div>
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Informations de livraison</h3>
                <p className="text-sm text-gray-700"><strong>Nom :</strong> {orderStatus.customer.name}</p>
                <p className="text-sm text-gray-700"><strong>Email :</strong> {orderStatus.customer.email}</p>
                <p className="text-sm text-gray-700"><strong>Adresse :</strong> {orderStatus.customer.address}</p>
              </div>

              {/* Détails Articles */}
              <div className="pt-4">
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Articles commandés</h3>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  {orderStatus.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        <span className="font-bold text-[#B57C4F]">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-bold text-[#2D2D2D]">{(item.price * item.quantity).toLocaleString()} €</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase">Total payé</span>
                <span className="text-xl font-black text-[#2D2D2D]">{orderStatus.totalPrice.toLocaleString()} €</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}