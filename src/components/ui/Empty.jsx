import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  variant = "default",
  title,
  description,
  actionText,
  onAction,
  className = ""
}) => {
  const getConfig = () => {
    switch (variant) {
      case "search":
        return {
          icon: "Search",
          title: "No Products Found",
          description: "We couldn't find any products matching your search. Try adjusting your filters or search terms.",
          actionText: "Clear Filters",
          bgColor: "bg-blue-50",
          iconColor: "text-amazon-info"
        };
      case "cart":
        return {
          icon: "ShoppingCart",
          title: "Your Cart is Empty",
          description: "Looks like you haven't added any items to your cart yet. Start shopping to fill it up!",
          actionText: "Start Shopping",
          bgColor: "bg-orange-50",
          iconColor: "text-amazon-orange"
        };
      case "wishlist":
        return {
          icon: "Heart",
          title: "Your Wishlist is Empty",
          description: "Save items you love by clicking the heart icon on products you're interested in.",
          actionText: "Explore Products",
          bgColor: "bg-red-50",
          iconColor: "text-red-500"
        };
      case "orders":
        return {
          icon: "Package",
          title: "No Orders Yet",
          description: "You haven't placed any orders yet. When you do, they'll appear here.",
          actionText: "Shop Now",
          bgColor: "bg-green-50",
          iconColor: "text-amazon-success"
        };
      case "category":
        return {
          icon: "Grid3x3",
          title: "No Products in This Category",
          description: "This category is currently empty. Check back later for new products!",
          actionText: "Browse All Categories",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-500"
        };
      default:
        return {
          icon: "Box",
          title: "Nothing Here Yet",
          description: "This section is currently empty. Check back later for updates!",
          actionText: "Go Back",
          bgColor: "bg-gray-50",
          iconColor: "text-gray-500"
        };
    }
  };

  const config = getConfig();
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionText = actionText || config.actionText;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      // Default actions based on variant
      switch (variant) {
        case "cart":
          window.location.href = "/";
          break;
        case "search":
          window.location.reload();
          break;
        case "wishlist":
        case "orders":
        case "category":
          window.location.href = "/";
          break;
        default:
          window.history.back();
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border ${className}`}>
      <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}>
        <ApperIcon 
          name={config.icon}
          size={40}
          className={config.iconColor}
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {displayTitle}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {displayDescription}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAction}
          className="bg-amazon-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ApperIcon name="ArrowRight" size={16} />
          {displayActionText}
        </button>
        
        {variant === "search" && (
          <button
            onClick={() => window.location.href = "/"}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" size={16} />
            Browse Categories
          </button>
        )}
      </div>

      {variant === "cart" && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
          {["Electronics", "Fashion", "Home", "Books"].map((category) => (
            <button
              key={category}
              onClick={() => window.location.href = `/?category=${category.toLowerCase()}`}
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700"
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Empty;