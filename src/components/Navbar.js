"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CountrySelector from '@/components/CountrySelector';
import SearchBar from '@/components/SearchBar';

export default function Navbar({ backLink = "/" }) {
  const { totalItems } = useCart();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-6">
        <Link href={backLink} className="text-gray-400 hover:text-[#B57C4F] transition-colors flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="hidden sm:inline text-sm font-medium">Retour</span>
        </Link>
        <h2 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
          BM <span className="text-[#B57C4F]">SHOP</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar />

        <CountrySelector />

        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#B57C4F] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>

          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B57C4F] text-white text-xs font-bold flex items-center justify-center rounded-full animate-bounce-short">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
