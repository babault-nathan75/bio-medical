import { Inter } from "next/font/google";
import "./globals.css";
// On importe notre Provider
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bio Medical | Yupi Global",
  description: "La santé au cœur de notre priorité.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* On englobe les enfants (toutes les pages) avec le CartProvider */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}