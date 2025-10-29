import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const CategoryNav = () => {
  const navigate = useNavigate();
const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const megaMenuRef = useRef(null);
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
      if (data.length > 0) {
        setHoveredCategory(data[0].Id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
    setShowMegaMenu(false);
  };

  const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
    navigate(`/products?category=${categorySlug}&subcategory=${subcategorySlug}`);
    setShowMegaMenu(false);
  };

  const handleFeatureClick = (query) => {
    navigate(`/products${query}`);
    setShowMegaMenu(false);
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
              if (categories.length > 0 && !hoveredCategory) {
                setHoveredCategory(categories[0].Id);
              }
            }}
            className="hidden lg:flex items-center gap-2 hover:bg-amazon-dark px-3 py-2 rounded transition-colors font-medium text-sm"
          >
            <ApperIcon name="Menu" size={16} />
            <span>All</span>
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

{/* Mega Menu - Desktop Only */}
        {showMegaMenu && hoveredCategoryData && (
          <div
            ref={megaMenuRef}
            className="hidden lg:block absolute top-full left-0 right-0 mega-menu z-50 animate-fade-in"
            onMouseLeave={() => {
              setShowMegaMenu(false);
            }}
          >
            <div className="max-w-screen-2xl mx-auto p-8">
              <div className="grid grid-cols-4 gap-6">
                {/* Column 1: Department Categories */}
                <div className="mega-menu-column">
                  <h3 className="font-bold text-amazon-dark mb-4 text-base border-b border-gray-200 pb-2">
                    Shop by Department
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.Id}
                        onClick={() => handleCategoryClick(category.slug)}
                        onMouseEnter={() => setHoveredCategory(category.Id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm group ${
                          hoveredCategory === category.Id
                            ? "bg-orange-50 text-amazon-orange font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${hoveredCategory === category.Id ? 'text-amazon-orange' : 'text-gray-400 group-hover:text-amazon-orange'} transition-colors`}>
                            <ApperIcon name={category.icon} size={18} />
                          </div>
                          <div className="flex-1">
                            <div>{category.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {category.productCount.toLocaleString()} items
                            </div>
                          </div>
                          {hoveredCategory === category.Id && (
                            <ApperIcon name="ChevronRight" size={14} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2: Subcategories */}
                <div className="mega-menu-column">
                  <h3 className="font-bold text-amazon-dark mb-4 text-base border-b border-gray-200 pb-2 flex items-center gap-2">
                    <ApperIcon name={hoveredCategoryData.icon} size={18} className="text-amazon-orange" />
                    {hoveredCategoryData.name}
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(hoveredCategoryData.slug)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium text-amazon-info hover:text-amazon-dark"
                    >
                      View All {hoveredCategoryData.name}
                    </button>
                    <div className="border-t border-gray-100 my-2" />
                    {hoveredCategoryData.subcategories && hoveredCategoryData.subcategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => handleSubcategoryClick(hoveredCategoryData.slug, subcategory.slug)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-amazon-dark flex items-center justify-between group"
                      >
                        <span>{subcategory.name}</span>
                        <span className="text-xs text-gray-400 group-hover:text-amazon-orange transition-colors">
                          {subcategory.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 3: Featured Collections */}
                <div className="mega-menu-column">
                  <h3 className="font-bold text-amazon-dark mb-4 text-base border-b border-gray-200 pb-2">
                    Featured Collections
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleFeatureClick("?deals=flash")}
                      className="w-full text-left p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-orange group-hover:text-white transition-colors">
                          <ApperIcon name="Zap" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-amazon-dark">Flash Deals</div>
                          <div className="text-xs text-gray-600">Up to 70% off</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Limited time offers</div>
                    </button>
                    
                    <button
                      onClick={() => handleFeatureClick("?sort=trending")}
                      className="w-full text-left p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-info group-hover:text-white transition-colors">
                          <ApperIcon name="TrendingUp" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-amazon-dark">Trending Now</div>
                          <div className="text-xs text-gray-600">Popular picks</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Most wanted this week</div>
                    </button>

                    <button
                      onClick={() => handleFeatureClick("?rating=4")}
                      className="w-full text-left p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-success group-hover:text-white transition-colors">
                          <ApperIcon name="Star" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-amazon-dark">Top Rated</div>
                          <div className="text-xs text-gray-600">4+ stars</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Customer favorites</div>
                    </button>
                  </div>
                </div>

                {/* Column 4: Help & Services */}
                <div className="mega-menu-column">
                  <h3 className="font-bold text-amazon-dark mb-4 text-base border-b border-gray-200 pb-2">
                    Help & Services
                  </h3>
                  <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-info group-hover:text-white transition-colors">
                        <ApperIcon name="MessageCircle" size={16} />
                      </div>
                      <span className="group-hover:text-amazon-dark transition-colors">Customer Service</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-info group-hover:text-white transition-colors">
                        <ApperIcon name="RotateCcw" size={16} />
                      </div>
                      <span className="group-hover:text-amazon-dark transition-colors">Returns & Refunds</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-info group-hover:text-white transition-colors">
                        <ApperIcon name="Truck" size={16} />
                      </div>
                      <span className="group-hover:text-amazon-dark transition-colors">Track Your Order</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 flex items-center gap-3 group">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-amazon-info group-hover:text-white transition-colors">
                        <ApperIcon name="HelpCircle" size={16} />
                      </div>
                      <span className="group-hover:text-amazon-dark transition-colors">FAQ</span>
                    </button>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="px-3 py-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-amazon-info mb-1">
                          <ApperIcon name="Phone" size={14} />
                          <span className="text-xs font-semibold">24/7 Support</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          1-800-123-4567
                        </div>
                      </div>
                    </div>
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