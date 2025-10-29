import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ 
  filterOptions, 
  currentFilters, 
  onFilterChange, 
  onClearFilters,
  isMobile = false 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    rating: true,
    features: true
  });
const [priceRange, setPriceRange] = useState({
    min: currentFilters?.minPrice || "",
    max: currentFilters?.maxPrice || ""
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceSubmit = () => {
    onFilterChange({
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined
    });
  };

  const handlePriceClear = () => {
    setPriceRange({ min: "", max: "" });
    onFilterChange({
      minPrice: undefined,
      maxPrice: undefined
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.minPrice) count++;
    if (currentFilters.maxPrice) count++;
    if (currentFilters.minRating) count++;
    if (currentFilters.brand) count++;
    if (currentFilters.prime) count++;
    if (currentFilters.inStock) count++;
    if (currentFilters.deals) count++;
    return count;
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-amazon-dark hover:text-amazon-orange transition-colors mb-3"
      >
        <span>{title}</span>
        <ApperIcon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16}
        />
      </button>
      {isExpanded && children}
    </div>
  );

  const RatingStars = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <ApperIcon
          key={star}
          name="Star"
          size={12}
          className={star <= rating ? "star-filled" : "star-empty"}
          fill={star <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${isMobile ? "border-0 shadow-none rounded-none" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-amazon-dark">Filters</h2>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-amazon-info hover:text-blue-700 font-medium"
          >
            Clear all ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Any"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handlePriceSubmit}
              className="flex-1 bg-amazon-orange hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
            >
              Apply
            </button>
            <button
              onClick={handlePriceClear}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Quick Price Ranges */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Quick ranges:</p>
            {[
              { label: "Under $25", max: 25 },
              { label: "$25 - $50", min: 25, max: 50 },
              { label: "$50 - $100", min: 50, max: 100 },
              { label: "$100 - $200", min: 100, max: 200 },
              { label: "Over $200", min: 200 }
            ].map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  onFilterChange({
                    minPrice: range.min || undefined,
                    maxPrice: range.max || undefined
                  });
                  setPriceRange({
                    min: range.min || "",
                    max: range.max || ""
                  });
                }}
                className="block w-full text-left text-sm text-amazon-info hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      {filterOptions?.brands && (
        <FilterSection
          title="Brand"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection("brand")}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.brands.slice(0, 10).map((brand) => (
              <label key={brand.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="brand"
                  checked={currentFilters.brand === brand.value}
                  onChange={(e) => onFilterChange({ 
                    brand: e.target.checked ? brand.value : undefined 
                  })}
                  className="text-amazon-orange focus:ring-amazon-orange"
                />
                <span className="text-sm text-gray-700 flex-1">{brand.label}</span>
                <span className="text-xs text-gray-500">({brand.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Customer Rating */}
      <FilterSection
        title="Customer Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection("rating")}
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="rating"
                checked={currentFilters.minRating === rating.toString()}
                onChange={(e) => onFilterChange({ 
                  minRating: e.target.checked ? rating.toString() : undefined 
                })}
                className="text-amazon-orange focus:ring-amazon-orange"
              />
              <div className="flex items-center gap-2 flex-1">
                <RatingStars rating={rating} />
                <span className="text-sm text-gray-700">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection
        title="Features"
        isExpanded={expandedSections.features}
        onToggle={() => toggleSection("features")}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="checkbox"
              checked={currentFilters.prime}
              onChange={(e) => onFilterChange({ prime: e.target.checked })}
              className="text-amazon-orange focus:ring-amazon-orange"
            />
            <div className="flex items-center gap-2">
              <span className="prime-badge text-xs">PRIME</span>
              <span className="text-sm text-gray-700">Prime Eligible</span>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="checkbox"
              checked={currentFilters.deals}
              onChange={(e) => onFilterChange({ deals: e.target.checked })}
              className="text-amazon-orange focus:ring-amazon-orange"
            />
            <div className="flex items-center gap-2">
              <ApperIcon name="Tag" size={14} className="text-amazon-error" />
              <span className="text-sm text-gray-700">On Sale</span>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="checkbox"
              checked={currentFilters.inStock}
              onChange={(e) => onFilterChange({ inStock: e.target.checked })}
              className="text-amazon-orange focus:ring-amazon-orange"
            />
            <div className="flex items-center gap-2">
              <ApperIcon name="Package" size={14} className="text-amazon-success" />
              <span className="text-sm text-gray-700">In Stock</span>
            </div>
          </label>
        </div>
      </FilterSection>

      {/* Shipping */}
      <FilterSection
        title="Shipping Options"
        isExpanded={expandedSections.shipping}
        onToggle={() => toggleSection("shipping")}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ApperIcon name="Truck" size={14} className="text-amazon-info" />
            <span>FREE Shipping by ShopHub</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ApperIcon name="Clock" size={14} className="text-amazon-warning" />
            <span>Same-Day Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ApperIcon name="MapPin" size={14} className="text-amazon-success" />
            <span>Pickup available</span>
          </div>
        </div>
      </FilterSection>

      {/* Clear All Button */}
      {getActiveFiltersCount() > 0 && (
        <button
          onClick={onClearFilters}
          className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;