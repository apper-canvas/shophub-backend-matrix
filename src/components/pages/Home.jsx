import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import HeroBanner from "@/components/organisms/HeroBanner";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [featuredData, bestSellersData, newArrivalsData, categoriesData] = await Promise.all([
        productService.getFeatured(),
        productService.getBestSellers(),
        productService.getNewArrivals(),
        categoryService.getFeatured()
      ]);

      setFeaturedProducts(featuredData);
      setBestSellers(bestSellersData);
      setNewArrivals(newArrivalsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading home data:", err);
      setError("Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    const success = await addToCart(productId, quantity);
    if (success) {
      toast.success("Added to cart!");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAll = (section) => {
    const params = new URLSearchParams();
    
    switch (section) {
      case "bestsellers":
        params.set("sort", "bestseller");
        break;
      case "new-arrivals":
        params.set("sort", "newest");
        break;
      case "featured":
        params.set("featured", "true");
        break;
      default:
        break;
    }
    
    navigate(`/products?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-300 mb-8"></div>
          <div className="max-w-screen-2xl mx-auto px-4 space-y-8">
            <Loading variant="products" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error
          message={error}
          onRetry={loadHomeData}
          className="max-w-lg mx-4"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amazon-dark">Shop by Category</h2>
            <button
              onClick={() => navigate("/products")}
              className="text-amazon-info hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all categories
              <ApperIcon name="ArrowRight" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.slug)}
              />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amazon-dark">Featured Products</h2>
            <button
              onClick={() => handleViewAll("featured")}
              className="text-amazon-info hover:text-blue-700 font-medium flex items-center gap-1"
            >
              See all featured
              <ApperIcon name="ArrowRight" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(quantity) => handleAddToCart(product.id, quantity)}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-amazon-dark">Best Sellers</h2>
              <p className="text-gray-600 text-sm">Most popular items this month</p>
            </div>
            <button
              onClick={() => handleViewAll("bestsellers")}
              className="text-amazon-info hover:text-blue-700 font-medium flex items-center gap-1"
            >
              See all best sellers
              <ApperIcon name="ArrowRight" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 product-grid">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(quantity) => handleAddToCart(product.id, quantity)}
                onClick={() => handleProductClick(product.id)}
                showBestseller
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-amazon-dark">New Arrivals</h2>
              <p className="text-gray-600 text-sm">Latest products added to our catalog</p>
            </div>
            <button
              onClick={() => handleViewAll("new-arrivals")}
              className="text-amazon-info hover:text-blue-700 font-medium flex items-center gap-1"
            >
              See all new arrivals
              <ApperIcon name="ArrowRight" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 product-grid">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(quantity) => handleAddToCart(product.id, quantity)}
                onClick={() => handleProductClick(product.id)}
                showNew
              />
            ))}
          </div>
        </section>

        {/* Special Offers */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Deal of the Day */}
            <div className="bg-white rounded-lg shadow-sm border p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amazon-error text-white px-3 py-1 text-sm font-bold">
                Limited Time
              </div>
              <h3 className="text-xl font-bold text-amazon-dark mb-2">Deal of the Day</h3>
              <p className="text-gray-600 mb-4">Up to 50% off selected electronics</p>
              <button
                onClick={() => navigate("/products?deals=today")}
                className="bg-amazon-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Shop Now
              </button>
            </div>

            {/* Prime Benefits */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
              <h3 className="text-xl font-bold mb-2">Prime Benefits</h3>
              <p className="text-blue-100 mb-4">FREE 2-day delivery, exclusive deals & more</p>
              <button
                onClick={() => navigate("/products?prime=true")}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Explore Prime
              </button>
            </div>

            {/* Customer Service */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-green-100 mb-4">24/7 customer support for all your questions</p>
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                <ApperIcon name="MessageCircle" size={16} />
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-12">
          <div className="bg-amazon-dark text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay in the loop</h3>
            <p className="text-gray-300 mb-6">Get the latest deals and product updates delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-amazon-dark outline-none"
              />
              <button className="bg-amazon-orange hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;