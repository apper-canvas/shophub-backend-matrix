import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { searchService } from "@/services/api/searchService";
import { cartService } from "@/services/api/cartService";

const Header = ({ cartCount = 0, onCartClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
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
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3">
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
    </header>
  );
};
export default Header;