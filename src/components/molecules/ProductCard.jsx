import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onClick, 
  showBestseller = false,
  showNew = false,
  className = "" 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAddingToCart || !onAddToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const fallbackImage = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format`;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      <div className="relative p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {showBestseller && (
            <span className="bg-amazon-success text-white text-xs px-2 py-1 rounded-full font-medium">
              #1 Best Seller
            </span>
          )}
          {showNew && (
            <span className="bg-amazon-info text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-amazon-error text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Prime Badge */}
        {product.isPrime && (
          <div className="absolute top-2 right-2 z-10">
            <span className="prime-badge">PRIME</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          style={{ marginTop: product.isPrime ? "24px" : "0" }}
        >
          <ApperIcon name="Heart" size={16} className="text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton"></div>
          )}
          
          <img
            src={imageError ? fallbackImage : (product.images[0] || fallbackImage)}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
          
          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product.inStock}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-amazon-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAddingToCart ? (
              <div className="spinner border-white w-4 h-4"></div>
            ) : (
              <>
                <ApperIcon name="Plus" size={14} />
                Quick Add
              </>
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-medium text-amazon-dark text-sm line-clamp-2 leading-tight">
            {product.title}
          </h3>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-amazon-info font-medium">
              {product.brand}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <ApperIcon
                  key={star}
                  name="Star"
                  size={12}
                  className={star <= Math.floor(product.rating) ? "star-filled" : "star-empty"}
                  fill={star <= Math.floor(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviewCount?.toLocaleString() || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="price-current text-lg font-semibold">
              ${product.price.toFixed(2)}
            </span>
            
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="price-original text-sm">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <div className="text-xs">
              {product.inStock ? (
                <span className="text-amazon-success font-medium">
                  In Stock
                  {product.stockCount && product.stockCount < 10 && (
                    <span className="text-amazon-warning ml-1">
                      (Only {product.stockCount} left)
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-amazon-error font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {product.isPrime && (
              <div className="text-xs text-amazon-info font-medium">
                FREE delivery
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.inStock}
          className="w-full bg-amazon-orange hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <>
              <div className="spinner border-white w-4 h-4"></div>
              Adding...
            </>
          ) : (
            <>
              <ApperIcon name="ShoppingCart" size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;