import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/cart');
  };

  const handleExploreProducts = () => {
    setIsCartDrawerOpen(false);
    onNavigate('/shop');
  };

  const remainingForFreeShipping = Math.max(
    0,
    settings.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
      >
        {/* Cart Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#257335]" />
            <h3 className="text-base font-extrabold text-gray-900">Your Shopping Cart</h3>
            <span className="text-xs bg-emerald-100 text-[#257335] font-bold px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-100/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#257335]">
            <Truck className="w-4 h-4 text-[#257335] flex-shrink-0" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <span className="font-bold text-gray-900">₹{remainingForFreeShipping}</span> more for <span className="underline font-bold">FREE Delivery</span>!
              </span>
            ) : (
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                🎉 Congratulations! You unlocked FREE Standard Delivery!
              </span>
            )}
          </div>
          <div className="w-full bg-emerald-200/50 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#257335] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="py-3.5 flex gap-3.5 items-start group">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-18 h-18 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mt-1">
                    {item.size && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.size}</span>}
                    {item.color && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.color}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-gray-900 min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 font-bold disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.mrp > item.price && (
                        <p className="text-[10px] text-gray-400 line-through">
                          ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#257335] mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Your cart is empty</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Explore our premium collection of bath mats, carpets, rugs, and runners to fill your cart.
              </p>
              <button
                onClick={handleExploreProducts}
                className="mt-5 px-5 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Browse Collections
              </button>
            </div>
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
            {/* Coupon Code Section */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-300/60 p-2 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 text-[#257335] font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon {appliedCoupon.code} applied!</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError('');
                  }}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

            {/* Price Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-gray-200/60">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#257335] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{cartShipping === 0 ? <span className="text-[#257335] font-bold">FREE</span> : `₹${cartShipping}`}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST (Estimated {settings.taxRatePercent}%)</span>
                <span>₹{cartTax.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleViewCart}
                className="py-2.5 px-3 border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
              >
                View Full Cart
              </button>
              <button
                onClick={handleCheckout}
                className="py-2.5 px-3 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#257335]" />
              <span>Safe & Encrypted 256-bit Checkout</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
