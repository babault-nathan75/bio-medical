import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category'; // <-- Ajout du modèle Category
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }) {
  await dbConnect();
  
  // 1. Déballage de la promesse searchParams (Requis dans Next.js 16)
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || 'Tous';

  // 2. Création de la requête MongoDB pour les produits
  const query = currentCategory === 'Tous' ? {} : { category: currentCategory };
  
  // 3. Récupération PARALLÈLE des produits et des catégories de l'admin
  const [rawProducts, dbCategories] = await Promise.all([
    Product.find(query).lean(),
    Category.find({}).sort({ name: 1 }).lean() // On trie par ordre alphabétique
  ]);

  // 4. Transformation des données pour le Client Component
  const products = rawProducts.map((product) => ({
    ...product,
    _id: product._id.toString(), 
  }));

  // 5. Création dynamique de la liste des catégories (en gardant 'Tous' en premier)
  const categories = ['Tous', ...dbCategories.map(cat => cat.name)];

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D]">
      <Navbar />

      {/* Hero Boutique Style Solage */}
      <div className="bg-[#F9F7F5] py-16 px-6 text-center border-b border-gray-100">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">Nos Produits</h1>
        
        {/* BOUTONS DE FILTRAGE DYNAMIQUES */}
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <Link 
              key={cat}
              // Si "Tous", on nettoie l'URL. Sinon on ajoute le paramètre category
              href={cat === 'Tous' ? '/shop' : `/shop?category=${cat}`}
              className={`pb-1 transition-colors cursor-pointer whitespace-nowrap ${
                currentCategory === cat 
                  ? "text-[#B57C4F] border-b border-[#B57C4F]" // Style Actif
                  : "hover:text-[#B57C4F]" // Style Inactif
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-16 px-6">
        
        {/* Message si aucun produit n'est trouvé dans la catégorie */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <span className="text-4xl block mb-4">🌱</span>
            <p>Aucun produit disponible dans la catégorie &quot;{currentCategory}&quot; pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              <div key={product._id} className="group flex flex-col items-center">
                
                {/* Image avec lien vers les détails */}
                <Link href={`/shop/${product._id}`} className="w-full">
                  <div className="relative w-full aspect-square bg-[#F9F7F5] mb-6 flex items-center justify-center overflow-hidden rounded-sm transition-all group-hover:bg-white group-hover:shadow-xl border border-transparent group-hover:border-gray-100">
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="w-2/3 object-contain" />
                    ) : (
                      <span className="text-6xl">💊</span>
                    )}
                  </div>
                </Link>

                <h3 className="text-sm font-bold uppercase tracking-wider text-center h-10">{product.name}</h3>
                
                <p className="text-[#B57C4F] font-bold mt-2">
                  {product.price.toLocaleString('fr-FR')} €
                </p>
                
                {/* Le bouton Ajouter au panier */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <AddToCartButton 
                    product={product} 
                    isAvailable={product.stockQuantity > 0} 
                    showText={true} 
                  />
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