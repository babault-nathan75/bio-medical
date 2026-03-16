"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 1. Chargement initial
  useEffect(() => {
    const savedCart = localStorage.getItem('bm_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur lors du parsing du panier", e);
      }
    }
  }, []);

  // 2. Sauvegarde auto
  useEffect(() => {
    localStorage.setItem('bm_cart', JSON.stringify(cart));
  }, [cart]);

  // Ajouter au panier avec vérification de stock
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item._id === product._id);
      
      if (existingProduct) {
        // --- VÉRIFICATION DU STOCK ---
        if (existingProduct.quantity >= product.stockQuantity) {
          alert(`Désolé, seulement ${product.stockQuantity} unités sont disponibles pour ce produit.`);
          return prevCart;
        }

        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  // Mettre à jour la quantité avec vérification de stock
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === productId) {
          // --- VÉRIFICATION DU STOCK ---
          if (newQuantity > item.stockQuantity) {
            alert(`Stock limité : Vous ne pouvez pas commander plus de ${item.stockQuantity} articles.`);
            return item; // On retourne l'item sans modifier sa quantité
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);