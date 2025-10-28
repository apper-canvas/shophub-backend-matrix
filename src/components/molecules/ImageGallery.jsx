import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const ImageGallery = ({ images = [], title = "Product" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&auto=format";

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const currentImage = imageError[currentImageIndex] 
    ? fallbackImage 
    : (images[currentImageIndex] || fallbackImage);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div 
          className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          } image-zoom`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentImage}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
            onError={() => handleImageError(currentImageIndex)}
            style={{
              transform: isZoomed ? "scale(1.5)" : "scale(1)"
            }}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ApperIcon name="ChevronLeft" size={20} className="text-gray-700" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ApperIcon name="ChevronRight" size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          {isZoomed ? "Click to zoom out" : "Click to zoom in"}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumbnailSrc = imageError[index] ? fallbackImage : image;
            
            return (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex
                    ? "border-amazon-orange"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={thumbnailSrc}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Image Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          <ApperIcon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={16} />
          {isZoomed ? "Zoom Out" : "Zoom In"}
        </button>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
          <ApperIcon name="Expand" size={16} />
          Full Screen
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;