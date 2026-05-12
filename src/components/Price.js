"use client";

import { useCurrency } from '@/context/CurrencyContext';

export default function Price({ amount, className = "", symbolClassName = "" }) {
  const { country, convert, isReady } = useCurrency();

  // Avant hydratation : on rend la version EUR pour éviter le mismatch SSR/CSR.
  if (!isReady) {
    return (
      <span className={className}>
        {amount.toLocaleString('fr-FR')}
        <span className={symbolClassName ? `ml-1 ${symbolClassName}` : "ml-1"}>€</span>
      </span>
    );
  }

  const value = convert(amount);

  return (
    <span className={className}>
      {value.toLocaleString('fr-FR')}
      <span className={symbolClassName ? `ml-1 ${symbolClassName}` : "ml-1"}>{country.symbol}</span>
    </span>
  );
}
