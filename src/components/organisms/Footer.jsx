import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-amazon-dark text-white mt-auto">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-amazon-navy hover:bg-gray-700 py-4 text-center text-sm font-medium transition-colors"
      >
        Back to top
      </button>

      {/* Main Footer Content */}
      <div className="bg-amazon-dark py-12">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Get to Know Us */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Get to Know Us</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">About ShopHub</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Press Releases</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">ShopHub Cares</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Gift a Smile</Link></li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Make Money with Us</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Sell products on ShopHub</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Become an Affiliate</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Advertise Your Products</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Self-Publish with Us</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Host a Hub Hub</Link></li>
              </ul>
            </div>

            {/* ShopHub Payment Products */}
            <div>
              <h3 className="font-semibold text-lg mb-4">ShopHub Payment Products</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">ShopHub Rewards Visa</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">ShopHub Store Card</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">ShopHub Business Card</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Shop with Points</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Reload Your Balance</Link></li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Let Us Help You</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">ShopHub and COVID-19</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Your Account</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Your Orders</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Shipping Rates & Policies</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Returns & Replacements</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Manage Your Content</Link></li>
                <li><Link to="/" className="hover:text-amazon-orange transition-colors">Help</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-600 my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ApperIcon name="ShoppingBag" size={28} className="text-amazon-orange" />
                <span className="text-xl font-bold">ShopHub</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 hover:text-amazon-orange transition-colors">
                  <img 
                    src="https://flagcdn.com/w20/us.png"
                    alt="English"
                    className="w-4 h-3"
                  />
                  <span>English</span>
                </button>
                <button className="hover:text-amazon-orange transition-colors">$ USD - U.S. Dollar</button>
                <button className="flex items-center gap-1 hover:text-amazon-orange transition-colors">
                  <img 
                    src="https://flagcdn.com/w20/us.png"
                    alt="United States"
                    className="w-4 h-3"
                  />
                  <span>United States</span>
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <button className="hover:text-amazon-orange transition-colors">
                <ApperIcon name="Facebook" size={20} />
              </button>
              <button className="hover:text-amazon-orange transition-colors">
                <ApperIcon name="Twitter" size={20} />
              </button>
              <button className="hover:text-amazon-orange transition-colors">
                <ApperIcon name="Instagram" size={20} />
              </button>
              <button className="hover:text-amazon-orange transition-colors">
                <ApperIcon name="Youtube" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Footer */}
      <div className="bg-amazon-navy py-8">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 text-xs">
            <div>
              <h4 className="font-medium mb-2">ShopHub Music</h4>
              <p className="text-gray-300">Stream millions of songs</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">ShopHub Fresh</h4>
              <p className="text-gray-300">Groceries & More Right To Your Door</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Whole Foods Market</h4>
              <p className="text-gray-300">Premium Organic Groceries</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">ShopHub Prime</h4>
              <p className="text-gray-300">Free Two-Day Delivery</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Prime Video</h4>
              <p className="text-gray-300">Movies & TV Shows</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">ShopHub Web Services</h4>
              <p className="text-gray-300">Cloud Computing Services</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Audible</h4>
              <p className="text-gray-300">Listen to Books & Original Audio</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-600 text-center text-xs text-gray-300">
            <p>© 2024 ShopHub.com, Inc. or its affiliates</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/" className="hover:text-white">Conditions of Use</Link>
              <Link to="/" className="hover:text-white">Privacy Notice</Link>
              <Link to="/" className="hover:text-white">Consumer Health Data</Link>
              <Link to="/" className="hover:text-white">Your Ads Privacy Choices</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;