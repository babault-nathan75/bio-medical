import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D] overflow-x-hidden">
      
      {/* SECTION HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Fond en panneaux verticaux */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-1/4 h-full bg-[#F2D0B4]/20 border-r border-white/50"></div>
          <div className="w-1/4 h-full bg-[#D49A6A]/10 border-r border-white/50"></div>
          <div className="w-1/4 h-full bg-[#B57C4F]/10 border-r border-white/50"></div>
          <div className="w-1/4 h-full bg-[#6A401D]/10"></div>
        </div>

        {/* Filigrane central (Réduit de 25vw à 18vw) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[18vw] font-black uppercase whitespace-nowrap">
            Yupi Global Yupi Global
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          
          {/* Logo BM (Dimensions réduites pour plus de finesse) */}
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-[-8px] rounded-full bg-[#F2D0B4]/30 animate-pulse blur-md"></div>
            <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow-xl">
              <Image 
                src="/BM.jpeg" 
                alt="Bio Medical Logo" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 text-[#B57C4F]">
            Laboratoire Expert & Naturel
          </span>

          {/* Titre (Passage de 9xl à 7xl max pour un look plus "magazine") */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.9] uppercase tracking-tighter">
            Votre santé <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B57C4F] to-[#6A401D]">au cœur</span><br />
            de notre priorité
          </h1>
          
          {/* Sous-titre (Réduit de xl à base/lg) */}
          <p className="text-gray-500 text-sm md:text-base max-w-xl mb-10 font-medium leading-relaxed">
            Explorez notre sélection de médicaments bio indien de haute qualité. 
            Votre santé, notre priorité.
          </p>

          {/* Boutons (Paddings réduits px-12 -> px-8) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/shop" 
              className="px-8 py-4 bg-[#2D2D2D] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#B57C4F] transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              VOIR LA BOUTIQUE <span>→</span>
            </Link>
            <button className="px-8 py-4 border-2 border-[#2D2D2D] text-[#2D2D2D] text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-all">
              En savoir plus
            </button>
          </div>
        </div>

        {/* Watermark Yupi Global de bas de page (Réduit de 9xl à 6xl) */}
        <div className="absolute bottom-10 left-0 w-full text-center opacity-[0.05] pointer-events-none">
          <span className="text-4xl md:text-6xl font-black uppercase tracking-[1em]">YUPI</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}