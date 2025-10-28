import React from "react";

const Loading = ({ variant = "default", className = "" }) => {
  if (variant === "products") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="skeleton skeleton-image aspect-square w-full mb-4"></div>
            <div className="space-y-3">
              <div className="skeleton skeleton-title w-3/4"></div>
              <div className="skeleton skeleton-text w-1/2"></div>
              <div className="skeleton skeleton-text w-1/3"></div>
              <div className="skeleton skeleton-text w-full h-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "product-detail") {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton skeleton-image aspect-square w-full"></div>
          <div className="space-y-6">
            <div className="skeleton skeleton-title w-3/4 h-8"></div>
            <div className="skeleton skeleton-text w-1/2 h-6"></div>
            <div className="skeleton skeleton-text w-1/3 h-8"></div>
            <div className="space-y-3">
              <div className="skeleton skeleton-text w-full"></div>
              <div className="skeleton skeleton-text w-full"></div>
              <div className="skeleton skeleton-text w-3/4"></div>
            </div>
            <div className="skeleton skeleton-text w-full h-12"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "cart") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-4 flex gap-4">
            <div className="skeleton skeleton-image w-20 h-20 flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="skeleton skeleton-title w-3/4"></div>
              <div className="skeleton skeleton-text w-1/2"></div>
              <div className="skeleton skeleton-text w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-12 ${className}`}>
      <div className="text-center space-y-4">
        <div className="spinner mx-auto border-amazon-orange"></div>
        <p className="text-gray-600 font-medium">Loading amazing products...</p>
      </div>
    </div>
  );
};

export default Loading;