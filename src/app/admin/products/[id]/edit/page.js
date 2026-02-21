"use client";

import { useState, useEffect, use } from 'react'; // <-- AJOUT DE 'use'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage({ params }) {
  const router = useRouter();
  
  // <-- CORRECTION : Déballage de la promesse params
  const { id } = use(params); 
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: '', price: '', stockQuantity: '', category: '', description: '', imageUrl: ''
  });

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  // Charger le produit existant ET les catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupérer les catégories
        const catRes = await fetch('/api/admin/categories');
        const catJson = await catRes.json();
        if (catJson.success) setCategories(catJson.data);

        // 2. Récupérer le produit spécifique
        const prodRes = await fetch(`/api/admin/products/${id}`);
        const prodJson = await prodRes.json();
        if (prodJson.success) {
          setProductData({
            name: prodJson.data.name,
            price: prodJson.data.price,
            stockQuantity: prodJson.data.stockQuantity,
            category: prodJson.data.category,
            description: prodJson.data.description || '',
            imageUrl: prodJson.data.imageUrl || '',
          });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Erreur de chargement des données.' });
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.target);
    if (image) formData.set('image', image);
    if (video) formData.set('video', video);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Produit mis à jour avec succès !");
        router.push('/admin/products'); // Retour automatique à la liste
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la modification.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur serveur.' });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="p-12 text-center text-gray-500">Chargement de l'éditeur...</div>;

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Modifier le <span className="text-[#B57C4F]">Produit</span></h1>
            <p className="text-gray-500">Mettez à jour les informations, le stock ou le prix.</p>
          </div>
          <Link href="/admin/products" className="text-gray-500 font-bold hover:text-[#B57C4F] transition-colors">
            ← Retour au catalogue
          </Link>
        </div>

        {message && (
          <div className={`p-4 mb-8 rounded-xl font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit</label>
                <input type="text" name="name" defaultValue={productData.name} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prix (€)</label>
                  <input type="number" name="price" defaultValue={productData.price} required min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock disponible</label>
                  <input type="number" name="stockQuantity" defaultValue={productData.stockQuantity} required min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                <select name="category" defaultValue={productData.category} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]">
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea name="description" defaultValue={productData.description} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]"></textarea>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer block">
                  {productData.imageUrl && !image ? (
                    <div className="mb-4">
                      <img src={productData.imageUrl} alt="Actuelle" className="w-32 h-32 object-cover mx-auto rounded-xl shadow-sm mb-2" />
                      <span className="text-xs text-gray-500">Image actuelle. Cliquez pour remplacer.</span>
                    </div>
                  ) : (
                    <span className="text-4xl mb-2 block">📸</span>
                  )}
                  <span className="text-sm font-bold text-gray-700">Nouvelle Image (Optionnel)</span>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
                  {image && <span className="text-sm text-[#B57C4F] font-bold block bg-[#F2D0B4]/20 py-2 rounded-lg mt-2">{image.name}</span>}
                </label>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer block">
                  <span className="text-4xl mb-2 block">🎥</span>
                  <span className="text-sm font-bold text-gray-700">Nouvelle Vidéo (Optionnel)</span>
                  <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
                  {video && <span className="text-sm text-[#B57C4F] font-bold block bg-[#F2D0B4]/20 py-2 rounded-lg mt-2">{video.name}</span>}
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2D2D2D] hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-xl'}`}
          >
            {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
          </button>
          
        </form>
      </div>
    </div>
  );
}