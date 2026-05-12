"use client";

import { useCurrency } from '@/context/CurrencyContext';

function FlagFR({ className = "" }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );
}

function FlagCI({ className = "" }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#F77F00" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#009E60" />
    </svg>
  );
}

function FlagSN({ className = "" }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#00853F" />
      <rect width="1" height="2" x="1" fill="#FDEF42" />
      <rect width="1" height="2" x="2" fill="#E31B23" />
    </svg>
  );
}

const FLAGS = {
  FR: FlagFR,
  CI: FlagCI,
  SN: FlagSN,
};

export default function CountrySelector() {
  const { country, setCountry, countries, isReady } = useCurrency();

  const base = "w-9 h-6 rounded-md overflow-hidden border-2 transition-all hover:scale-110";
  const active = "border-[#B57C4F] shadow-md scale-105";
  const inactive = "border-gray-200 opacity-60 hover:opacity-100";

  return (
    <div className="flex items-center gap-2" title="Choisir la devise">
      {countries.map((c) => {
        const Flag = FLAGS[c.code];
        if (!Flag) return null;
        const isActive = isReady && country.code === c.code;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => setCountry(c.code)}
            aria-label={`Afficher les prix en ${c.symbol} (${c.name})`}
            className={`${base} ${isActive ? active : inactive}`}
          >
            <Flag className="w-full h-full" />
          </button>
        );
      })}
    </div>
  );
}
