import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }) {
  await dbConnect();
  
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || 'Tous';

  const query = currentCategory === 'Tous' ? {} : { category: currentCategory };
  
  const [rawProducts, dbCategories] = await Promise.all([
    Product.find(query).lean(),
    Category.find({}).sort({ name: 1 }).lean()
  ]);

  const products = rawProducts.map((product) => ({
    ...product,
    _id: product._id.toString(), 
  }));

  const categories = ['Tous', ...dbCategories.map(cat => cat.name)];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#2D2D2D]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative bg-[#F9F7F5] pt-24 pb-16 px-6 overflow-hidden">
        {/* Décoration subtile en fond */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2D0B4]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          
          {/* --- OPTION DE SUIVI DE COMMANDE --- */}
          <div className="mb-8 inline-block">
            <Link 
              href="/track-order" 
              className="group flex items-center gap-3 bg-white border border-gray-100 px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">📦</span>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none">Déjà commandé ?</p>
                <p className="text-[11px] font-bold text-[#B57C4F]">Suivre mon colis →</p>
              </div>
            </Link>
          </div>

          <span className="block text-[#B57C4F] font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
            Bio Medical
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#2D2D2D] mb-12 tracking-tighter">
            La Boutique<span className="text-[#B57C4F]">.</span>
          </h1>
          
          {/* BARRE DE FILTRAGE ÉLÉGANTE */}
          <div className="flex justify-center items-center">
            <div className="flex gap-2 md:gap-8 overflow-x-auto no-scrollbar pb-2 mask-linear-gradient">
              {categories.map((cat) => (
                <Link 
                  key={cat}
                  href={cat === 'Tous' ? '/shop' : `/shop?category=${cat}`}
                  className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                    currentCategory === cat 
                      ? "bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-lg shadow-black/10" 
                      : "bg-transparent text-gray-400 border-transparent hover:text-[#B57C4F]"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE PRODUITS --- */}
      <main className="max-w-7xl mx-auto py-20 px-6">
        
        {products.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <span className="text-6xl block mb-6 opacity-40">🌿</span>
            <p className="text-gray-400 font-medium tracking-tight italic">
              Nous préparons de nouveaux soins dans cette catégorie...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <div key={product._id} className="group relative">
                
                {/* Conteneur Image avec survol "Lift" */}
                <Link href={`/shop/${product._id}`} className="block relative aspect-[4/5] mb-6 overflow-hidden rounded-[2rem] bg-white border border-gray-100 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:-translate-y-2">
                  
                  {/* Badge Catégorie discret */}
                  <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-[#B57C4F]">
                    {product.category}
                  </div>

                  <div className="w-full h-full flex items-center justify-center p-10 transition-transform duration-700 group-hover:scale-110">
                    {product.imageUrl ? (
                      <Image 
                        src={product.imageUrl} 
                        alt={product.name} 
                        width={300} 
                        height={300} 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <span className="text-7xl drop-shadow-sm">💊</span>
                    )}
                  </div>

                  {/* Bouton "Aperçu rapide" au survol sur Desktop */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-[#2D2D2D] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Voir le produit
                    </span>
                  </div>
                </Link>

                {/* Infos Produit */}
                <div className="text-center px-2">
                  <h3 className="text-sm font-black text-[#2D2D2D] uppercase tracking-tight mb-2 group-hover:text-[#B57C4F] transition-colors leading-tight min-h-[40px]">
                    {product.name}
                  </h3>
                  
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-lg font-bold text-[#2D2D2D]">
                      {product.price.toLocaleString('fr-FR')} <span className="text-md text-[#B57C4F] ml-1">€</span>
                    </p>
                    
                    <div className="w-full max-w-[140px]">
                      <AddToCartButton 
                        product={product} 
                        isAvailable={product.stockQuantity > 0} 
                        showText={false} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}