import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Truck,
  Printer,
  Home,
  Copy,
  Check,
  Calendar,
  CreditCard,
  MapPin,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  MailCheck,
  Pause,
  Play,
  ArrowRight,
  ReceiptText,
  FileCheck
} from 'lucide-react';

interface OrderSuccessPageProps {
  orderId?: string;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const { user, orders, getOrderById } = useStore();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Robust order resolution:
  // 1. Direct ID lookup
  // 2. Lookup by orderNumber
  // 3. Fallback to latest order
  let order = orderId ? getOrderById(orderId) : undefined;
  if (!order && orderId) {
    order = orders.find(
      (o) => o.id === orderId || o.orderNumber?.toUpperCase() === orderId.toUpperCase()
    );
  }
  if (!order && orders.length > 0) {
    order = orders[0];
  }

  // Registered email resolution
  const customerEmail =
    order?.email ||
    order?.shippingAddress?.email ||
    user?.email ||
    'your registered email address';

  // 10-second Auto Redirect Countdown Timer
  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      onNavigate('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNavigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, onNavigate]);

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Estimated delivery: 3 to 5 days from order creation
  const orderDate = order ? new Date(order.createdAt) : new Date();
  const deliveryMin = new Date(orderDate);
  deliveryMin.setDate(deliveryMin.getDate() + 3);
  const deliveryMax = new Date(orderDate);
  deliveryMax.setDate(deliveryMax.getDate() + 5);

  const deliveryString = `${deliveryMin.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })} - ${deliveryMax.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  if (!order) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center max-w-lg w-full space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-[#257335] rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-black text-gray-900">
              No Active Order Found
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              It seems you haven't placed an order recently, or your session has reset. You can track an existing order with its order number.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('/track-order')}
              className="px-5 py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Track by Order ID
            </button>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-5 py-3 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* 10-Second Auto-Redirect Header Banner */}
        <div className="bg-gradient-to-r from-[#18241F] to-[#1E3A2B] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-black text-base text-emerald-400">
                  {countdown}s
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {isPaused
                    ? 'Auto-redirect is paused. Take your time reviewing your order.'
                    : `Redirecting to Homepage automatically in ${countdown} seconds...`}
                </p>
                <p className="text-[11px] text-gray-300">
                  You can pause the countdown or return to the storefront now.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                {isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> Resume Timer
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> Stay on Page
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('/')}
                className="px-4 py-1.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Home className="w-3.5 h-3.5" /> Go Home Now
              </button>
            </div>
          </div>

          {/* Smooth animated progress line */}
          {!isPaused && (
            <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Main celebratory card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8">
          
          {/* Top Success Header */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-emerald-50 text-[#257335] rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-[#257335] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <Sparkles className="w-3 h-3" /> Order Confirmed & In Production
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
                Thank You For Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                We've received your order and our artisan textile team in Panipat has initiated handcrafting, quality inspection, and packaging.
              </p>
            </div>

            {/* Order Number Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-2xl text-xs shadow-inner">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Order No:</span>
              <span className="font-mono font-black text-gray-900 text-base tracking-wide">
                {order.orderNumber}
              </span>
              <button
                onClick={handleCopyOrderNumber}
                className="ml-1 p-1 hover:bg-gray-200 rounded-md text-gray-600 transition-colors cursor-pointer"
                title="Copy Order Number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* PROMINENT NOTICE: Order Number & Invoice Emailed */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border-2 border-emerald-500/30 rounded-2xl p-5 sm:p-6 text-gray-800 space-y-3 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#257335] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <MailCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Order Confirmation & Tax Invoice Emailed</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    Sent
                  </span>
                </h2>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your order details, order number (<strong className="font-mono text-gray-900">{order.orderNumber}</strong>), and official GST tax invoice have been dispatched to your registered email address:
                </p>
                <p className="font-mono font-bold text-emerald-800 text-xs sm:text-sm bg-white/80 border border-emerald-200 px-3 py-1.5 rounded-xl inline-block mt-1">
                  {customerEmail}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-2">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#257335]" />
                Tax Invoice PDF attached with full breakdown & GST details.
              </span>
              <span className="text-gray-500">
                Please check your inbox / promotions folder.
              </span>
            </div>
          </div>

          {/* Key Order Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Estimated Delivery</span>
              <span className="font-bold text-[#257335] flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {deliveryString}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Payment Status</span>
              <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                {order.paymentStatus.toUpperCase()} ({order.paymentMethod.toUpperCase()})
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Current Status</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                {order.status || 'Confirmed'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Amount</span>
              <span className="font-black text-gray-900 text-sm block mt-0.5">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Ordered items list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>Items in this Order ({order.items.length})</span>
              <span className="text-[11px] font-normal text-gray-400">Manufactured in Panipat, India</span>
            </h3>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id || item.productId} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-gray-400">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown & Delivery Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Delivery address */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <MapPin className="w-4 h-4 text-[#E87244]" />
                <span>Shipping Destination</span>
              </div>
              <p className="font-semibold text-gray-800">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress.houseFlat}, {order.shippingAddress.street}
                {order.shippingAddress.landmark ? `, Near ${order.shippingAddress.landmark}` : ''}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-gray-500 font-mono pt-1">
                Contact: {order.shippingAddress.phone}
              </p>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#257335] font-bold">
                  <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{order.shippingFee === 0 ? <strong className="text-[#257335]">FREE</strong> : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax:</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                <span>Grand Total:</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => onNavigate(`/track-order?id=${order?.orderNumber || order.id}`)}
              className="px-6 py-3 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4" /> Track Live Delivery
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>

            <button
              onClick={() => onNavigate('/account')}
              className="px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              My Orders
            </button>

            <button
              onClick={() => onNavigate('/shop')}
              className="px-5 py-3 text-xs font-bold text-[#257335] hover:underline transition-colors cursor-pointer"
            >
              Continue Shopping →
            </button>
          </div>
        </div>

        {/* Brand guarantee banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Mansha Texo 100% Quality Assurance:</strong> 7-Day Hassle-free Exchange & Return Policy on all home textile orders.
            </span>
          </div>
          <button
            onClick={() => onNavigate('/returns')}
            className="text-emerald-300 hover:text-white underline font-semibold text-[11px] whitespace-nowrap cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};
