import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Plus,
  Minus
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const remainingForFreeShipping = Math.max(
    0,
    settings.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-[#257335] mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md">
          Looks like you haven't added any luxury bath mats, rugs, or furnishings to your cart yet.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-6 px-8 py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
          Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-[#257335] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Add <span className="font-extrabold text-gray-900">₹{remainingForFreeShipping}</span> more to unlock <span className="underline">FREE Delivery</span>!
                    </span>
                  ) : (
                    <span>🎉 You unlocked FREE Standard Delivery!</span>
                  )}
                </span>
                <span>{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#257335] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 rounded-2xl object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-[#257335] uppercase tracking-wider">
                        {item.categoryName}
                      </span>
                      <h3
                        onClick={() => onNavigate(`/product/${item.productSlug}`)}
                        className="text-sm font-bold text-gray-900 hover:text-[#257335] transition-colors cursor-pointer"
                      >
                        {item.productName}
                      </h3>
                      <div className="flex gap-2 text-xs text-gray-500 mt-1">
                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                        {item.color && <span>• Color: <strong>{item.color}</strong></span>}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1 sm:hidden">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-900 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Desktop */}
                    <div className="hidden sm:block text-right min-w-[90px]">
                      <div className="text-sm font-extrabold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      {item.mrp > item.price && (
                        <div className="text-xs text-gray-400 line-through">
                          ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => onNavigate('/shop')}
                className="text-xs font-bold text-[#257335] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear Entire Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Apply Discount Coupon
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-[#257335] font-bold">
                      <Tag className="w-4 h-4" />
                      <span>{appliedCoupon.code} ({appliedCoupon.discountPercent ? `${appliedCoupon.discountPercent}% OFF` : `₹${appliedCoupon.discountAmount} OFF`})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 px-3 py-2.5 text-xs uppercase bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#257335] font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {cartShipping === 0 ? <span className="text-[#257335] font-bold">FREE</span> : `₹${cartShipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST ({settings.taxRatePercent}%)</span>
                  <span className="font-semibold text-gray-900">₹{cartTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-3">
                  <span>Grand Total</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full py-4 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#257335]" />
                  <span>256-bit Bank-Grade SSL Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#E87244]" />
                  <span>7-Day Return & Replacement Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
