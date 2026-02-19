"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les produits au montage
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // On réutilise ton API publique pour récupérer les produits
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const handleDelete = async (id) => {
    if (!confirm("Attention, voulez-vous vraiment supprimer ce produit de la boutique ?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        // Mettre à jour la liste localement pour faire disparaître la ligne
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Catalogue <span className="text-[#B57C4F]">Produits</span></h1>
            <p className="text-gray-500">Gérez les articles de votre pharmacie.</p>
          </div>
          <Link href="/admin/products/new" className="px-6 py-3 bg-[#2D2D2D] text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            + Ajouter un Produit
          </Link>
        </div>

        {/* Tableau des produits */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Chargement du catalogue...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="text-6xl block mb-4 grayscale opacity-30">💊</span>
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">Aucun produit trouvé</h2>
              <p className="text-gray-500 mb-6">Commencez par ajouter des articles à votre boutique.</p>
              <Link href="/admin/products/new" className="text-[#B57C4F] font-bold hover:underline">
                Créer mon premier produit →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-sm font-bold text-gray-700">Produit</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Catégorie</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Prix</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Stock</th>
                    <th className="p-6 text-sm font-bold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full rounded-lg" /> : '💊'}
                        </div>
                        <div>
                          <div className="font-bold text-[#2D2D2D] line-clamp-1">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{product.description || "Sans description"}</div>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <span className="inline-block px-3 py-1 bg-[#F2D0B4]/30 text-[#B57C4F] font-bold text-xs rounded-full">
                          {product.category}
                        </span>
                      </td>
                      
                      <td className="p-6 font-black text-[#2D2D2D]">
                        {product.price.toLocaleString('fr-FR')} €
                      </td>
                      
                      <td className="p-6">
                        <span className={`font-bold text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} en stock` : 'Rupture'}
                        </span>
                      </td>
                      
                      <td className="p-6 text-right space-x-2">
                        {/* LE VRAI LIEN VERS LA PAGE DE MODIFICATION */}
                        <Link 
                          href={`/admin/products/${product._id}/edit`} 
                          className="inline-block text-sm font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Éditer
                        </Link>
                        <button onClick={() => handleDelete(product._id)} className="inline-block text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                          Supprimer
                        </button>
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