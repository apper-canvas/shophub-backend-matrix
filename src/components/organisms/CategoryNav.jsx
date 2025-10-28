import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const CategoryNav = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowMegaMenu(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
    setShowMegaMenu(false);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    navigate(`/products?category=${categorySlug}&subcategory=${subcategorySlug}`);
    setShowMegaMenu(false);
    setHoveredCategory(null);
  };

  const featuredCategories = categories.filter(cat => cat.featured).slice(0, 6);
  const hoveredCategoryData = categories.find(cat => cat.id === hoveredCategory);

  return (
    <nav ref={navRef} className="bg-amazon-navy text-white border-b border-amazon-dark sticky top-16 z-40">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center h-10">
          {/* All Categories Button */}
          <button
            onMouseEnter={() => {
              setShowMegaMenu(true);
              setHoveredCategory(categories[0]?.id);
            }}
            className="flex items-center gap-2 hover:bg-amazon-dark px-3 py-2 rounded transition-colors font-medium text-sm"
          >
            <ApperIcon name="Menu" size={16} />
            <span className="hidden sm:inline">All Categories</span>
          </button>

          {/* Quick Links */}
          <div className="flex items-center gap-1 ml-4">
            <Link
              to="/products?deals=today"
              className="px-3 py-2 hover:bg-amazon-dark rounded transition-colors text-sm font-medium"
            >
              Today's Deals
            </Link>
            <Link
              to="/products?sort=newest"
              className="px-3 py-2 hover:bg-amazon-dark rounded transition-colors text-sm font-medium"
            >
              New Arrivals
            </Link>
            <Link
              to="/products?sort=bestseller"
              className="px-3 py-2 hover:bg-amazon-dark rounded transition-colors text-sm font-medium hidden sm:block"
            >
              Best Sellers
            </Link>
            <Link
              to="/products?prime=true"
              className="px-3 py-2 hover:bg-amazon-dark rounded transition-colors text-sm font-medium hidden md:block flex items-center gap-1"
            >
              <span className="prime-badge text-xs">PRIME</span>
              Eligible
            </Link>
          </div>

          {/* Featured Categories */}
          <div className="hidden lg:flex items-center gap-1 ml-auto">
            {featuredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                onMouseEnter={() => {
                  setShowMegaMenu(true);
                  setHoveredCategory(category.id);
                }}
                className="px-3 py-2 hover:bg-amazon-dark rounded transition-colors text-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mega Menu */}
        {showMegaMenu && hoveredCategoryData && (
          <div
            className="absolute top-full left-0 right-0 mega-menu z-50 animate-fade-in"
            onMouseLeave={() => {
              setShowMegaMenu(false);
              setHoveredCategory(null);
            }}
          >
            <div className="max-w-screen-2xl mx-auto p-6">
              <div className="grid grid-cols-4 gap-8">
                {/* Categories List */}
                <div className="mega-menu-column">
                  <h3 className="font-semibold text-amazon-dark mb-4 text-lg">
                    Shop by Category
                  </h3>
                  <div className="space-y-1">
                    {categories.slice(0, 8).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                          hoveredCategory === category.id
                            ? "bg-orange-50 text-amazon-orange border-l-2 border-amazon-orange"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ApperIcon name={category.icon} size={16} />
                          {category.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {hoveredCategoryData.subcategories && (
                  <div className="mega-menu-column">
                    <h3 className="font-semibold text-amazon-dark mb-4 text-lg">
                      {hoveredCategoryData.name}
                    </h3>
                    <div className="space-y-1">
                      {hoveredCategoryData.subcategories.slice(0, 8).map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleSubcategoryClick(hoveredCategoryData.slug, subcategory.slug)}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Products */}
                <div className="mega-menu-column">
                  <h3 className="font-semibold text-amazon-dark mb-4 text-lg">
                    Featured
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/products?deals=flash")}
                      className="w-full text-left p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ApperIcon name="Zap" size={16} className="text-amazon-orange" />
                        <span className="font-medium text-amazon-dark">Flash Deals</span>
                      </div>
                      <p className="text-xs text-gray-600">Limited time offers</p>
                    </button>
                    
                    <button
                      onClick={() => navigate("/products?sort=trending")}
                      className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ApperIcon name="TrendingUp" size={16} className="text-amazon-info" />
                        <span className="font-medium text-amazon-dark">Trending Now</span>
                      </div>
                      <p className="text-xs text-gray-600">Popular this week</p>
                    </button>

                    <button
                      onClick={() => navigate("/products?rating=4")}
                      className="w-full text-left p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ApperIcon name="Star" size={16} className="text-amazon-success" />
                        <span className="font-medium text-amazon-dark">Top Rated</span>
                      </div>
                      <p className="text-xs text-gray-600">4+ star products</p>
                    </button>
                  </div>
                </div>

                {/* Customer Service */}
                <div className="mega-menu-column">
                  <h3 className="font-semibold text-amazon-dark mb-4 text-lg">
                    Help & Services
                  </h3>
                  <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-2">
                      <ApperIcon name="MessageCircle" size={14} />
                      Customer Service
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-2">
                      <ApperIcon name="RotateCcw" size={14} />
                      Returns & Refunds
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-2">
                      <ApperIcon name="Truck" size={14} />
                      Track Your Order
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-2">
                      <ApperIcon name="HelpCircle" size={14} />
                      FAQ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CategoryNav;