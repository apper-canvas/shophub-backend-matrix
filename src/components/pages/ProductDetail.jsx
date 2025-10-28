import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Home from "@/components/pages/Home";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ImageGallery from "@/components/molecules/ImageGallery";
import ProductCard from "@/components/molecules/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(parseInt(id));
      
      if (!data) {
        setError('Product not found');
        return;
      }
      
      setProduct(data);
      
      // Track view history
      productService.addToHistory(data.Id);
      
      // Load related products from same category
      const allProducts = await productService.getAll();
      const related = allProducts
        .filter(p => p.category === data.category && p.Id !== data.Id)
        .slice(0, 4);
      setRelatedProducts(related);
      
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };


const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product.Id, quantity);
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
    await handleAddToCart();
    toast.info("Proceeding to checkout...");
    setTimeout(() => {
      navigate("/checkout");
    }, 1000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToWishlist = async () => {
    if (isAddingToWishlist) return;
    
    setIsAddingToWishlist(true);
    try {
      // In real app, this would call wishlist service
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error("Failed to add to wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <ApperIcon key={i} name="Star" size={20} className="star-filled fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <ApperIcon key={i} name="StarHalf" size={20} className="star-filled fill-current" />
        );
      } else {
        stars.push(
          <ApperIcon key={i} name="Star" size={20} className="star-empty" />
        );
      }
    }
    return stars;
};

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-amazon-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const images = product.images || [
    "https://via.placeholder.com/600x600?text=Product+Image"
  ];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate("/")} className="text-amazon-info hover:text-amazon-error transition-colors">
              Home
            </button>
            <span className="breadcrumb-separator">/</span>
            <button onClick={() => navigate(`/products?category=${product.category}`)} className="text-amazon-info hover:text-amazon-error transition-colors">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="text-gray-600 truncate max-w-md">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <ImageGallery images={images} title={product.title} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight">
                {product.title}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                by <span className="text-amazon-info hover:text-amazon-error cursor-pointer transition-colors">{product.brand}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="star-rating">
                {renderStars(product.rating)}
              </div>
              <button className="text-sm text-amazon-info hover:text-amazon-error transition-colors">
                {product.rating.toFixed(1)} out of 5
              </button>
              <span className="text-gray-400">|</span>
              <button 
                onClick={() => setActiveTab('reviews')}
                className="text-sm text-amazon-info hover:text-amazon-error transition-colors"
              >
                {product.reviewCount.toLocaleString()} ratings
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4" />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-semibold price-current">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg price-original">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-sm price-discount">({discount}% off)</span>
                  </>
                )}
              </div>
{product.isPrime && (
                <div className="flex items-center gap-2">
                  <span className="prime-badge">PRIME</span>
                  <span className="text-sm text-gray-600">FREE delivery</span>
                </div>
              )}
            </div>

            {/* Availability */}
            <div>
              {product.inStock ? (
                <p className="text-amazon-success font-semibold text-lg flex items-center gap-2">
                  <ApperIcon name="Check" size={20} />
                  In Stock
                </p>
              ) : (
                <p className="text-amazon-error font-semibold text-lg flex items-center gap-2">
                  <ApperIcon name="X" size={20} />
                  Currently Unavailable
                </p>
              )}
              {product.inStock && product.stockCount <= 10 && (
                <p className="text-amazon-error text-sm mt-1">Only {product.stockCount} left in stock - order soon.</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4" />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-info focus:border-transparent min-w-[70px]"
                >
                  {[...Array(Math.min(product.stockCount || 99, 99))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    product.inStock && !isAddingToCart
                      ? "bg-gradient-to-b from-amazon-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } ${isAddingToCart ? "btn-loading" : ""}`}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner" />
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ApperIcon name="ShoppingCart" size={20} />
                      Add to Cart
                    </span>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg ${
                    product.inStock
                      ? "bg-amazon-warning hover:bg-yellow-500 text-amazon-dark"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist */}
              <button 
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className="w-full text-sm text-amazon-info hover:text-amazon-error transition-colors flex items-center justify-center gap-2 py-2 disabled:opacity-50"
              >
                <ApperIcon name="Heart" size={16} />
                {isAddingToWishlist ? "Adding..." : "Add to Wishlist"}
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <ApperIcon name="Truck" size={20} className="text-amazon-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Fast, FREE delivery</p>
                  <p className="text-gray-600">Order within 2 hrs 25 mins</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="RotateCcw" size={20} className="text-amazon-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Free Returns</p>
                  <p className="text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ApperIcon name="Shield" size={20} className="text-amazon-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Secure transaction</p>
                  <p className="text-gray-600">Your payment information is secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'description'
                    ? 'text-amazon-orange border-b-2 border-amazon-orange'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Product Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'specifications'
                    ? 'text-amazon-orange border-b-2 border-amazon-orange'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'reviews'
                    ? 'text-amazon-orange border-b-2 border-amazon-orange'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customer Reviews ({product.reviewCount.toLocaleString()})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About this item</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>{product.description}</p>
                  
                  <h4 className="font-semibold text-gray-900 mt-6 mb-3">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {product.specifications && Object.entries(product.specifications)
                      .slice(0, 5)
                      .map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                  </ul>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <ApperIcon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold text-gray-900 mb-1">Important Notice</p>
                        <p>Please check product specifications and compatibility before purchasing. Colors may vary slightly from images shown.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50 w-1/3">Brand</td>
                        <td className="px-6 py-4 text-gray-700">{product.brand}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50">Category</td>
                        <td className="px-6 py-4 text-gray-700">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50">Subcategory</td>
                        <td className="px-6 py-4 text-gray-700">{product.subcategory}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50">Item Weight</td>
                        <td className="px-6 py-4 text-gray-700">{product.specifications?.Weight || 'Not specified'}</td>
                      </tr>
                      {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900 bg-gray-50">{key}</td>
                          <td className="px-6 py-4 text-gray-700">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                  
                  {/* Rating Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {product.rating.toFixed(1)}
                        </div>
                        <div className="star-rating mb-2 justify-center md:justify-start">
                          {renderStars(product.rating)}
                        </div>
                        <p className="text-sm text-gray-600">{product.reviewCount.toLocaleString()} global ratings</p>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const percentage = Math.floor(Math.random() * 40) + (star === 5 ? 40 : 20);
                          return (
                            <div key={star} className="flex items-center gap-3 mb-2">
                              <button className="text-sm text-amazon-info hover:text-amazon-error transition-colors">
                                {star} star
                              </button>
                              <div className="flex-1 progress-bar h-5">
                                <div 
                                  className="progress-fill h-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Write Review Button */}
                  <button className="bg-amazon-warning hover:bg-yellow-500 text-amazon-dark font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg mb-6">
                    Write a product review
                  </button>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((reviewIndex) => (
                      <div key={reviewIndex} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-600">
                            {String.fromCharCode(65 + reviewIndex)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">Anonymous Customer</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">Verified Purchase</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="star-rating">
                                {renderStars(Math.random() * 2 + 3)}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">Great product!</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Reviewed in the United States on {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-3">
                              This product exceeded my expectations. The quality is outstanding and it works exactly as described. Highly recommend to anyone looking for a reliable {product.category} product.
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <button className="text-gray-600 hover:text-amazon-info transition-colors flex items-center gap-1">
                                <ApperIcon name="ThumbsUp" size={16} />
                                Helpful ({Math.floor(Math.random() * 100)})
                              </button>
                              <button className="text-gray-600 hover:text-amazon-info transition-colors">
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Reviews */}
                  <div className="text-center mt-8">
                    <button className="text-amazon-info hover:text-amazon-error font-semibold transition-colors">
                      See all reviews
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.Id}
                  product={relatedProduct}
                  onClick={() => {
                    navigate(`/product/${relatedProduct.Id}`);
                    window.scrollTo(0, 0);
                  }}
                />
))}
            </div>
          </div>
        </div>
)}
    </div>
  );
};

export default ProductDetail;