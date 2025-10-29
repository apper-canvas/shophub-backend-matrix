import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { cartService } from '@/services/api/cartService';
import { productService } from '@/services/api/productService';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';

const Cart = () => {
  const navigate = useNavigate();
  const { loadCartItems } = useOutletContext();
  
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load cart items
      const items = await cartService.getAll();
      setCartItems(items);
      
      // Load product details for all items
      const productPromises = items.map(item => 
        productService.getById(item.productId)
      );
      const productDetails = await Promise.all(productPromises);
      
      // Create products map
      const productsMap = {};
      productDetails.forEach(product => {
        if (product) {
          productsMap[product.Id] = product;
        }
      });
      setProducts(productsMap);
      
      // Calculate summary with product prices
      const pricesMap = {};
      Object.values(productsMap).forEach(product => {
        pricesMap[product.Id] = product.price;
      });
      
      const summaryData = await cartService.getSummary(pricesMap, 0.08, 35, 5.99, true);
      setSummary(summaryData);
      
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await cartService.updateQuantity(itemId, newQuantity);
      await loadCart();
      await loadCartItems();
      toast.success('Quantity updated');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemove = async (itemId) => {
    const item = cartItems.find(i => i.Id === itemId);
    const product = item ? products[item.productId] : null;
    const productName = product ? product.title : 'this item';
    
    if (!confirm(`Remove ${productName} from cart?`)) return;
    
    try {
      await cartService.remove(itemId);
      await loadCart();
      await loadCartItems();
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item');
    }
  };

  const handleSaveForLater = async (itemId) => {
    try {
      await cartService.saveItemForLater(itemId);
      await loadCart();
      await loadCartItems();
      toast.success('Item saved for later');
    } catch (err) {
      console.error('Error saving item:', err);
      toast.error('Failed to save item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <Loading message="Loading your cart..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCart} />;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Empty 
        icon="ShoppingCart"
        title="Your cart is empty"
        message="Add items to your cart to get started"
        actionText="Start Shopping"
        onAction={() => navigate('/')}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-amazon-dark mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = products[item.productId];
            if (!product) return null;
            
            const itemSubtotal = product.price * item.quantity;
            const isUpdating = updatingItems.has(item.Id);
            
            return (
              <div 
                key={item.Id}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full sm:w-40 h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/160?text=No+Image';
                    }}
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 
                      className="text-lg font-semibold text-amazon-dark hover:text-amazon-info cursor-pointer line-clamp-2"
                      onClick={() => navigate(`/product/${product.Id}`)}
                    >
                      {product.title}
                    </h3>
                    {product.inStock ? (
                      <p className="text-sm text-amazon-success font-medium mt-1">In Stock</p>
                    ) : (
                      <p className="text-sm text-amazon-error font-medium mt-1">Out of Stock</p>
                    )}
                    {product.prime && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="prime-badge">PRIME</span>
                        <span className="text-sm text-gray-600">Free shipping</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold price-current">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-sm price-original">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm price-discount">
                          ({Math.round((1 - product.price / product.originalPrice) * 100)}% off)
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.Id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <ApperIcon name="Minus" size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value) || 1;
                            if (newQty >= 1) {
                              handleQuantityChange(item.Id, newQty);
                            }
                          }}
                          disabled={isUpdating}
                          className="w-16 h-10 text-center border-x border-gray-300 quantity-input focus:outline-none focus:ring-2 focus:ring-amazon-orange disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.Id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase quantity"
                        >
                          <ApperIcon name="Plus" size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="flex-1 text-right">
                      <span className="text-sm text-gray-600">Subtotal: </span>
                      <span className="text-lg font-bold price-current">
                        ${itemSubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.Id)}
                      className="text-sm text-amazon-info hover:text-amazon-orange font-medium transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveForLater(item.Id)}
                      className="text-sm text-amazon-info hover:text-amazon-orange font-medium transition-colors"
                    >
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold text-amazon-dark mb-6">Order Summary</h2>
            
            {summary && (
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({summary.itemCount} items):</span>
                  <span className="font-semibold text-amazon-dark">
                    ${summary.subtotal.toFixed(2)}
                  </span>
                </div>
                
                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Tax:</span>
                  <span className="font-semibold text-amazon-dark">
                    ${summary.tax.toFixed(2)}
                  </span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <div className="text-right">
                    {summary.freeShipping ? (
                      <div>
                        <span className="font-semibold text-amazon-success">FREE</span>
                        {summary.isPrime && (
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <span className="prime-badge text-[8px] px-1">PRIME</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-semibold text-amazon-dark">
                        ${summary.shipping.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                
                {!summary.freeShipping && summary.amountForFreeShipping > 0 && !summary.isPrime && (
                  <div className="bg-amazon-success bg-opacity-10 rounded-lg p-3">
                    <p className="text-sm text-amazon-success">
                      Add ${summary.amountForFreeShipping.toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}
                
                {/* Divider */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-amazon-dark">Order Total:</span>
                    <span className="text-3xl font-bold price-current">
                      ${summary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-amazon-warning hover:bg-amazon-warning/90 text-amazon-dark font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 mt-6 shadow-lg"
                >
                  Proceed to Checkout
                </button>
                
                {/* Continue Shopping */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-amazon-dark font-medium py-2 px-6 rounded-lg transition-colors mt-3"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;