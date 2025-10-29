import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});

  React.useEffect(() => {
    if (isOpen && items.length > 0) {
      loadProductDetails();
    }
  }, [isOpen, items]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      const productIds = items.map(item => item.productId);
      const productData = {};
      
      for (const id of productIds) {
        if (!products[id]) {
          const product = await productService.getById(id);
          productData[id] = product;
        }
      }
      
      setProducts(prev => ({ ...prev, ...productData }));
    } catch (error) {
      console.error("Error loading product details:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const product = products[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 35 ? 0 : 5.99; // Free shipping over $35
  };

const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }
    
    try {
      await onUpdateQuantity(productId, newQuantity);
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await onRemoveItem(productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = () => {
    onClose();
navigate("/cart");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/");
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 modal-backdrop"
          onClick={onClose}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 cart-drawer ${
          isOpen ? "open" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-amazon-dark">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <Loading variant="cart" />
            ) : items.length === 0 ? (
              <Empty
                variant="cart"
                onAction={handleContinueShopping}
                className="border-0 shadow-none"
              />
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const product = products[item.productId];
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop`;
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.title}
                        </h3>
                        
                        {product.isPrime && (
                          <span className="prime-badge mb-2 inline-block">PRIME</span>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-amazon-dark">
                            ${product.price.toFixed(2)}
                          </span>
                          
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <ApperIcon name="Minus" size={14} />
                          </button>
                          
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 text-center border rounded-lg quantity-input"
                            min="1"
                            max="99"
                          />
                          
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <ApperIcon name="Plus" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 p-4 space-y-4">
              {/* Pricing Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-amazon-success">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <hr className="my-2" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="price-current">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-amazon-orange hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-white hover:bg-gray-50 text-amazon-dark border border-gray-300 py-3 rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {shipping > 0 && (
                <div className="text-center text-sm text-gray-600">
                  <ApperIcon name="Truck" size={16} className="inline mr-1" />
                  Add ${(35 - subtotal).toFixed(2)} for FREE shipping
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;