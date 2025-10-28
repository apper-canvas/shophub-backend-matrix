import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await delay(200);
    return this.categories.map(category => ({ ...category }));
  }

  async getById(id) {
    await delay(150);
    
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    return { ...category };
  }

  async getBySlug(slug) {
    await delay(150);
    
    const category = this.categories.find(c => c.slug === slug);
    if (!category) {
      throw new Error(`Category with slug ${slug} not found`);
    }
    
    return { ...category };
  }

  async getFeatured() {
    await delay(200);
    
    const featured = this.categories
      .filter(category => category.featured)
      .sort((a, b) => b.productCount - a.productCount);
    
    return featured.map(category => ({ ...category }));
  }

  async getSubcategories(categoryId) {
    await delay(150);
    
    const category = this.categories.find(c => c.Id === parseInt(categoryId));
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    return category.subcategories ? [...category.subcategories] : [];
  }

  async getSubcategoryBySlug(categorySlug, subcategorySlug) {
    await delay(150);
    
    const category = this.categories.find(c => c.slug === categorySlug);
    if (!category || !category.subcategories) {
      throw new Error(`Category or subcategories not found`);
    }
    
    const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
    if (!subcategory) {
      throw new Error(`Subcategory with slug ${subcategorySlug} not found`);
    }
    
    return { ...subcategory };
  }

  async create(categoryData) {
    await delay(300);
    
    const newId = Math.max(...this.categories.map(c => c.Id)) + 1;
    const newCategory = {
      Id: newId,
      ...categoryData,
      productCount: 0,
      subcategories: []
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await delay(300);
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    this.categories[index] = { ...this.categories[index], ...categoryData };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    this.categories.splice(index, 1);
    return true;
  }

  // Get category tree with product counts
  async getCategoryTree() {
    await delay(200);
    
    return this.categories.map(category => ({
      ...category,
      subcategories: category.subcategories || []
    }));
  }

  // Get popular categories based on product count
  async getPopular(limit = 6) {
    await delay(200);
    
    const popular = [...this.categories]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, limit);
    
    return popular.map(category => ({ ...category }));
  }
}

export const categoryService = new CategoryService();