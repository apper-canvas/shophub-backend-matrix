import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { wishlistService } from "@/services/api/wishlistService";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart, loadWishlist } = useOutletContext();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlistProducts();
  }, []);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const wishlistIds = await wishlistService.getAll();
      
      if (wishlistIds.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      const allProducts = await productService.getAll({ limit: 1000 });
      const products = allProducts.products.filter(product => 
        wishlistIds.includes(product.Id)
      );

      setWishlistProducts(products);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setError("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistService.remove(productId);
      setWishlistProducts(prev => prev.filter(p => p.Id !== productId));
      await loadWishlist();
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (wishlistProducts.length === 0) {
    return (
      <Empty
        icon="Heart"
        title="Your wishlist is empty"
        message="Save items you love to your wishlist and shop them later."
        actionText="Continue Shopping"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amazon-dark mb-2">Your Wishlist</h1>
        <p className="text-gray-600">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => {
          const hasPriceDrop = product.originalPrice && product.originalPrice > product.price;
          
          return (
            <div
              key={product.Id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              <div className="relative">
                {hasPriceDrop && (
                  <div className="absolute top-2 left-2 z-10 bg-amazon-success text-white px-3 py-1 rounded-md text-xs font-semibold">
                    Price dropped!
                  </div>
                )}
                {product.isPrime && (
                  <div className="absolute top-2 right-2 z-10 prime-badge">
                    prime
                  </div>
                )}
                <div 
                  className="aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => handleViewProduct(product.Id)}
                >
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 
                  className="text-sm font-medium text-amazon-dark line-clamp-2 mb-2 cursor-pointer hover:text-amazon-orange transition-colors"
                  onClick={() => handleViewProduct(product.Id)}
                >
                  {product.title}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center text-amazon-orange">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon
                        key={i}
                        name="Star"
                        size={14}
                        className={i < Math.floor(product.rating) ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({product.reviewCount.toLocaleString()})
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="price-current text-xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="price-original text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-amazon-success text-sm font-semibold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => handleAddToCart(product.Id)}
                    disabled={!product.inStock}
                    className="w-full bg-amazon-orange hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <ApperIcon name="ShoppingCart" size={16} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(product.Id)}
                    className="w-full border border-gray-300 hover:border-amazon-orange hover:text-amazon-orange text-gray-700 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ApperIcon name="Trash2" size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;