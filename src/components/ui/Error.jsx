import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong while loading products",
  onRetry,
  variant = "default",
  className = ""
}) => {
  const getIcon = () => {
    switch (variant) {
      case "network":
        return "WifiOff";
      case "not-found":
        return "Search";
      case "cart":
        return "ShoppingCart";
      default:
        return "AlertTriangle";
    }
  };

  const getTitle = () => {
    switch (variant) {
      case "network":
        return "Connection Problem";
      case "not-found":
        return "No Results Found";
      case "cart":
        return "Cart Error";
      default:
        return "Oops! Something Went Wrong";
    }
  };

  const getDescription = () => {
    switch (variant) {
      case "network":
        return "Please check your internet connection and try again.";
      case "not-found":
        return "We couldn't find any products matching your search.";
      case "cart":
        return "There was a problem with your shopping cart.";
      default:
        return "We're having trouble loading this content right now.";
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border ${className}`}>
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon 
          name={getIcon()} 
          size={32}
          className="text-amazon-error"
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message || getDescription()}
      </p>

      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-amazon-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </button>
        )}
        
        <button
          onClick={() => window.location.href = "/"}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <ApperIcon name="Home" size={16} />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default Error;