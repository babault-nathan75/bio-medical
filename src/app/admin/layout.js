"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  // usePathname nous permet de savoir sur quelle page on est pour colorer le bon bouton
  const pathname = usePathname();

  const navItems = [
    { name: 'Commandes', href: '/admin/orders', icon: '📦' },
    { name: 'Produits', href: '/admin/products', icon: '💊' }, // <-- Modifié ici
    { name: 'Catégories', href: '/admin/categories', icon: '🏷️' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F9FA] font-sans">
      
      {/* Barre de navigation latérale (Sidebar) */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 md:h-screen shadow-sm z-50">
        
        {/* Logo Admin */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-center md:justify-start">
          <h2 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
            BM <span className="text-[#B57C4F]">ADMIN</span>
          </h2>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto flex flex-row md:flex-col gap-2 md:gap-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm md:text-base ${
                  isActive 
                    ? 'bg-[#B57C4F] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-[#F2D0B4]/20 hover:text-[#B57C4F]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bouton retour à la boutique en bas */}
        <div className="p-4 border-t border-gray-100 hidden md:block">
          <Link 
            href="/shop" 
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#2D2D2D] rounded-xl transition-all font-bold"
          >
            <span className="text-xl">🏬</span>
            Voir la boutique
          </Link>
        </div>
      </aside>

      {/* Zone de contenu principal (C'est ici que tes pages vont s'afficher) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}