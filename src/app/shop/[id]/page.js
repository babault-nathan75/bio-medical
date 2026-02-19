import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductDetails({ params }) {
  // Récupération de l'ID depuis l'URL
  const { id } = params;

  await dbConnect();

  let product = null;
  try {
    product = await Product.findById(id).lean();
  } catch (error) {
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
            
            {/* Badge de stock */}
            {!isAvailable && (
              <div className="absolute top-6 left-6 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                En Rupture de Stock
              </div>
            )}

            {/* Logique d'affichage Multimédia */}
            {product.videoUrl ? (
              // Si on a une vidéo, on affiche le lecteur (avec l'image en miniature si dispo)
              <div className="w-full rounded-2xl shadow-2xl overflow-hidden border-4 border-white relative group bg-black flex items-center justify-center">
                <video 
                  src={product.videoUrl} 
                  controls 
                  poster={product.imageUrl || ''} // L'image sert de miniature (thumbnail)
                  className="w-full max-h-[450px] object-contain"
                />
              </div>
            ) : product.imageUrl ? (
              // S'il n'y a pas de vidéo mais une image, on affiche l'image
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="object-cover rounded-3xl shadow-xl max-h-[450px] transform hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              // S'il n'y a ni vidéo ni image, on affiche l'émoji par défaut
              <span className="text-9xl drop-shadow-2xl transform hover:scale-110 transition-transform duration-500">
                💊
              </span>
            )}
          </div>

          {/* Section Détails (Droite) */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#F2D0B4]/30 text-[#B57C4F] font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-[#2D2D2D] mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line">
                {product.description || "Aucune description disponible pour ce produit. Il s'agit d'un soin de qualité proposé par Bio Medical."}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2 mb-8">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-[#2D2D2D]">
                  {product.price.toLocaleString('fr-FR')}
                </span>
                <span className="text-xl text-gray-400 font-medium mb-1">€</span>
              </div>
              <p className={`text-sm mt-2 font-medium ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {isAvailable ? `En stock (${product.stockQuantity} disponibles)` : 'Indisponible pour le moment'}
              </p>
            </div>

            {/* Bouton Panier */}
            <AddToCartButton 
              product={{
                _id: product._id.toString(),
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category
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