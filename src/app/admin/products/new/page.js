"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Ajouté pour la preview
import Link from 'next/link';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null); // Pour afficher l'image choisie avant l'envoi

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const json = await res.json();
        if (json.success) setCategories(json.data);
      } catch (error) {
        console.error("Erreur catégories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Gérer le changement d'image avec prévisualisation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Crée un lien temporaire pour voir l'image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.target);
    
    // On s'assure que les fichiers sont bien dans le FormData
    if (image) formData.set('image', image);
    if (video) formData.set('video', video);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData, // Le navigateur gère le Content-Type automatiquement pour le FormData
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Produit médical ajouté avec succès sur Cloudinary !' });
        e.target.reset();
        setImage(null);
        setVideo(null);
        setPreview(null);
      } else {
        setMessage({ type: 'error', text: result.error || 'Une erreur est survenue.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur Cloud.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Ajouter un <span className="text-[#B57C4F]">Produit</span></h1>
            <p className="text-gray-500">Tableau de bord administrateur</p>
          </div>
          <Link href="/shop" className="text-[#B57C4F] font-bold hover:underline">Voir boutique →</Link>
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
                <input type="text" name="name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prix (€)</label>
                  <input type="number" name="price" required min="0" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quantité Stock</label>
                  <input type="number" name="stockQuantity" required min="0" defaultValue="1" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie</label>
                <select name="category" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] appearance-none">
                  <option value="">-- Sélectionner --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fiche technique / Description</label>
                <textarea name="description" rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]"></textarea>
              </div>
            </div>

            <div className="space-y-6">
              {/* Image avec Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                <label className="cursor-pointer block">
                  {!preview ? (
                    <>
                      <span className="text-4xl mb-2 block">📸</span>
                      <span className="text-sm font-bold text-gray-700">Photo du produit</span>
                    </>
                  ) : (
                    <div className="mb-2 relative h-32 w-full">
                       <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Format recommandé: JPG/PNG</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Vidéo */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer block">
                  <span className="text-4xl mb-2 block">🎥</span>
                  <span className="text-sm font-bold text-gray-700">Vidéo de démo</span>
                  <input type="file" accept="video/mp4" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
                  {video && <span className="text-sm text-[#B57C4F] font-bold block mt-2">{video.name}</span>}
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg ${
              loading ? 'bg-gray-400' : 'bg-[#B57C4F] hover:bg-[#96653f]'
            }`}
          >
            {loading ? 'Upload en cours vers le Cloud...' : 'Publier dans la boutique'}
          </button>
        </form>
      </div>
    </div>
  );
}