import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D] overflow-x-hidden">
      
      {/* SECTION HERO (Inspirée de Gluta-Line) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Fond en panneaux verticaux (Image 2) */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-1/4 h-full bg-[#F2D0B4]/20 border-r border-white/50"></div>
          <div className="w-1/4 h-full bg-[#D49A6A]/10 border-r border-white/50"></div>
          <div className="w-1/4 h-full bg-[#B57C4F]/10 border-r border-white/50"></div>
          <div className="w-1/4 h-full bg-[#6A401D]/10"></div>
        </div>

        {/* Filigrane tournant (Image 2 : DUO LIPOSOMAL) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[25vw] font-black uppercase whitespace-nowrap">
            Yupi Global
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-7xl mx-auto">
          
          {/* Logo BM (Conservé mais affiné) */}
          <div className="relative mb-8 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow-xl">
            <Image 
              src="/BM.jpeg" 
              alt="Bio Medical Logo" 
              fill
              className="object-cover"
            />
          </div>

          <span className="text-sm font-bold tracking-[0.4em] uppercase mb-4 text-[#B57C4F]">
            Laboratoire Expert & Naturel
          </span>

          {/* Titre Massive (Image 2) */}
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] uppercase tracking-tighter">
            Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B57C4F] to-[#6A401D]">Naturel</span><br />
            & Liposomal
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
            Découvrez la pureté des compléments indiens. Une technologie liposomale 
            pour une absorption maximale et une santé préservée.
          </p>

          {/* Boutons Rectangulaires Minimalistes (Image 2) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/shop" 
              className="px-12 py-5 bg-[#2D2D2D] text-white font-bold tracking-widest uppercase hover:bg-[#B57C4F] transition-all duration-300 shadow-xl"
            >
              Explorer la boutique
            </Link>
            <button className="px-12 py-5 border-2 border-[#2D2D2D] text-[#2D2D2D] font-bold tracking-widest uppercase hover:bg-gray-50 transition-all">
              En savoir plus
            </button>
          </div>
        </div>

        {/* Watermark Yupi Global (Bas de page) */}
        <div className="absolute bottom-10 left-0 w-full text-center opacity-10 pointer-events-none">
          <span className="text-6xl md:text-9xl font-black uppercase tracking-[1em]">YUPI</span>
        </div>
      </section>

      {/* --- Insertion du Footer --- */}
      <Footer />
    </div>
  );
}