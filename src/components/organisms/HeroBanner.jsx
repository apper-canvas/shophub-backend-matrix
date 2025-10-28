import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const HeroBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Electronics Sale",
      subtitle: "Up to 70% off on latest gadgets",
      description: "Shop smartphones, laptops, headphones and more at unbeatable prices",
      buttonText: "Shop Electronics",
      buttonAction: () => navigate("/products?category=electronics&deals=true"),
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Fashion Forward",
      subtitle: "New arrivals for every style",
      description: "Discover the latest trends in fashion with free shipping on orders over $35",
      buttonText: "Shop Fashion",
      buttonAction: () => navigate("/products?category=fashion&sort=newest"),
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Home & Living",
      subtitle: "Transform your space",
      description: "Everything you need to create your dream home, from furniture to decor",
      buttonText: "Shop Home",
      buttonAction: () => navigate("/products?category=home"),
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Prime Day Deals",
      subtitle: "Exclusive member savings",
      description: "Unlock amazing deals with Prime membership - 2-day free shipping included",
      buttonText: "Join Prime",
      buttonAction: () => navigate("/products?prime=true"),
      background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=400&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-amazon-dark to-amazon-navy">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          background: currentSlideData.background,
          filter: "brightness(0.8)"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-screen-2xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-white space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {currentSlideData.title}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-yellow-300">
                  {currentSlideData.subtitle}
                </h2>
              </div>
              
              <p className="text-lg md:text-xl text-gray-200 max-w-lg leading-relaxed">
                {currentSlideData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={currentSlideData.buttonAction}
                  className="bg-amazon-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {currentSlideData.buttonText}
                </button>
                
                <button
                  onClick={() => navigate("/products")}
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amazon-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
                >
                  Browse All
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 pt-6">
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Truck" size={16} className="text-amazon-orange" />
                  <span>Free 2-Day Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="RotateCcw" size={16} className="text-amazon-orange" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon name="Shield" size={16} className="text-amazon-orange" />
                  <span>Secure Shopping</span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover animate-fade-in"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop";
                  }}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-20"
        aria-label="Previous slide"
      >
        <ApperIcon name="ChevronLeft" size={24} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200 z-20"
        aria-label="Next slide"
      >
        <ApperIcon name="ChevronRight" size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20 carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-indicator ${
              index === currentSlide ? "active" : ""
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
        <div
          className="h-full bg-amazon-orange transition-all duration-5000 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
};

export default HeroBanner;