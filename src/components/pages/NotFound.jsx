import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const popularCategories = [
    { name: "Electronics", icon: "Smartphone", path: "/products?category=electronics" },
    { name: "Fashion", icon: "Shirt", path: "/products?category=fashion" },
    { name: "Home & Kitchen", icon: "Home", path: "/products?category=home" },
    { name: "Books", icon: "Book", path: "/products?category=books" }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-amazon-orange bg-opacity-10 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="Search" size={64} className="text-amazon-orange" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-bold text-amazon-dark">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-amazon-dark">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 space-y-4">
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>
          <p className="text-gray-600">
            Don't worry though - we have plenty of amazing products waiting for you!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleGoHome}
            className="bg-amazon-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" size={20} />
            Go to Homepage
          </button>
          
          <button
            onClick={handleGoBack}
            className="bg-white hover:bg-gray-50 text-amazon-dark border border-gray-300 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            Go Back
          </button>
        </div>

        {/* Popular Categories */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-amazon-dark mb-4">
            Popular Categories
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(category.path)}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-amazon-orange bg-opacity-10 rounded-lg flex items-center justify-center group-hover:bg-amazon-orange group-hover:bg-opacity-20 transition-colors">
                    <ApperIcon 
                      name={category.icon} 
                      size={20} 
                      className="text-amazon-orange"
                    />
                  </div>
                  <span className="text-sm font-medium text-amazon-dark">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Still can't find what you're looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="text-amazon-info hover:text-blue-700 font-medium flex items-center justify-center gap-2">
              <ApperIcon name="MessageCircle" size={16} />
              Contact Support
            </button>
            <button className="text-amazon-info hover:text-blue-700 font-medium flex items-center justify-center gap-2">
              <ApperIcon name="HelpCircle" size={16} />
              Visit Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;