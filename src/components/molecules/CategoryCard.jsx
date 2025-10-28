import React from "react";
import ApperIcon from "@/components/ApperIcon";

const CategoryCard = ({ category, onClick, className = "" }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-lg hover:scale-105 transition-all duration-200 text-center group ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-amazon-orange to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <ApperIcon 
            name={category.icon} 
            size={24} 
            className="text-white"
          />
        </div>

        {/* Category Name */}
        <div>
          <h3 className="font-semibold text-amazon-dark text-sm group-hover:text-amazon-orange transition-colors">
            {category.name}
          </h3>
          
          {category.productCount && (
            <p className="text-xs text-gray-500 mt-1">
              {category.productCount} items
            </p>
          )}
        </div>

        {/* Featured Badge */}
        {category.featured && (
          <div className="absolute top-2 right-2 bg-amazon-success text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        )}
      </div>
    </button>
  );
};

export default CategoryCard;