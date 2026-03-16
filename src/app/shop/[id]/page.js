import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductDetails({ params }) {
  // 1. MODIFICATION CRUCIALE : Attendre les params
  const resolvedParams = await params;
  const { id } = resolvedParams;

  await dbConnect();

  let product = null;
  try {
    // 2. Utilisation de .lean() pour transformer le document Mongoose en objet JS pur
    product = await Product.findById(id).lean();
  } catch (error) {
    console.error("ID de produit invalide ou erreur DB:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const isAvailable = product.stockQuantity > 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      
      <Navbar backLink="/shop" />

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Section Multimédia (Gauche) */}
          <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-[#F2D0B4]/20 flex flex-col items-center justify-center p-8 md:p-12 min-h-[400px] md:min-h-[500px] relative">
            
            {!isAvailable && (
              <div className="absolute top-6 left-6 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                En Rupture
              </div>
            )}

            {product.videoUrl ? (
              <div className="w-full rounded-2xl shadow-2xl overflow-hidden border-4 border-white relative group bg-black flex items-center justify-center">
                <video 
                  src={product.videoUrl} 
                  controls 
                  poster={product.imageUrl || ''} 
                  className="w-full max-h-[450px] object-contain"
                />
              </div>
            ) : product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="object-cover rounded-3xl shadow-xl max-h-[450px] transform hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <span className="text-9xl drop-shadow-2xl">💊</span>
            )}
          </div>

          {/* Section Détails (Droite) */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#F2D0B4]/30 text-[#B57C4F] font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                {product.category || "Général"}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-[#2D2D2D] mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line">
                {product.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2 mb-8">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-[#2D2D2D]">
                  {product.price?.toLocaleString('fr-FR')}
                </span>
                <span className="text-xl text-gray-400 font-medium mb-1">€</span>
              </div>
              <p className={`text-sm mt-2 font-medium ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {isAvailable ? `En stock (${product.stockQuantity} disponibles)` : 'Indisponible'}
              </p>
            </div>

            {/* 3. Sécurisation de l'ID pour le composant Client */}
            <AddToCartButton 
              product={{
                ...product,
                _id: product._id.toString(), // Important : convertir l'ObjectId en String
              }} 
              isAvailable={isAvailable} 
              showText={true} 
            />

          </div>
        </div>
      </main>
    </div>
  );
}