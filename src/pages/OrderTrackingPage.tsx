import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  onNavigate: (path: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId,
  onNavigate,
}) => {
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState(() => {
    if (initialOrderId) {
      return orders.find(
        (o) =>
          o.id === initialOrderId ||
          o.orderNumber.toLowerCase() === initialOrderId.toLowerCase()
      );
    }
    return orders[0]; // Default demo order
  });

  useEffect(() => {
    if (initialOrderId) {
      const found = orders.find(
        (o) =>
          o.id === initialOrderId ||
          o.orderNumber.toLowerCase() === initialOrderId.toLowerCase()
      );
      if (found) setActiveOrder(found);
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const query = searchInput.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.orderNumber.toLowerCase() === query ||
        (o.phone || o.customerPhone || '').includes(query) ||
        (o.email || (o as any).customerEmail || '').toLowerCase() === query
    );
    if (found) {
      setActiveOrder(found);
    } else {
      alert(`No order found matching "${searchInput}". Check your order number or phone.`);
    }
  };

  const steps = [
    { key: OrderStatus.PENDING, label: 'Order Placed', desc: 'Order received & payment confirmed' },
    { key: OrderStatus.CONFIRMED, label: 'Confirmed', desc: 'Verified by fulfillment team' },
    { key: OrderStatus.PROCESSING, label: 'Packing & Quality Check', desc: 'Handcrafted & boxed at warehouse' },
    { key: OrderStatus.SHIPPED, label: 'Handed to Courier', desc: 'In transit to your nearest hub' },
    { key: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', desc: 'Agent out for doorstep drop' },
    { key: OrderStatus.DELIVERED, label: 'Delivered', desc: 'Successfully delivered' },
  ];

  const getStepIndex = (status?: OrderStatus) => {
    const map: Record<OrderStatus, number> = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.CONFIRMED]: 1,
      [OrderStatus.PROCESSING]: 2,
      [OrderStatus.PACKED]: 2,
      [OrderStatus.SHIPPED]: 3,
      [OrderStatus.OUT_FOR_DELIVERY]: 4,
      [OrderStatus.DELIVERED]: 5,
      [OrderStatus.CANCELLED]: -1,
      [OrderStatus.RETURNED]: -1,
      [OrderStatus.REFUNDED]: -1,
    };
    return (status && map[status]) ?? 0;
  };

  const activeOrderStatus = activeOrder ? (activeOrder.orderStatus || activeOrder.status || OrderStatus.PENDING) : OrderStatus.PENDING;
  const currentStepIndex = activeOrder ? getStepIndex(activeOrderStatus) : 0;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-[#257335] text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-4 h-4" /> Live Courier Tracking
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900">
            Track Your Shipment
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Enter your Mansha Texo Order Number (e.g. <span className="font-mono font-bold text-gray-800">MT-2026-0812</span>) or registered phone number.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-10">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Order ID (e.g. MT-2026-0812)..."
              className="w-full px-4 py-3.5 pl-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#257335] shadow-sm font-mono"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-2xl shadow-md transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Tracking Details */}
        {activeOrder ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8">
            {/* Top Meta */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Tracking Order
                </span>
                <h3 className="text-xl font-black font-mono text-gray-900">
                  {activeOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-extrabold uppercase rounded-full tracking-wider ${
                    activeOrderStatus === OrderStatus.DELIVERED
                      ? 'bg-emerald-100 text-[#257335]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {String(activeOrderStatus || '').replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Courier partner box */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#257335] text-white flex items-center justify-center font-black text-xs">
                  EXP
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Courier: {activeOrder.courierName || 'Delhivery Express Logistics'}
                  </p>
                  <p className="text-[11px] text-gray-600 font-mono">
                    AWB / Tracking No: <span className="font-bold text-gray-900">{activeOrder.trackingNumber || 'DL9823471029IN'}</span>
                  </p>
                </div>
              </div>

              {activeOrder.estimatedDeliveryDate && (
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 uppercase font-semibold">Estimated Arrival</span>
                  <p className="text-xs font-bold text-[#257335]">
                    {new Date(activeOrder.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Visual Timeline Progress */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
                Shipment Status
              </h4>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${
                          isCompleted
                            ? 'bg-[#257335] text-white shadow-md'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <h5
                            className={`text-sm font-bold ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </h5>
                          {isCurrent && (
                            <span className="text-[9px] bg-[#E87244] text-white font-extrabold uppercase px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Address & Items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100 text-xs">
              <div>
                <h5 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#257335]" /> Destination
                </h5>
                <p className="text-gray-700 font-semibold">{activeOrder.shippingAddress.fullName}</p>
                <p className="text-gray-500">
                  {activeOrder.shippingAddress.houseFlat}, {activeOrder.shippingAddress.street}
                </p>
                <p className="text-gray-500">
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#257335]" /> Package Contents
                </h5>
                <ul className="space-y-1 text-gray-600">
                  {activeOrder.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.productName} ({item.size})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No active tracking data</h3>
            <p className="text-xs text-gray-500 mt-1">Please search with an order number.</p>
          </div>
        )}
      </div>
    </div>
  );
};
