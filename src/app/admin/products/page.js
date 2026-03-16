"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche

  // Charger les produits au montage
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
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
    if (!confirm("Attention, voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (json.success) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    }
  };

  // Filtrage des produits
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 bg-[#F8F9FA] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Catalogue <span className="text-[#B57C4F]">Produits</span></h1>
            <p className="text-gray-500">Gérez les articles et les stocks de votre pharmacie.</p>
          </div>
          <Link href="/admin/products/new" className="px-6 py-4 bg-[#2D2D2D] text-white font-bold rounded-2xl hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            + Ajouter un Produit
          </Link>
        </div>

        {/* Barre de Recherche */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text"
              placeholder="Rechercher un produit, une catégorie ou un ID..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Chargement du catalogue...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="text-6xl block mb-4 grayscale opacity-30">💊</span>
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">Aucun produit trouvé</h2>
              <p className="text-gray-500 mb-6">Modifiez votre recherche ou ajoutez un nouvel article.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-sm font-bold text-gray-700">Produit & ID</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Catégorie</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Prix</th>
                    <th className="p-6 text-sm font-bold text-gray-700">Stock</th>
                    <th className="p-6 text-sm font-bold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-50 overflow-hidden">
                          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" /> : '💊'}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-[#B57C4F] uppercase tracking-wider mb-0.5">ID: {product._id.slice(-8)}</div>
                          <div className="font-bold text-[#2D2D2D] line-clamp-1">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{product.description || "Sans description"}</div>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <span className="inline-block px-3 py-1 bg-[#F2D0B4]/30 text-[#B57C4F] font-bold text-[11px] rounded-full uppercase tracking-tight">
                          {product.category}
                        </span>
                      </td>
                      
                      <td className="p-6 font-black text-[#2D2D2D]">
                        {product.price.toLocaleString('fr-FR')}€
                      </td>
                      
                      <td className="p-6">
                        <div className={`flex items-center gap-2 font-bold text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} unités` : 'Rupture'}
                        </div>
                      </td>
                      
                      <td className="p-6 text-right space-x-2">
                        <Link 
                          href={`/admin/products/${product._id}/edit`} 
                          className="inline-block text-xs font-bold text-gray-600 bg-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Éditer
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="inline-block text-xs font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                        >
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