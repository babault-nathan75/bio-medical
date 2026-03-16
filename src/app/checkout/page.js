"use client";

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart(); 
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Paris', 
  });

  // Empêche l'erreur d'hydratation Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer: formData,
      orderItems: cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: totalPrice
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Commande validée avec succès ! Bio Medical vous remercie.");
        clearCart(); 
        // Redirection vers la page de succès avec l'ID de commande
        router.push(`/order-success?id=${data.order._id}`); 
      } else {
        alert("Erreur lors de la commande : " + data.error);
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // On ne rend rien tant que le composant n'est pas monté côté client
  if (!mounted) return null; 

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-sans">
        <Navbar backLink="/shop" />
        <div className="max-w-3xl mx-auto p-10 mt-10 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
          <span className="text-6xl block mb-6">🛒</span>
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-4">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">Vous devez ajouter des articles avant de passer à la caisse.</p>
          <Link href="/shop" className="px-8 py-4 bg-[#B57C4F] text-white font-bold rounded-xl hover:bg-[#9C6840] transition-colors">
            Retourner à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar backLink="/cart" />

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#2D2D2D]">Finaliser la <span className="text-[#B57C4F]">Commande</span></h1>
          <p className="text-gray-500 mt-2">Veuillez renseigner vos informations de livraison.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">Informations client</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="ex: Jean Dupont"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="ex: contact@exemple.fr"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/20 transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Numéro de Téléphone</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="ex: 06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/20 transition-all"
                />
              </div>

              <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 mt-10">Adresse de livraison</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Adresse complète</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  placeholder="ex: 15 Rue de la Paix"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/20 transition-all"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Ville</label>
                <input 
                  type="text" 
                  name="city"
                  required
                  placeholder="ex: Paris"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/20 transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B57C4F] hover:bg-[#9C6840]'}`}
              >
                {loading ? 'Validation en cours...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 sticky top-28">
              <h2 className="text-lg font-bold text-[#2D2D2D] mb-4">Votre Commande</h2>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border-b border-gray-50 pb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full rounded-lg" /> : '💊'}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-[#2D2D2D] line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-[#B57C4F] shrink-0">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-[#2D2D2D]">Total à payer</span>
                  <span className="text-2xl font-black text-[#2D2D2D]">{totalPrice.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}