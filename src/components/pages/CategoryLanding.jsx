import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { categoryService } from "@/services/api/categoryService";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Home from "@/components/pages/Home";
import Cart from "@/components/pages/Cart";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProductCard from "@/components/molecules/ProductCard";

const CategoryLanding = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext();

  const [categoryData, setCategoryData] = useState(null);
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [featuredDeals, setFeaturedDeals] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategoryData();
  }, [categorySlug, subcategorySlug]);

  const loadCategoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load category data
      const category = await categoryService.getBySlug(categorySlug);
      setCategoryData(category);

      // Load subcategory data if applicable
      if (subcategorySlug) {
        const subcategory = await categoryService.getSubcategoryBySlug(
          categorySlug,
          subcategorySlug
        );
        setSubcategoryData(subcategory);
      } else {
        setSubcategoryData(null);
      }

      // Load featured deals
      const deals = await productService.getDealsByCategory(
        categorySlug,
        subcategorySlug,
        6
      );
      setFeaturedDeals(deals);

      // Load top-rated products
      const filters = {
        category: categorySlug,
        subcategory: subcategorySlug || "",
        sort: "rating",
        limit: 12,
      };
      const topRated = await productService.getAll(filters);
      setTopProducts(topRated.products);
    } catch (err) {
      console.error("Error loading category data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllProducts = () => {
    const query = subcategorySlug
      ? `?category=${categorySlug}&subcategory=${subcategorySlug}`
      : `?category=${categorySlug}`;
    navigate(`/products${query}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!categoryData) return <Error message="Category not found" />;

  const currentName = subcategoryData?.name || categoryData.name;
  const productCount = subcategoryData?.productCount || categoryData.productCount;

  return (
    <div className="min-h-screen bg-background">
      {/* Category Banner */}
      <div className="relative h-64 bg-gradient-to-r from-amazon-navy to-amazon-info overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-amazon-warning transition-colors"
                >
                  Home
                </button>
              </li>
              <span className="breadcrumb-separator text-white">›</span>
              <li>
                {subcategorySlug ? (
                  <button
                    onClick={() => navigate(`/category/${categorySlug}`)}
                    className="hover:text-amazon-warning transition-colors"
                  >
                    {categoryData.name}
                  </button>
                ) : (
                  <span className="font-medium">{categoryData.name}</span>
                )}
              </li>
              {subcategorySlug && subcategoryData && (
                <>
                  <span className="breadcrumb-separator text-white">›</span>
                  <li className="font-medium">{subcategoryData.name}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Category Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {currentName}
          </h1>
          <p className="text-white text-lg opacity-90">
            {productCount.toLocaleString()} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Deals Section */}
        {featuredDeals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amazon-dark">
                Featured Deals
              </h2>
              <button
                onClick={handleViewAllProducts}
                className="text-amazon-info hover:text-amazon-orange transition-colors font-medium flex items-center gap-2"
              >
                View All
                <ApperIcon name="ChevronRight" size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals.map((product) => (
                <div key={product.Id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div
                    onClick={() => handleProductClick(product.Id)}
                    className="cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      {product.originalPrice && (
                        <div className="absolute top-4 right-4 bg-amazon-error text-white px-3 py-1 rounded-lg font-bold text-sm">
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          % OFF
                        </div>
                      )}
                      {product.isPrime && (
                        <div className="absolute top-4 left-4">
                          <span className="prime-badge">PRIME</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-amazon-dark mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <ApperIcon
                              key={i}
                              name="Star"
                              size={16}
                              className={
                                i < Math.floor(product.rating)
                                  ? "text-amazon-warning fill-amazon-warning"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-amazon-error">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product.Id);
                        }}
                        className="w-full bg-amazon-warning hover:bg-amazon-warning/90 text-amazon-dark font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ApperIcon name="ShoppingCart" size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Rated Products Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amazon-dark">
              Top Rated Products
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="SlidersHorizontal" size={18} />
              Filters
            </button>
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
<div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4">
                <FilterSidebar
                  onFilterChange={() => {}}
                  initialFilters={{
                    category: categorySlug || "",
                    subcategory: subcategorySlug || "",
                  }}
                />
              </div>
            </div>

            {/* Filter Sidebar - Mobile */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <ApperIcon name="X" size={24} />
                    </button>
                  </div>
<div className="p-4">
                    <FilterSidebar
                      onFilterChange={() => {}}
                      initialFilters={{
                        category: categorySlug || "",
                        subcategory: subcategorySlug || "",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {topProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topProducts.map((product) => (
                      <ProductCard
                        key={product.Id}
                        product={product}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleViewAllProducts}
                      className="bg-amazon-info hover:bg-amazon-info/90 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      View All Products
                      <ApperIcon name="ArrowRight" size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon
                    name="Package"
                    size={64}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Subcategories Grid - Only show on main category page */}
        {!subcategorySlug && categoryData.subcategories && categoryData.subcategories.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-amazon-dark mb-6">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryData.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() =>
                    navigate(`/category/${categorySlug}/${subcategory.slug}`)
                  }
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 text-center"
                >
                  <h3 className="font-medium text-amazon-dark mb-2">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {subcategory.productCount.toLocaleString()} products
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CategoryLanding;