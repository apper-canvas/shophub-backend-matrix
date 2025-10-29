import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Home from "@/components/pages/Home";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ProductCard from "@/components/molecules/ProductCard";

const ProductListing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useOutletContext();
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [filterOptions, setFilterOptions] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // View and sort options
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");

  // Get current filters from URL
  const getCurrentFilters = () => {
    return {
category: searchParams.get("category") || "",
      subcategory: searchParams.get("subcategory") || "",
      categoryName: "",
      subcategoryName: "",
      search: searchParams.get("search") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      minRating: searchParams.get("minRating") || "",
      brand: searchParams.get("brand") || "",
      prime: searchParams.get("prime") === "true",
      inStock: searchParams.get("inStock") === "true",
      deals: searchParams.get("deals") === "true",
      featured: searchParams.get("featured") === "true",
      sort: searchParams.get("sort") || "relevance",
      page: parseInt(searchParams.get("page")) || 1,
      limit: 20
    };
  };

useEffect(() => {
    loadProducts();
    loadFilterOptions();
    loadCategoryInfo();
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const filters = getCurrentFilters();
      const result = await productService.getAll(filters);

      setProducts(result.products);
      setTotalCount(result.totalCount);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setHasNextPage(result.hasNextPage);
      setHasPrevPage(result.hasPrevPage);
      setSortBy(filters.sort);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const options = await productService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

const loadCategoryInfo = async () => {
    try {
      const categorySlug = searchParams.get("category");
      const subcategorySlug = searchParams.get("subcategory");
      
      // Validate categorySlug exists and is not empty before calling service
      if (categorySlug && categorySlug.trim().length > 0) {
        const category = await categoryService.getBySlug(categorySlug);
        setCategoryInfo(category);
        
        // Validate subcategorySlug exists before calling service
        if (subcategorySlug && subcategorySlug.trim().length > 0) {
          const subcategory = await categoryService.getSubcategoryBySlug(
            categorySlug,
            subcategorySlug
          );
        }
      } else {
        setCategoryInfo(null);
      }
    } catch (error) {
      console.error("Error loading category info:", error);
      setCategoryInfo(null);
    }
  };

  const updateFilters = (newFilters) => {
    const currentFilters = getCurrentFilters();
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 };

    // Remove empty values
    Object.keys(updatedFilters).forEach(key => {
      if (updatedFilters[key] === "" || updatedFilters[key] === false) {
        updatedFilters[key] = undefined;
      }
    });

    setSearchParams(updatedFilters);
  };

  const handleSortChange = (newSort) => {
    updateFilters({ sort: newSort });
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    const success = await addToCart(productId, quantity);
    if (success) {
      toast.success("Added to cart!");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearFilters = () => {
    const search = searchParams.get("search");
    if (search) {
      setSearchParams({ search });
    } else {
      setSearchParams({});
    }
  };

const getCurrentQuery = () => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    
    if (search) return `"${search}"`;
    if (subcategory) return categoryInfo?.subcategory?.name || subcategory;
    if (category) return categoryInfo?.name || category;
    return "All Products";
  };

  const getActiveFiltersCount = () => {
    const filters = getCurrentFilters();
    let count = 0;
    
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.brand) count++;
    if (filters.prime) count++;
    if (filters.inStock) count++;
    if (filters.deals) count++;
    if (filters.subcategory) count++;
    
    return count;
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="skeleton skeleton-title w-3/4"></div>
                <div className="skeleton skeleton-text w-full"></div>
                <div className="skeleton skeleton-text w-2/3"></div>
              </div>
            </div>
            <div className="flex-1">
              <Loading variant="products" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error
          message={error}
          onRetry={loadProducts}
          className="max-w-lg mx-4"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
<nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate("/")}
                className="hover:text-amazon-orange transition-colors"
              >
                Home
              </button>
            </li>
            {categoryInfo?.name && (
              <>
                <span className="breadcrumb-separator">›</span>
                <li>
                  <button
                    onClick={() => navigate(`/category/${searchParams.get("category")}`)}
                    className="hover:text-amazon-orange transition-colors"
                  >
                    {categoryInfo.name}
                  </button>
                </li>
              </>
)}
            {categoryInfo?.subcategory?.name && (
              <>
                <span className="breadcrumb-separator">›</span>
                <li>
                  <button
                    onClick={() => navigate(`/category/${searchParams.get("category")}/${searchParams.get("subcategory")}`)}
                    className="hover:text-amazon-orange transition-colors"
                  >
                    {categoryInfo.subcategory.name}
                  </button>
                </li>
              </>
            )}
{searchParams.get("search") && (
              <>
                <span className="breadcrumb-separator">›</span>
                <li className="text-amazon-dark font-medium">
                  Search results for "{searchParams.get("search")}"
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            {filterOptions && (
              <FilterSidebar
                filterOptions={filterOptions}
                currentFilters={getCurrentFilters()}
                onFilterChange={updateFilters}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-amazon-dark">
                    {getCurrentQuery()}
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {totalCount > 0 ? (
                      <>
                        {totalCount.toLocaleString()} result{totalCount !== 1 ? "s" : ""}
                        {currentPage > 1 && (
                          <span> (Page {currentPage} of {totalPages})</span>
                        )}
                      </>
                    ) : (
                      "No results found"
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    <ApperIcon name="SlidersHorizontal" size={16} />
                    <span className="text-sm font-medium">
                      Filters
                      {getActiveFiltersCount() > 0 && (
                        <span className="ml-1 bg-amazon-orange text-white text-xs px-2 py-1 rounded-full">
                          {getActiveFiltersCount()}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-amazon-orange"
                          : "text-gray-600 hover:text-amazon-dark"
                      }`}
                    >
                      <ApperIcon name="Grid3x3" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-amazon-orange"
                          : "text-gray-600 hover:text-amazon-dark"
                      }`}
                    >
                      <ApperIcon name="List" size={16} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="bestseller">Best Sellers</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {getCurrentFilters().minPrice && (
                      <span className="filter-chip">
                        Min: ${getCurrentFilters().minPrice}
                        <button
                          onClick={() => updateFilters({ minPrice: "" })}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {getCurrentFilters().maxPrice && (
                      <span className="filter-chip">
                        Max: ${getCurrentFilters().maxPrice}
                        <button
                          onClick={() => updateFilters({ maxPrice: "" })}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {getCurrentFilters().brand && (
                      <span className="filter-chip">
                        {getCurrentFilters().brand}
                        <button
                          onClick={() => updateFilters({ brand: "" })}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {getCurrentFilters().prime && (
                      <span className="filter-chip">
                        Prime Eligible
                        <button
                          onClick={() => updateFilters({ prime: false })}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-sm text-amazon-info hover:text-blue-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Grid/List */}
            {products.length === 0 ? (
              <Empty
                variant="search"
                title={`No products found for "${getCurrentQuery()}"`}
                description="Try adjusting your filters or search terms to find what you're looking for."
                actionText="Clear Filters"
                onAction={clearFilters}
              />
) : (
              <>
                <div className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    : "space-y-4"
                } product-grid`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.Id}
                      product={product}
                      onAddToCart={(quantity) => handleAddToCart(product.Id, quantity)}
                      onClick={() => handleProductClick(product.Id)}
                      showBestseller={false}
                      className={viewMode === "list" ? "flex gap-4 p-4" : ""}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 py-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ApperIcon name="ChevronLeft" size={16} />
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, currentPage - 2) + i;
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                              pageNum === currentPage
                                ? "bg-amazon-orange text-white"
                                : "bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ApperIcon name="ChevronRight" size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto lg:hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              {filterOptions && (
                <FilterSidebar
                  filterOptions={filterOptions}
                  currentFilters={getCurrentFilters()}
                  onFilterChange={(filters) => {
                    updateFilters(filters);
                    setShowMobileFilters(false);
                  }}
                  onClearFilters={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  isMobile
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListing;