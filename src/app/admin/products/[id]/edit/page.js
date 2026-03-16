"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = use(params); 
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: '', price: '', stockQuantity: '', category: '', description: '', imageUrl: '', videoUrl: ''
  });

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/admin/categories');
        const catJson = await catRes.json();
        if (catJson.success) setCategories(catJson.data);

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
            videoUrl: prodJson.data.videoUrl || '',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.target);
    // On ajoute les fichiers seulement s'ils ont été modifiés
    if (image) formData.set('image', image);
    if (video) formData.set('video', video);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Produit Bio Medical mis à jour avec succès !");
        router.push('/admin/products');
        router.refresh(); // Force la mise à jour des données côté client
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la modification.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur Cloud.' });
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="p-12 text-center text-gray-500 animate-pulse">Chargement de l'éditeur médical...</div>;

  return (
    <div className="p-6 md:p-12 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Modifier le <span className="text-[#B57C4F]">Produit</span></h1>
            <p className="text-gray-500 text-sm">Identifiant : {id}</p>
          </div>
          <Link href="/admin/products" className="text-gray-500 font-bold hover:text-[#B57C4F] transition-colors">
            ← Retour au catalogue
          </Link>
        </div>

        {message && (
          <div className={`p-4 mb-8 rounded-xl font-bold shadow-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                  <input type="number" name="price" defaultValue={productData.price} required min="0" step="0.01" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
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
              {/* Image Cloudinary avec Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-all">
                <label className="cursor-pointer block">
                  {imagePreview || productData.imageUrl ? (
                    <div className="mb-4">
                      <img 
                        src={imagePreview || productData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-40 object-contain mx-auto rounded-xl mb-2" 
                      />
                      <span className="text-xs text-[#B57C4F] font-bold">Cliquer pour modifier la photo</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-4xl mb-2 block">📸</span>
                      <span className="text-sm font-bold text-gray-700">Ajouter une image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Vidéo Cloudinary */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-all">
                <label className="cursor-pointer block">
                  <span className="text-4xl mb-2 block">🎥</span>
                  <span className="text-sm font-bold text-gray-700">
                    {productData.videoUrl && !video ? "Vidéo présente (cliquer pour remplacer)" : "Vidéo de présentation"}
                  </span>
                  <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
                  {video && <span className="text-xs text-[#B57C4F] font-bold block mt-2">{video.name}</span>}
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg ${loading ? 'bg-gray-400' : 'bg-[#2D2D2D] hover:bg-black hover:-translate-y-1'}`}
          >
            {loading ? 'Mise à jour sur Cloudinary...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}