import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SearchService {
  constructor() {
    this.products = [...productsData];
    this.searchHistory = [];
    this.popularSearches = [
      "iPhone",
      "Laptop",
      "Headphones",
      "Nike shoes",
      "Kitchen appliances",
      "Books",
      "Gaming",
      "Fashion",
      "Home decor",
      "Electronics"
    ];
  }

  async getSuggestions(query, limit = 8) {
    await delay(150);
    
    if (!query || query.length < 2) {
      return this.popularSearches.slice(0, limit);
    }

    const searchTerm = query.toLowerCase();
    const suggestions = new Set();

    // Add product titles that match
    this.products.forEach(product => {
      const title = product.title.toLowerCase();
      if (title.includes(searchTerm)) {
        // Add the full title
        suggestions.add(product.title);
        
        // Add brand suggestions
        if (product.brand.toLowerCase().includes(searchTerm)) {
          suggestions.add(product.brand);
        }
      }
    });

    // Add brand matches
    const brands = [...new Set(this.products.map(p => p.brand))];
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(searchTerm)) {
        suggestions.add(brand);
      }
    });

    // Add category matches
    const categories = [...new Set(this.products.map(p => p.category))];
    categories.forEach(category => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      if (categoryName.toLowerCase().includes(searchTerm)) {
        suggestions.add(categoryName);
      }
    });

    // Add popular searches that match
    this.popularSearches.forEach(search => {
      if (search.toLowerCase().includes(searchTerm)) {
        suggestions.add(search);
      }
    });

    // Convert to array and limit results
    const suggestionArray = Array.from(suggestions).slice(0, limit);
    
    // If no suggestions, return popular searches
    if (suggestionArray.length === 0) {
      return this.popularSearches.slice(0, limit);
    }
    
    return suggestionArray;
  }

  async search(query, filters = {}) {
    await delay(300);
    
    if (!query || query.trim().length === 0) {
      return {
        results: [],
        totalCount: 0,
        query: query,
        suggestions: this.popularSearches.slice(0, 5)
      };
    }

    // Add to search history
    this.addToHistory(query);

    const searchTerm = query.toLowerCase();
    let results = this.products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    // Apply additional filters
    if (filters.category) {
      results = results.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(product => product.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    if (filters.minRating) {
      results = results.filter(product => product.rating >= parseFloat(filters.minRating));
    }

    if (filters.inStock) {
      results = results.filter(product => product.inStock);
    }

    if (filters.prime) {
      results = results.filter(product => product.isPrime);
    }

    // Sort by relevance (exact matches first, then by rating and reviews)
    results.sort((a, b) => {
      // Exact title match gets highest priority
      const aExactTitle = a.title.toLowerCase() === searchTerm ? 3 : 0;
      const bExactTitle = b.title.toLowerCase() === searchTerm ? 3 : 0;
      
      // Title starts with search term gets second priority
      const aTitleStarts = a.title.toLowerCase().startsWith(searchTerm) ? 2 : 0;
      const bTitleStarts = b.title.toLowerCase().startsWith(searchTerm) ? 2 : 0;
      
      // Brand match gets third priority
      const aBrandMatch = a.brand.toLowerCase().includes(searchTerm) ? 1 : 0;
      const bBrandMatch = b.brand.toLowerCase().includes(searchTerm) ? 1 : 0;
      
      const aScore = aExactTitle + aTitleStarts + aBrandMatch;
      const bScore = bExactTitle + bTitleStarts + bBrandMatch;
      
      if (aScore !== bScore) {
        return bScore - aScore;
      }
      
      // If relevance is equal, sort by rating and reviews
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    });

    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      results: paginatedResults.map(product => ({ ...product })),
      totalCount: results.length,
      currentPage: page,
      totalPages: Math.ceil(results.length / limit),
      query: query,
      hasNextPage: endIndex < results.length,
      hasPrevPage: page > 1,
      suggestions: results.length === 0 ? await this.getSuggestions(query, 5) : []
    };
  }

  addToHistory(query) {
    const trimmedQuery = query.trim();
    if (trimmedQuery && !this.searchHistory.includes(trimmedQuery)) {
      this.searchHistory.unshift(trimmedQuery);
      // Keep only last 10 searches
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop();
      }
    }
  }

  async getSearchHistory() {
    await delay(100);
    return [...this.searchHistory];
  }

  async getPopularSearches(limit = 10) {
    await delay(100);
    return this.popularSearches.slice(0, limit);
  }

  async getTrendingSearches() {
    await delay(150);
    
    // Simulate trending searches based on categories with high product counts
    const trending = [
      "iPhone 15",
      "Christmas gifts",
      "Winter fashion",
      "Home workout",
      "Kitchen gadgets",
      "Gaming laptops",
      "Smart home",
      "Skincare routine"
    ];
    
    return trending;
  }

  clearHistory() {
    this.searchHistory = [];
  }
}

export const searchService = new SearchService();