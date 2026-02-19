"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // NOUVEAU : État pour stocker les catégories
  const [categories, setCategories] = useState([]);
  
  // Les états pour les fichiers
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  // NOUVEAU : Charger les catégories depuis MongoDB au montage de la page
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.target);
    
    if (image) formData.set('image', image);
    if (video) formData.set('video', video);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Produit ajouté avec succès !' });
        e.target.reset(); // On vide le formulaire
        setImage(null);
        setVideo(null);
      } else {
        setMessage({ type: 'error', text: result.error || 'Une erreur est survenue.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête de l'Admin */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Ajouter un <span className="text-[#B57C4F]">Produit</span></h1>
            <p className="text-gray-500">Tableau de bord administrateur</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/categories" className="text-gray-500 font-bold hover:text-[#B57C4F] hover:underline transition-colors">
              Gérer les catégories
            </Link>
            <Link href="/shop" className="text-[#B57C4F] font-bold hover:underline">
              Voir la boutique →
            </Link>
          </div>
        </div>

        {/* Messages d'alerte */}
        {message && (
          <div className={`p-4 mb-8 rounded-xl font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Le Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Informations Texte */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom du produit</label>
                <input type="text" name="name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prix (FCFA)</label>
                  <input type="number" name="price" required min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock initial</label>
                  <input type="number" name="stockQuantity" required min="0" defaultValue="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                <select name="category" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]">
                  <option value="">-- Sélectionnez une catégorie --</option>
                  {/* Génération dynamique des options */}
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">Aucune catégorie trouvée. Veuillez en créer une d'abord.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea name="description" rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]"></textarea>
              </div>
            </div>

            {/* Fichiers Multimédia */}
            <div className="space-y-6">
              
              {/* Upload Image */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer block">
                  <span className="text-4xl mb-2 block">📸</span>
                  <span className="text-sm font-bold text-gray-700">Image du produit</span>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Cliquez pour choisir une image</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    className="hidden" 
                  />
                  {image && <span className="text-sm text-[#B57C4F] font-bold block bg-[#F2D0B4]/20 py-2 rounded-lg">{image.name}</span>}
                </label>
              </div>

              {/* Upload Vidéo */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer block">
                  <span className="text-4xl mb-2 block">🎥</span>
                  <span className="text-sm font-bold text-gray-700">Vidéo de présentation (Optionnel)</span>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Format MP4 (Max 10Mo recommandé)</p>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={(e) => setVideo(e.target.files[0])} 
                    className="hidden" 
                  />
                  {video && <span className="text-sm text-[#B57C4F] font-bold block bg-[#F2D0B4]/20 py-2 rounded-lg">{video.name}</span>}
                </label>
              </div>

            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || categories.length === 0}
            className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg ${loading || categories.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2D2D2D] hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-xl'}`}
          >
            {loading ? 'Enregistrement en cours...' : 'Ajouter le produit à la boutique'}
          </button>
          
        </form>
      </div>
    </div>
  );
}