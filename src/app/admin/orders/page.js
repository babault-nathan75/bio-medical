"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      
      if (json.success) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'En cours de livraison': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Livrée': return 'bg-green-100 text-green-700 border-green-200';
      case 'Annulée': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filtrage des commandes selon le terme de recherche
  const filteredOrders = orders.filter(order => 
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de l'Admin */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Gestion des <span className="text-[#B57C4F]">Commandes</span></h1>
            <p className="text-gray-500">Suivez et gérez les expéditions de vos clients.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/products/new" className="text-gray-500 font-bold hover:text-[#B57C4F] transition-colors text-sm">
              Gérer les produits
            </Link>
            <Link href="/shop" className="text-[#B57C4F] font-bold hover:underline text-sm">
              Voir la boutique →
            </Link>
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text"
              placeholder="Rechercher par nom, ID ou téléphone..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Chargement des commandes...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl block mb-4">📦</span>
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">Aucune commande trouvée</h2>
              <p className="text-gray-500">Essayez un autre terme de recherche.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-sm font-bold text-gray-700">ID & Client</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Articles</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Total</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Livraison</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      
                      <td className="p-6">
                        <div className="text-[10px] font-mono text-[#B57C4F] mb-1">ID: {order._id.toUpperCase()}</div>
                        <div className="font-bold text-[#2D2D2D]">{order.customer.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <div className="space-y-1">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-bold text-[#B57C4F]">{item.quantity}x</span> {item.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <div className="font-black text-lg text-[#2D2D2D]">{order.totalPrice.toLocaleString('fr-FR')} €</div>
                      </td>
                      
                      <td className="p-6">
                        <div className="text-sm font-medium text-gray-700">{order.customer.address}</div>
                        <div className="text-xs text-gray-500">{order.customer.phone}</div>
                      </td>
                      
                      <td className="p-6">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="En cours de livraison">En cours</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}