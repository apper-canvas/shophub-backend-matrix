const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WishlistService {
  constructor() {
    this.storageKey = 'user_wishlist';
  }

  getWishlistData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      return [];
    }
  }

  saveWishlistData(wishlist) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }

  async getAll() {
    await delay(200);
    return this.getWishlistData();
  }

  async add(productId) {
    await delay(200);
    
    const wishlist = this.getWishlistData();
    
    if (wishlist.includes(productId)) {
      return false;
    }
    
    wishlist.push(productId);
    this.saveWishlistData(wishlist);
    return true;
  }

  async remove(productId) {
    await delay(200);
    
    const wishlist = this.getWishlistData();
    const filteredWishlist = wishlist.filter(id => id !== productId);
    
    if (filteredWishlist.length === wishlist.length) {
      return false;
    }
    
    this.saveWishlistData(filteredWishlist);
    return true;
  }

  async toggle(productId) {
    await delay(200);
    
    const wishlist = this.getWishlistData();
    const isInWishlist = wishlist.includes(productId);
    
    if (isInWishlist) {
      const filteredWishlist = wishlist.filter(id => id !== productId);
      this.saveWishlistData(filteredWishlist);
      return { added: false };
    } else {
      wishlist.push(productId);
      this.saveWishlistData(wishlist);
      return { added: true };
    }
  }

  isInWishlist(productId) {
    const wishlist = this.getWishlistData();
    return wishlist.includes(productId);
  }

  async clear() {
    await delay(200);
    this.saveWishlistData([]);
    return true;
  }
}

export const wishlistService = new WishlistService();