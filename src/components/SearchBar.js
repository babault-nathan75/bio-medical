"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Price from '@/components/Price';

const MAX_SUGGESTIONS = 6;

function normalize(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // retire les accents
}

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Chargement paresseux : on ne ramène la liste qu'au premier focus
  const ensureLoaded = async () => {
    if (loaded || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data || []);
        setLoaded(true);
      }
    } catch (e) {
      // silencieux : la recherche restera vide
    } finally {
      setLoading(false);
    }
  };

  // Ferme le menu quand on clique en dehors
  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return products
      .filter((p) => {
        const hay = `${normalize(p.name)} ${normalize(p.category)} ${normalize(p.description)}`;
        return hay.includes(q);
      })
      .slice(0, MAX_SUGGESTIONS);
  }, [query, products]);

  const submitFullSearch = (term) => {
    const value = (term ?? query).trim();
    setOpen(false);
    setActiveIndex(-1);
    if (value) {
      router.push(`/shop?search=${encodeURIComponent(value)}`);
    } else {
      router.push('/shop');
    }
  };

  const goToProduct = (productId) => {
    setOpen(false);
    setActiveIndex(-1);
    router.push(`/shop/${productId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToProduct(suggestions[activeIndex]._id);
    } else {
      submitFullSearch();
    }
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            ensureLoaded();
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un soin..."
          autoComplete="off"
          aria-autocomplete="list"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="searchbar-suggestions"
          className="pl-10 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#B57C4F] focus:ring-1 focus:ring-[#B57C4F] transition-all w-64"
        />
        <button
          type="submit"
          aria-label="Lancer la recherche"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B57C4F] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {query && (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => {
              setQuery('');
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </form>

      {showDropdown && (
        <div
          id="searchbar-suggestions"
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
        >
          {loading && !loaded && (
            <div className="p-4 text-center text-xs text-gray-400">Chargement du catalogue...</div>
          )}

          {loaded && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              Aucun résultat pour <span className="font-bold text-[#2D2D2D]">&laquo; {query} &raquo;</span>
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className="max-h-96 overflow-y-auto">
              {suggestions.map((p, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <li key={p._id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToProduct(p._id)}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                        isActive ? 'bg-[#F2D0B4]/30' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-xl">💊</span>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#B57C4F] truncate">
                          {p.category || 'Soin'}
                        </div>
                        <div className="text-sm font-bold text-[#2D2D2D] truncate">{p.name}</div>
                      </div>
                      <div className="text-sm font-black text-[#2D2D2D] shrink-0">
                        <Price amount={p.price} symbolClassName="text-xs text-gray-400 font-medium" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {suggestions.length > 0 && (
            <Link
              href={`/shop?search=${encodeURIComponent(query.trim())}`}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-bold text-[#B57C4F] py-3 border-t border-gray-100 hover:bg-[#F2D0B4]/20 transition-colors uppercase tracking-widest"
            >
              Voir tous les résultats →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
