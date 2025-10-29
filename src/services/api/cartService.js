const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.storageKey = "shophub_cart";
    this.loadCartFromStorage();
  }

  loadCartFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.cartItems = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      this.cartItems = [];
    }
  }

  saveCartToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }

  async getAll() {
    await delay(150);
    this.loadCartFromStorage();
    return [...this.cartItems];
  }

  async addItem(productId, quantity = 1, selectedOptions = {}) {
    await delay(200);
    
    this.loadCartFromStorage();
    
    const existingItemIndex = this.cartItems.findIndex(
      item => item.productId === productId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      this.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem = {
        productId: productId,
        quantity: Math.max(1, quantity),
        selectedOptions: selectedOptions || {},
        addedAt: new Date().toISOString()
      };
      this.cartItems.push(newItem);
    }

    this.saveCartToStorage();
    return [...this.cartItems];
  }

  async updateQuantity(productId, quantity) {
    await delay(150);
    
    this.loadCartFromStorage();
    
    const itemIndex = this.cartItems.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new Error(`Item with product ID ${productId} not found in cart`);
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.cartItems.splice(itemIndex, 1);
    } else {
      // Update quantity
      this.cartItems[itemIndex].quantity = Math.max(1, quantity);
    }

    this.saveCartToStorage();
    return [...this.cartItems];
  }

  async removeItem(productId) {
    await delay(150);
    
    this.loadCartFromStorage();
    
    const itemIndex = this.cartItems.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new Error(`Item with product ID ${productId} not found in cart`);
    }

    this.cartItems.splice(itemIndex, 1);
    this.saveCartToStorage();
    return [...this.cartItems];
  }

  async clear() {
    await delay(100);
    
    this.cartItems = [];
    this.saveCartToStorage();
    return [];
  }

  async getCount() {
    await delay(50);
    
    this.loadCartFromStorage();
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  async getSubtotal(productPrices = {}) {
    await delay(100);
    
    this.loadCartFromStorage();
    
    return this.cartItems.reduce((total, item) => {
      const price = productPrices[item.productId] || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  async validateCart(availableProducts = {}) {
    await delay(200);
    
    this.loadCartFromStorage();
    
    const validItems = [];
    const removedItems = [];
    
    for (const item of this.cartItems) {
      const product = availableProducts[item.productId];
      
      if (!product) {
        removedItems.push({ ...item, reason: "Product no longer available" });
        continue;
      }
      
      if (!product.inStock) {
        removedItems.push({ ...item, reason: "Product out of stock" });
        continue;
      }
      
      // Check if requested quantity is available
      if (product.stockCount && item.quantity > product.stockCount) {
        // Adjust quantity to available stock
        validItems.push({
          ...item,
          quantity: product.stockCount,
          adjusted: true
        });
      } else {
        validItems.push(item);
      }
    }
    
    // Update cart with valid items
    this.cartItems = validItems;
    this.saveCartToStorage();
    
    return {
      validItems,
      removedItems,
      hasChanges: removedItems.length > 0 || validItems.some(item => item.adjusted)
    };
  }

  // Get cart summary for checkout
async getSummary(productPrices = {}, taxRate = 0.08, shippingThreshold = 35, shippingCost = 5.99, isPrime = true) {
    await delay(150);
    
    this.loadCartFromStorage();
    
    const subtotal = this.cartItems.reduce((total, item) => {
      const price = productPrices[item.productId] || 0;
      return total + (price * item.quantity);
    }, 0);
    
    const tax = subtotal * taxRate;
    const shipping = isPrime ? 0 : (subtotal >= shippingThreshold ? 0 : shippingCost);
    const total = subtotal + tax + shipping;
    
    return {
      items: [...this.cartItems],
      itemCount: this.cartItems.reduce((total, item) => total + item.quantity, 0),
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      freeShipping: isPrime || subtotal >= shippingThreshold,
      amountForFreeShipping: !isPrime && subtotal < shippingThreshold ? shippingThreshold - subtotal : 0,
      isPrime
    };
  }

// Save individual item for later
  async saveItemForLater(itemId) {
    await delay(150);
    
    this.loadCartFromStorage();
    const itemIndex = this.cartItems.findIndex(item => item.Id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    const item = this.cartItems[itemIndex];
    
    // Get saved items
    const savedKey = `${this.storageKey}_saved`;
    let savedItems = [];
    try {
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        savedItems = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading saved items:", error);
    }
    
    // Add to saved items
    savedItems.push(item);
    localStorage.setItem(savedKey, JSON.stringify(savedItems));
    
    // Remove from cart
    this.cartItems.splice(itemIndex, 1);
    this.saveCartToStorage();
    
    return true;
  }
  
  // Get all saved items
  async getSavedItems() {
    await delay(100);
    
    const savedKey = `${this.storageKey}_saved`;
    try {
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading saved items:", error);
    }
    return [];
  }
  
  // Restore individual item from saved
  async restoreFromSaved(itemId) {
    await delay(150);
    
    const savedKey = `${this.storageKey}_saved`;
    try {
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        let savedItems = JSON.parse(saved);
        const itemIndex = savedItems.findIndex(item => item.Id === itemId);
        
        if (itemIndex !== -1) {
          const item = savedItems[itemIndex];
          // Add back to cart
          await this.addItem(item.productId, item.quantity, item.selectedOptions);
          
          // Remove from saved
          savedItems.splice(itemIndex, 1);
          localStorage.setItem(savedKey, JSON.stringify(savedItems));
          return true;
        }
      }
    } catch (error) {
      console.error("Error restoring saved item:", error);
    }
    return false;
  }
}

export const cartService = new CartService();