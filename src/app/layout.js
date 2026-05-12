import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bio Medical | Yupi Global",
  description: "La santé au cœur de notre priorité.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <CurrencyProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}