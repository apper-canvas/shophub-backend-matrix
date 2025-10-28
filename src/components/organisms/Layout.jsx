import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/organisms/Header";
import CategoryNav from "@/components/organisms/CategoryNav";
import Footer from "@/components/organisms/Footer";
import CartDrawer from "@/components/organisms/CartDrawer";
import { cartService } from "@/services/api/cartService";

const Layout = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await cartService.getAll();
      setCartItems(items);
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  const addToCart = async (productId, quantity = 1, selectedOptions = {}) => {
    try {
      await cartService.addItem(productId, quantity, selectedOptions);
      await loadCartItems();
      setIsCartOpen(true);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await cartService.removeItem(productId);
      } else {
        await cartService.updateQuantity(productId, quantity);
      }
      await loadCartItems();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeItem(productId);
      await loadCartItems();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clear();
      await loadCartItems();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Hide category nav on cart and checkout pages
  const hideCategoryNav = ["/cart", "/checkout"].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      {!hideCategoryNav && <CategoryNav />}
      
      <main className="min-h-screen">
        <Outlet context={{ 
          addToCart,
          cartItems,
          updateCartItem,
          removeFromCart,
          clearCart,
          cartCount
        }} />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartItem}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </div>
  );
};

export default Layout;