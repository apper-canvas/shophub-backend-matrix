import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { searchService } from "@/services/api/searchService";
import { cartService } from "@/services/api/cartService";
import { categoryService } from "@/services/api/categoryService";
const Header = ({ cartCount = 0, wishlistCount = 0, onCartClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const searchRef = useRef();
  const accountRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
      
      // Close mobile category panel when clicking outside
      const categoryPanel = document.getElementById('mobile-category-panel');
      if (isMobileCategoryOpen && categoryPanel && !categoryPanel.contains(event.target)) {
        const hamburgerBtn = document.getElementById('hamburger-menu-btn');
        if (!hamburgerBtn || !hamburgerBtn.contains(event.target)) {
          setIsMobileCategoryOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          const suggestions = await searchService.getSuggestions(searchQuery);
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await cartService.getAll();
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, [cartCount]);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
<header className="bg-amazon-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Hamburger Menu - Mobile */}
          <button
            id="hamburger-menu-btn"
            onClick={async () => {
              if (!isMobileCategoryOpen && categories.length === 0) {
                try {
                  const data = await categoryService.getAll();
                  setCategories(data);
                } catch (error) {
                  console.error("Error loading categories:", error);
                }
              }
              setIsMobileCategoryOpen(!isMobileCategoryOpen);
            }}
            className="lg:hidden text-white hover:text-amazon-orange transition-colors p-2"
            aria-label="Menu"
          >
            <ApperIcon name="Menu" size={24} />
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <ApperIcon name="ShoppingBag" size={32} className="text-amazon-orange" />
            <span className="text-xl font-bold hidden sm:block">ShopHub</span>
          </Link>

          {/* Deliver to */}
          <div className="hidden md:flex items-center gap-1 text-sm hover:bg-amazon-navy px-2 py-1 rounded cursor-pointer transition-colors">
            <ApperIcon name="MapPin" size={16} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Deliver to</span>
              <span className="text-white font-medium">New York 10001</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <div className="flex">
              <select className="bg-gray-100 text-amazon-dark px-3 py-2 rounded-l-lg border-r border-gray-300 hidden sm:block">
                <option>All</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Kitchen</option>
                <option>Books</option>
                <option>Toys</option>
              </select>
              <input
                type="text"
                placeholder="Search ShopHub"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-2 text-amazon-dark outline-none sm:rounded-none rounded-l-lg"
              />
              <button
                onClick={() => handleSearch()}
                className="bg-amazon-orange hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors"
              >
                <ApperIcon name="Search" size={20} />
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 search-dropdown">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-amazon-dark border-b last:border-b-0 flex items-center gap-3"
                  >
                    <ApperIcon name="Search" size={16} className="text-gray-400" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div className="hidden lg:flex items-center gap-1 text-sm hover:bg-amazon-navy px-2 py-1 rounded cursor-pointer transition-colors">
            <img 
              src="https://flagcdn.com/w20/us.png"
              alt="English"
              className="w-5 h-3"
            />
            <span>EN</span>
            <ApperIcon name="ChevronDown" size={14} />
          </div>

          {/* Account */}
          <div className="relative" ref={accountRef}>
<button
              type="button"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex flex-col items-start text-sm hover:bg-amazon-navy px-2 py-1 rounded transition-colors"
            >
              <span className="text-xs text-gray-300">Hello, Guest</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">Account & Lists</span>
                <ApperIcon name="ChevronDown" size={14} />
              </div>
            </button>

            {/* Account Dropdown */}
            {isAccountMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white text-amazon-dark border rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="font-medium">Your Account</p>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                    <ApperIcon name="User" size={16} />
                    Your Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                    <ApperIcon name="Package" size={16} />
                    Your Orders
                  </button>
<button 
                    onClick={() => {
                      navigate('/wishlist');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <ApperIcon name="Heart" size={16} />
                    Your Wishlist
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
                    <ApperIcon name="Settings" size={16} />
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <button className="flex flex-col items-start text-sm hover:bg-amazon-navy px-2 py-1 rounded transition-colors hidden sm:flex">
            <span className="text-xs text-gray-300">Returns</span>
            <span className="font-medium">& Orders</span>
          </button>

{/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            className="relative flex items-center gap-2 hover:bg-amazon-navy px-2 py-1 rounded transition-colors"
          >
            <div className="relative">
              <ApperIcon name="Heart" size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start text-sm hidden sm:flex">
              <span className="text-xs text-gray-300">Wishlist</span>
              <span className="font-medium">{wishlistCount}</span>
            </div>
          </button>

          {/* Cart */}
          <button
onClick={() => {
              if (cartItems.length > 3) {
                navigate('/cart');
              } else {
                onCartClick();
              }
            }}
            className="relative flex items-center gap-2 hover:bg-amazon-navy px-2 py-1 rounded transition-colors"
          >
            <div className="relative">
              <ApperIcon name="ShoppingCart" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amazon-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-cart-bounce">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start text-sm hidden sm:flex">
              <span className="text-xs text-gray-300">Cart</span>
              <span className="font-medium">{cartCount}</span>
            </div>
          </button>
        </div>
</div>

      {/* Mobile Category Panel */}
      {isMobileCategoryOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-backdrop-fade"
            onClick={() => setIsMobileCategoryOpen(false)}
          />

          {/* Slide-out Panel */}
          <div
            id="mobile-category-panel"
            className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 overflow-y-auto animate-slide-left shadow-2xl"
          >
            {/* Panel Header */}
            <div className="sticky top-0 bg-amazon-dark text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Shop by Category</h2>
              <button
                onClick={() => setIsMobileCategoryOpen(false)}
                className="text-white hover:text-amazon-orange transition-colors"
                aria-label="Close menu"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            {/* Categories List */}
            <div className="p-4">
              {categories.map((category) => (
                <div key={category.Id} className="mb-2">
                  {/* Main Category */}
<div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigate(`/category/${category.slug}`);
                        setIsMobileCategoryOpen(false);
                      }}
                      className="flex-1 flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-amazon-dark"
                    >
                      <ApperIcon name={category.icon} size={20} className="text-amazon-orange" />
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">
                          {category.productCount} products
                        </div>
                      </div>
                    </button>
                    
                    {category.subcategories && category.subcategories.length > 0 && (
                      <button
                        onClick={() => {
                          setExpandedCategories(prev => ({
                            ...prev,
                            [category.Id]: !prev[category.Id]
                          }));
                        }}
                        className="p-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
                        aria-label={expandedCategories[category.Id] ? "Collapse" : "Expand"}
                      >
                        <ApperIcon
                          name={expandedCategories[category.Id] ? "ChevronUp" : "ChevronDown"}
                          size={20}
                        />
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {expandedCategories[category.Id] && category.subcategories && (
                    <div className="ml-8 mt-2 space-y-1 animate-slide-down">
                      {category.subcategories.map((subcategory) => (
<button
                          key={subcategory.id}
                          onClick={() => {
                            navigate(`/category/${category.slug}/${subcategory.slug}`);
                            setIsMobileCategoryOpen(false);
                          }}
                          className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded transition-colors text-sm text-gray-700"
                        >
                          <span>{subcategory.name}</span>
                          <span className="text-xs text-gray-400">
                            {subcategory.productCount}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Panel Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-4 border-t">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMobileCategoryOpen(false);
                }}
                className="w-full py-3 bg-amazon-orange text-amazon-dark font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
export default Header;