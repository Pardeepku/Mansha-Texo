import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Plus,
  QrCode,
  Banknote,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  onOrderPlaced,
}) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTax,
    cartTotal,
    appliedCoupon,
    couponDiscountAmount,
    user,
    saveAddress,
    createOrder,
    settings,
    addToast,
  } = useStore();

  // Contact Info
  const [email, setEmail] = useState(user?.email || 'customer@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [customerName, setCustomerName] = useState(user?.name || 'Aarav Mehta');

  // Address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.savedAddresses[0]?.id || 'new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(
    !user?.savedAddresses || user.savedAddresses.length === 0
  );

  // New address fields
  const [houseFlat, setHouseFlat] = useState('Flat 402, Green Glen Heights');
  const [street, setStreet] = useState('Outer Ring Road');
  const [area, setArea] = useState('Bellandur');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560103');
  const [landmark, setLandmark] = useState('Near Central Mall');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8921 4482 9012');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardName, setCardName] = useState('Aarav Mehta');

  // Order notes
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-1">Please add items to proceed with checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-4 px-6 py-2.5 bg-[#257335] text-white font-bold text-xs rounded-xl"
        >
          Go to Catalog
        </button>
      </div>
    );
  }

  const finalShipping =
    shippingMethod === 'express' ? cartShipping + 99 : cartShipping;
  const finalTotal = cartTotal + (shippingMethod === 'express' ? 99 : 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let shippingAddress = {
      fullName: customerName,
      phone,
      email,
      houseFlat,
      street,
      area,
      city,
      state,
      pincode,
      landmark,
    };

    if (selectedAddressId !== 'new' && user?.savedAddresses) {
      const existing = user.savedAddresses.find((a) => a.id === selectedAddressId);
      if (existing) {
        shippingAddress = { ...existing, email: existing.email || email };
      }
    } else if (user) {
      // Save address if logged in
      saveAddress({
        fullName: customerName,
        phone,
        email,
        houseFlat,
        street,
        area,
        city,
        state,
        pincode,
        landmark,
        isDefault: true,
      });
    }

    setTimeout(() => {
      const order = createOrder({
        userId: user?.uid,
        customerId: user?.uid || `guest-${Date.now()}`,
        customerName,
        customerEmail: email,
        email,
        customerPhone: phone,
        phone,
        items: cart,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        shippingFee: finalShipping,
        shippingCharge: finalShipping,
        codFee: 0,
        total: finalTotal,
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        orderStatus: 'Confirmed',
        notes: orderNotes,
      });

      // Confetti fire
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback
      }

      setIsSubmitting(false);
      addToast('success', 'Order Confirmed!', `Order ${order.orderNumber} placed successfully.`);
      onOrderPlaced(order.id);
    }, 900);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-4 sm:py-12 pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <Lock className="w-5 h-5 text-[#257335]" />
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900">
            Express Checkout
          </h1>
          <span className="text-xs bg-emerald-100 text-[#257335] font-bold px-2.5 py-1 rounded-full ml-auto">
            100% Encrypted & Safe
          </span>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#257335] text-white text-xs flex items-center justify-center font-mono">
                  1
                </span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                  <span className="text-[10px] text-gray-400">Order invoice & dispatch tracking will be emailed.</span>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                  <span className="text-[10px] text-gray-400">For SMS delivery updates from courier.</span>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#257335] text-white text-xs flex items-center justify-center font-mono">
                  2
                </span>
                Delivery Address
              </h2>

              {/* Saved addresses selector */}
              {user?.savedAddresses && user.savedAddresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-bold text-gray-700">Choose from Saved Addresses:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id || '');
                          setIsAddingNewAddress(false);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs ${
                          selectedAddressId === addr.id
                            ? 'border-[#257335] bg-emerald-50/50 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-gray-900">{addr.fullName}</p>
                        <p className="text-gray-600 mt-0.5">{addr.houseFlat}, {addr.street}</p>
                        <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAddressId('new');
                        setIsAddingNewAddress(true);
                      }}
                      className={`p-3 rounded-2xl border border-dashed flex items-center justify-center gap-1.5 text-xs font-bold text-[#257335] cursor-pointer ${
                        selectedAddressId === 'new' ? 'border-[#257335] bg-emerald-50/30' : 'border-gray-300'
                      }`}
                    >
                      <Plus className="w-4 h-4" /> Add New Address
                    </button>
                  </div>
                </div>
              )}

              {/* New address inputs */}
              {(isAddingNewAddress || selectedAddressId === 'new') && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Flat / House No. / Building *
                      </label>
                      <input
                        type="text"
                        required
                        value={houseFlat}
                        onChange={(e) => setHouseFlat(e.target.value)}
                        placeholder="e.g. Flat 402, Tower B"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Street / Colony / Road *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. Outer Ring Road"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Area / Locality
                      </label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Bellandur"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="e.g. 560103"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Central Mall"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Shipping Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#257335] text-white text-xs flex items-center justify-center font-mono">
                  3
                </span>
                Shipping Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    shippingMethod === 'standard'
                      ? 'border-[#257335] bg-emerald-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#257335] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Standard Delivery</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">3-5 business days across India</p>
                    <span className="text-xs font-extrabold text-[#257335] mt-1 block">
                      {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    shippingMethod === 'express'
                      ? 'border-[#257335] bg-emerald-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#E87244] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Express Priority Air</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">1-2 business days with priority dispatch</p>
                    <span className="text-xs font-extrabold text-gray-900 mt-1 block">
                      ₹{cartShipping + 99}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#257335] text-white text-xs flex items-center justify-center font-mono">
                  4
                </span>
                Payment Options
              </h2>

              <div className="space-y-3">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#257335] bg-emerald-50/40'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-[#257335]" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Instant UPI (GPay, PhonePe, Paytm, BHIM)</h4>
                        <p className="text-[11px] text-gray-500">Fastest checkout with Zero Convenience Fee</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      RECOMMENDED
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Enter UPI VPA ID:
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis / yourname@upi"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* Cards Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#257335] bg-emerald-50/40'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#257335]" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Credit / Debit Cards</h4>
                      <p className="text-[11px] text-gray-500">Visa, MasterCard, RuPay, Diners, American Express</p>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-emerald-100 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Expiry MM/YY</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">CVV Code</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#257335] bg-emerald-50/40'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-[#E87244]" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-gray-500">Pay cash or scan QR at your doorstep upon arrival</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5 sticky top-28">
              <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                Items in Order ({cart.length})
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-gray-100 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity} • {item.size}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#257335] font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{finalShipping === 0 ? <span className="text-[#257335] font-bold">FREE</span> : `₹${finalShipping}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST ({settings.taxRatePercent}%)</span>
                  <span>₹{cartTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-3">
                  <span>Payable Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#257335] hover:bg-[#1E5C2B] disabled:bg-gray-400 text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Safe Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#257335]" />
                <span>Verified SSL Payment Gateway</span>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Place Order Bar */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-4 py-2.5 z-40 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">Payable Amount</span>
              <span className="text-base font-black text-gray-900">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#257335] active:bg-[#1E5C2B] disabled:bg-gray-400 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
