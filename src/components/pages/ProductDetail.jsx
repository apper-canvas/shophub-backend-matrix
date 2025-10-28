import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import ProductCard from "@/components/molecules/ProductCard";
import ImageGallery from "@/components/molecules/ImageGallery";
import ProductTabs from "@/components/molecules/ProductTabs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError("");

    try {
      const productData = await productService.getById(id);
      setProduct(productData);
      
      // Load recommendations
      const recommendedProducts = await productService.getRecommendations(id);
      setRecommendations(recommendedProducts);
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product.Id, quantity, selectedOptions);
      if (success) {
        toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product.Id, quantity, selectedOptions);
    if (success) {
      navigate("/checkout");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const RatingStars = ({ rating, reviewCount }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon
            key={star}
            name="Star"
            size={16}
            className={star <= Math.floor(rating) ? "star-filled" : "star-empty"}
            fill={star <= Math.floor(rating) ? "currentColor" : "none"}
          />
        ))}
      </div>
      <span className="text-amazon-info hover:text-blue-700 cursor-pointer">
        {rating} ({reviewCount?.toLocaleString()} reviews)
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <Loading variant="product-detail" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error
          message={error || "Product not found"}
          onRetry={loadProduct}
          variant="not-found"
          className="max-w-lg mx-4"
        />
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-amazon-orange"
              >
                Home
              </button>
            </li>
            <span className="breadcrumb-separator">›</span>
            <li>
              <button
                onClick={() => navigate(`/products?category=${product.category}`)}
                className="hover:text-amazon-orange capitalize"
              >
                {product.category}
              </button>
            </li>
            <span className="breadcrumb-separator">›</span>
            <li className="text-amazon-dark font-medium truncate">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-1">
              <ImageGallery images={product.images} title={product.title} />
            </div>

            {/* Product Info */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-amazon-dark mb-2">
                  {product.title}
                </h1>
                
                {product.brand && (
                  <p className="text-amazon-info hover:text-blue-700 cursor-pointer font-medium">
                    Brand: {product.brand}
                  </p>
                )}
              </div>

              {/* Rating */}
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

              {/* Prime Badge */}
              {product.isPrime && (
                <div className="flex items-center gap-2">
                  <span className="prime-badge">PRIME</span>
                  <span className="text-sm text-gray-600">FREE Two-Day Delivery</span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="price-current text-3xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  {discount > 0 && (
                    <>
                      <span className="price-original text-lg">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-amazon-error text-white px-2 py-1 rounded text-sm font-medium">
                        -{discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {product.isPrime && (
                  <p className="text-sm text-amazon-success font-medium">
                    Save with Prime shipping
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <ApperIcon name="Check" size={16} className="text-amazon-success" />
                    <span className="text-amazon-success font-medium">
                      In Stock
                      {product.stockCount && product.stockCount < 10 && (
                        <span className="text-amazon-warning ml-1">
                          - Only {product.stockCount} left!
                        </span>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="X" size={16} className="text-amazon-error" />
                    <span className="text-amazon-error font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              {product.specifications && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-amazon-dark mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {Object.entries(product.specifications).slice(0, 5).map(([key, value]) => (
                      <li key={key} className="flex">
                        <span className="font-medium text-gray-700 w-24 flex-shrink-0">
                          {key}:
                        </span>
                        <span className="text-gray-600">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Purchase Options */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <div className="space-y-4">
                  {/* Price Summary */}
                  <div className="text-center">
                    <div className="price-current text-2xl font-bold">
                      ${product.price.toFixed(2)}
                    </div>
                    {discount > 0 && (
                      <div className="text-sm text-gray-600">
                        List Price: <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Info */}
                  <div className="border-t border-b border-gray-200 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ApperIcon name="Truck" size={16} className="text-amazon-info" />
                      <span className="font-medium text-amazon-dark">Delivery</span>
                    </div>
                    {product.isPrime ? (
                      <p className="text-sm text-gray-600">
                        FREE Two-Day Delivery with Prime
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        FREE shipping on orders over $35
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <ApperIcon name="MapPin" size={16} className="text-amazon-success" />
                      <button className="text-sm text-amazon-info hover:text-blue-700">
                        Deliver to New York 10001
                      </button>
                    </div>
                  </div>

                  {product.inStock && (
                    <>
                      {/* Quantity Selector */}
                      <div>
                        <label className="block text-sm font-medium text-amazon-dark mb-2">
                          Quantity:
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <ApperIcon name="Minus" size={14} />
                          </button>
                          
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center border rounded-lg quantity-input"
                            min="1"
                            max="99"
                          />
                          
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <ApperIcon name="Plus" size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={handleAddToCart}
                          disabled={isAddingToCart}
                          className="w-full bg-amazon-orange hover:bg-orange-600 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {isAddingToCart ? (
                            <>
                              <div className="spinner border-white w-4 h-4"></div>
                              Adding to Cart...
                            </>
                          ) : (
                            <>
                              <ApperIcon name="ShoppingCart" size={16} />
                              Add to Cart
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleBuyNow}
                          className="w-full bg-amazon-warning hover:bg-yellow-500 text-amazon-dark py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          Buy Now
                        </button>
                      </div>
                    </>
                  )}

                  {/* Wishlist */}
                  <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-amazon-dark py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <ApperIcon name="Heart" size={16} />
                    Add to Wishlist
                  </button>

                  {/* Additional Info */}
                  <div className="text-sm text-gray-600 space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="RotateCcw" size={14} />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Shield" size={14} />
                      <span>Secure transaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Award" size={14} />
                      <span>1-year warranty included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductTabs product={product} />

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amazon-dark">
                Products related to this item
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 product-grid">
              {recommendations.map((recommendedProduct) => (
                <ProductCard
                  key={recommendedProduct.Id}
                  product={recommendedProduct}
                  onAddToCart={(qty) => addToCart(recommendedProduct.Id, qty)}
                  onClick={() => navigate(`/product/${recommendedProduct.Id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;