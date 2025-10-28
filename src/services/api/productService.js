import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProducts = [...this.products];

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply subcategory filter
    if (filters.subcategory) {
      filteredProducts = filteredProducts.filter(
        product => product.subcategory.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.price >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Apply rating filter
    if (filters.minRating) {
      filteredProducts = filteredProducts.filter(
        product => product.rating >= parseFloat(filters.minRating)
      );
    }

    // Apply Prime filter
    if (filters.prime) {
      filteredProducts = filteredProducts.filter(product => product.isPrime);
    }

    // Apply stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Apply brand filter
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(
        product => product.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Apply deals filter
    if (filters.deals) {
      filteredProducts = filteredProducts.filter(
        product => product.originalPrice && product.originalPrice > product.price
      );
    }

    // Apply featured filter
    if (filters.featured) {
      filteredProducts = filteredProducts.filter(
        product => product.rating >= 4.5 && product.reviewCount >= 1000
      );
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filteredProducts.sort((a, b) => b.Id - a.Id);
          break;
        case "bestseller":
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "trending":
          filteredProducts.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
          break;
        default:
          // Default sort by relevance (rating * review count)
          filteredProducts.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
      }
    }

    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      totalCount: filteredProducts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasNextPage: endIndex < filteredProducts.length,
      hasPrevPage: page > 1
    };
  }

  async getById(id) {
    await delay(200);
    
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return { ...product };
  }

  async getFeatured(limit = 10) {
    await delay(250);
    
    const featured = this.products
      .filter(product => product.rating >= 4.5 && product.reviewCount >= 1000)
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, limit);
    
    return featured.map(product => ({ ...product }));
  }

  async getBestSellers(limit = 10) {
    await delay(250);
    
    const bestSellers = [...this.products]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, limit);
    
    return bestSellers.map(product => ({ ...product }));
  }

  async getNewArrivals(limit = 10) {
    await delay(250);
    
    const newArrivals = [...this.products]
      .sort((a, b) => b.Id - a.Id)
      .slice(0, limit);
    
    return newArrivals.map(product => ({ ...product }));
  }

  async getRecommendations(productId, limit = 4) {
    await delay(200);
    
    const currentProduct = this.products.find(p => p.Id === parseInt(productId));
    if (!currentProduct) {
      return [];
    }

    const recommendations = this.products
      .filter(product => 
        product.Id !== currentProduct.Id &&
        (product.category === currentProduct.category ||
         product.brand === currentProduct.brand)
      )
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, limit);
    
    return recommendations.map(product => ({ ...product }));
  }

  async getByCategory(category, limit = 20) {
    await delay(300);
    
    const categoryProducts = this.products
      .filter(product => product.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, limit);
    
    return categoryProducts.map(product => ({ ...product }));
  }

  async search(query, limit = 20) {
    await delay(300);
    
    const searchTerm = query.toLowerCase();
    const results = this.products
      .filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
.sort((a, b) => {
        // Prioritize exact title matches
        const aExact = a.title.toLowerCase().includes(searchTerm) ? 1 : 0;
        const bExact = b.title.toLowerCase().includes(searchTerm) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        
        // Then by rating and reviews
        return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
      })
      .slice(0, limit);
    
    return results.map(product => ({ ...product }));
  }

  async create(productData) {
    await delay(300);
    
    const newId = Math.max(...this.products.map(p => p.Id)) + 1;
    const newProduct = {
      Id: newId,
      ...productData,
      reviewCount: 0,
      rating: 0
    };
    
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, productData) {
    await delay(300);
    
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    this.products[index] = { ...this.products[index], ...productData };
    return { ...this.products[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    this.products.splice(index, 1);
    return true;
  }

  // Get filter options for UI
  async getFilterOptions() {
    await delay(200);
    
    const categories = [...new Set(this.products.map(p => p.category))];
    const brands = [...new Set(this.products.map(p => p.brand))];
    const priceRange = {
      min: Math.min(...this.products.map(p => p.price)),
      max: Math.max(...this.products.map(p => p.price))
    };
    
    return {
      categories: categories.map(cat => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        count: this.products.filter(p => p.category === cat).length
      })),
      brands: brands.map(brand => ({
        value: brand,
        label: brand,
        count: this.products.filter(p => p.brand === brand).length
      })),
      priceRange
    };
  }
}

export const productService = new ProductService();