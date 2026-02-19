"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoriesCRUD() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null); // Si null = Création, sinon = Modification
  const [loading, setLoading] = useState(false);

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const json = await res.json();
    if (json.success) setCategories(json.data);
  };

  // Gérer la soumission du formulaire (Création OU Modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (json.success) {
        setFormData({ name: '', description: '' }); // Reset
        setEditingId(null); // Sortie du mode édition
        fetchCategories(); // Recharger la liste
      } else {
        alert("Erreur lors de l'enregistrement. Le nom existe peut-être déjà.");
      }
    } catch (error) {
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Pré-remplir le formulaire pour modification
  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingId(category._id);
  };

  // Annuler la modification
  const handleCancelEdit = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  // Supprimer une catégorie
  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2D2D2D]">Gestion des <span className="text-[#B57C4F]">Catégories</span></h1>
            <p className="text-gray-500">Ajouter, modifier ou supprimer des catégories de produits.</p>
          </div>
          <Link href="/admin/products/new" className="text-gray-500 hover:text-[#B57C4F] font-medium transition-colors">
            ← Retour aux produits
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Colonne Gauche : Formulaire */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 sticky top-10">
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 border-b border-gray-50 pb-4">
                {editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F]"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-md ${loading ? 'bg-gray-400' : 'bg-[#2D2D2D] hover:bg-[#B57C4F]'}`}
                >
                  {loading ? 'En cours...' : (editingId ? 'Mettre à jour' : 'Ajouter')}
                </button>

                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="w-full py-3 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Colonne Droite : Liste des Catégories */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">Catégories existantes</h2>
              
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-10">Aucune catégorie trouvée.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-gray-50">
                      <h3 className="text-lg font-bold text-[#B57C4F]">{cat.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-2">
                        {cat.description || "Aucune description"}
                      </p>
                      
                      <div className="flex gap-2 border-t border-gray-200 pt-3">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="flex-1 text-sm font-bold text-[#2D2D2D] bg-white py-2 rounded-lg border border-gray-200 hover:border-[#B57C4F] transition-colors"
                        >
                          Éditer
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id)}
                          className="flex-1 text-sm font-bold text-red-500 bg-red-50 py-2 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}