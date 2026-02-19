"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.success) {
        // Redirection vers le tableau de bord si succès
        router.push('/admin/orders');
        router.refresh(); // Force Next.js à recharger l'état de la page
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 text-2xl font-black text-[#2D2D2D] tracking-tight">
        BM <span className="text-[#B57C4F]">ADMIN</span>
      </Link>
      
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Accès Sécurisé</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">Veuillez entrer votre mot de passe pour accéder au tableau de bord.</p>
        
        {error && (
          <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-lg text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#B57C4F] focus:ring-2 focus:ring-[#B57C4F]/20 transition-all text-center tracking-widest"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2D2D2D] hover:bg-[#1a1a1a] hover:-translate-y-1'}`}
          >
            {loading ? 'Vérification...' : 'Déverrouiller'}
          </button>
        </form>
      </div>
    </div>
  );
}