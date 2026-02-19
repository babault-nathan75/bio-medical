import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';
import Footer from '@/components/Footer';

export default async function ShopPage() {
  await dbConnect();
  const products = await Product.find({}).lean();

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2D2D]">
      <Navbar />

      {/* Hero Boutique Style Solage */}
      <div className="bg-[#F9F7F5] py-16 px-6 text-center border-b border-gray-100">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-4">Nos Produits</h1>
        <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400 overflow-x-auto pb-4">
          <span className="text-[#B57C4F] border-b border-[#B57C4F] pb-1 cursor-pointer">Tous</span>
          <span className="hover:text-[#B57C4F] cursor-pointer">Énergie</span>
          <span className="hover:text-[#B57C4F] cursor-pointer">Digestion</span>
          <span className="hover:text-[#B57C4F] cursor-pointer">Soin</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.map((product) => (
            <div key={product._id} className="group flex flex-col items-center">
              {/* Image circulaire ou carrée épurée */}
              <div className="relative w-full aspect-square bg-[#F9F7F5] mb-6 flex items-center justify-center overflow-hidden rounded-sm transition-all group-hover:bg-white group-hover:shadow-xl">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-2/3 object-contain" />
                ) : (
                  <span className="text-6xl">💊</span>
                )}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-center">{product.name}</h3>
              <p className="text-[#B57C4F] font-bold mt-2">{product.price.toLocaleString()} €</p>
              
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <AddToCartButton product={product} isAvailable={product.stockQuantity > 0} showText={true} />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}