import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cartService } from "@/services/api/cartService";
import CategoryNav from "@/components/organisms/CategoryNav";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import CartDrawer from "@/components/organisms/CartDrawer";
const Layout = () => {
  const location = useLocation();
const [cartItems, setCartItems] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

useEffect(() => {
    loadCartItems();
    loadWishlist();
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

  const loadWishlist = async () => {
    try {
      const { wishlistService } = await import("@/services/api/wishlistService");
      const wishlistIds = await wishlistService.getAll();
      setWishlistCount(wishlistIds.length);
    } catch (error) {
      console.error("Error loading wishlist:", error);
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

  const contextValue = {
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    cartCount,
    loadCartItems,
    cartItems,
    loadWishlist
  };

  // Hide category nav on cart and checkout pages
  const hideCategoryNav = ["/cart", "/checkout"].some(path =>
    location.pathname.startsWith(path)
  );

return (
    <div className="min-h-screen bg-background">
<Header 
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
      
      {!hideCategoryNav && <CategoryNav />}
      
      <main className="min-h-screen">
        <Outlet context={{ 
          addToCart,
          cartItems,
          updateCartItem,
          removeFromCart,
          clearCart,
          cartCount,
          loadCartItems
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