"use client";

import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

const CurrencyContext = createContext();

// Configuration des pays
const COUNTRIES = {
  FR: { code: 'FR', name: 'France', currency: 'EUR', symbol: '€', locale: 'fr-FR', rate: 1 },
  CI: { code: 'CI', name: "Côte d'Ivoire", currency: 'XOF', symbol: 'FCFA', locale: 'fr-CI', rate: 655.957 },
};

export function CurrencyProvider({ children }) {
  const [countryCode, setCountryCode] = useState('FR');
  const [isReady, setIsReady] = useState(false);

  // 1. Hydratation propre pour Next.js (évite les erreurs de rendu serveur/client)
  useEffect(() => {
    const saved = localStorage.getItem('bm_country');
    if (saved && COUNTRIES[saved]) {
      setCountryCode(saved);
    }
    setIsReady(true);
  }, []);

  // 2. Persistance
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('bm_country', countryCode);
    }
  }, [countryCode, isReady]);

  const currentCountry = COUNTRIES[countryCode];

  // 3. Logique de conversion mémoïsée
  const convert = useCallback((priceEur) => {
    return Math.round(priceEur * currentCountry.rate);
  }, [currentCountry]);

  // 4. Formattage propre via Intl.NumberFormat
  const format = useCallback((priceEur) => {
    const convertedValue = convert(priceEur);
    
    // Pour le FCFA, on force souvent un format spécifique
    if (currentCountry.currency === 'XOF') {
        return `${convertedValue.toLocaleString('fr-FR')} FCFA`;
    }

    return new Intl.NumberFormat(currentCountry.locale, {
      style: 'currency',
      currency: currentCountry.currency,
    }).format(convertedValue);
  }, [currentCountry, convert]);

  // 5. Valeurs exposées (mémoïsées pour la performance)
  const value = useMemo(() => ({
    country: currentCountry,
    setCountry: setCountryCode,
    countries: Object.values(COUNTRIES),
    convert,
    format,
    isReady
  }), [currentCountry, convert, format, isReady]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency doit être utilisé au sein de CurrencyProvider");
    return context;
};