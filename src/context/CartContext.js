"use client"; // Indispensable car on utilise des hooks React (useState, useEffect)

import { createContext, useState, useEffect, useContext } from 'react';

// Création du contexte
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Fonction pour vider le panier après une commande
  const clearCart = () => {
    setCart([]);
  };

  // 1. Au chargement du site, on récupère le panier sauvegardé dans le navigateur
  useEffect(() => {
    const savedCart = localStorage.getItem('bm_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 2. À chaque modification du panier, on le sauvegarde dans le navigateur
  useEffect(() => {
    localStorage.setItem('bm_cart', JSON.stringify(cart));
  }, [cart]);

  // Fonction pour ajouter un produit
  const addToCart = (product) => {
    setCart((prevCart) => {
      // On vérifie si le produit est déjà dans le panier
      const existingProduct = prevCart.find(item => item._id === product._id);
      
      if (existingProduct) {
        // S'il y est déjà, on augmente juste la quantité
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Sinon on l'ajoute avec une quantité de 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Fonction pour retirer un produit
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  // Calcul du nombre total d'articles pour la petite bulle rouge dans la Navbar
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
    
  );
}

// Un petit hook personnalisé pour utiliser le panier facilement partout
export const useCart = () => useContext(CartContext);