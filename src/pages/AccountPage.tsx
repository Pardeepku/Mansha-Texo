import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Shield,
  Plus,
  Trash2,
  Truck,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { OrderStatus } from '../types';

interface AccountPageProps {
  onNavigate: (path: string) => void;
  initialTab?: 'profile' | 'orders' | 'addresses';
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigate,
  initialTab = 'profile',
}) => {
  const {
    user,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile,
    saveAddress,
    deleteAddress,
    orders,
    addToCart,
    addToast,
    isAdmin,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>(initialTab);

  // Login form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('priya.sharma@example.com');
  const [loginName, setLoginName] = useState('Priya Sharma');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('saini.pardeep45@gmail.com');
  const [customGoogleName, setCustomGoogleName] = useState('Pardeep Saini');

  // Address modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');

  // Handle Regular Auth
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(loginEmail, 'customer', loginName);
  };

  // Handle Google Auth
  const handleGoogleSignInClick = () => {
    setIsGoogleModalOpen(true);
  };

  const handleExecuteGoogleLogin = (email: string, name: string, avatarUrl?: string) => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      loginWithGoogle({
        email,
        name,
        avatar: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=257335`,
      });
      setIsGoogleLoading(false);
      setIsGoogleModalOpen(false);
    }, 600);
  };

  const handleAdminQuickLogin = () => {
    loginUser('admin@manshatexo.com', 'admin', 'Mansha Admin');
    addToast('success', 'Admin Access Granted', 'Signed in as Administrator. Opening Admin Dashboard...');
    onNavigate('/admin');
  };

  // Reorder
  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.items.forEach((item) => {
        // Find base product or add item
        addToCart(
          {
            id: item.productId,
            name: item.productName,
            slug: item.productSlug,
            description: '',
            shortDescription: '',
            price: item.price,
            mrp: item.mrp,
            discountPercentage: 20,
            categoryId: 'cat-1',
            categorySlug: 'bath-mats',
            categoryName: item.categoryName,
            images: [item.productImage],
            sizes: [item.size || 'Standard'],
            colors: [item.color || 'Standard'],
            material: 'Premium Weave',
            stock: 50,
            rating: 5,
            reviewCount: 10,
            isActive: true,
            sku: 'MT-REORDER',
            tags: [],
            variants: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          item.quantity
        );
      });
      addToast('success', 'Items Added to Cart', 'All items from this order have been added to your cart.');
      onNavigate('/cart');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddress({
      fullName: addrName,
      phone: addrPhone,
      houseFlat: addrHouse,
      street: addrStreet,
      area: addrArea,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      isDefault: false,
    });
    setIsAddressModalOpen(false);
    setAddrName('');
    setAddrPhone('');
    setAddrHouse('');
    setAddrStreet('');
    setAddrArea('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
  };

  // If not logged in, show elegant Indian Ecommerce login/register card
  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#257335]">
              Mansha Texo Account
            </span>
            <h2 className="font-serif text-2xl font-black text-gray-900 mt-1">
              {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage your orders, save delivery addresses, and track shipments in real-time.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setAuthMode('login')}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                authMode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                authMode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="yourname@domain.com"
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {authMode === 'login' ? 'Sign In with Email' : 'Create Free Account with Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase text-gray-400">or</span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          {/* Google Sign In / Register Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignInClick}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-gray-400 hover:shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{authMode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-gray-100 text-center space-y-2">
            <p className="text-[11px] text-gray-400 font-medium">Quick Development / Evaluation Access:</p>
            <button
              onClick={handleAdminQuickLogin}
              className="w-full py-2 bg-emerald-50 text-[#257335] hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" /> Sign In as Store Administrator (Admin Panel)
            </button>
          </div>
        </div>

        {/* Interactive Google Account Chooser Modal */}
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 space-y-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span className="font-semibold text-sm text-gray-800">Sign in with Google</span>
                </div>
                <button
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Choose an account to continue to <strong className="text-gray-800">Mansha Texo</strong>:
              </p>

              {/* Account List */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={() =>
                    handleExecuteGoogleLogin(
                      'saini.pardeep45@gmail.com',
                      'Pardeep Saini',
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                    )
                  }
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm ring-2 ring-emerald-200">
                    PS
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#257335]">Pardeep Saini</p>
                    <p className="text-[11px] text-gray-500 truncate">saini.pardeep45@gmail.com</p>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">Default</span>
                </button>

                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={() =>
                    handleExecuteGoogleLogin(
                      'priya.sharma@gmail.com',
                      'Priya Sharma',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
                    )
                  }
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E87244] text-white font-bold flex items-center justify-center flex-shrink-0 text-sm ring-2 ring-orange-200">
                    PS
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#257335]">Priya Sharma</p>
                    <p className="text-[11px] text-gray-500 truncate">priya.sharma@gmail.com</p>
                  </div>
                </button>
              </div>

              {/* Custom Google Account Section */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-700 mb-2">Or Use Another Google Account:</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#257335]"
                  />
                  <input
                    type="email"
                    placeholder="Google Email (@gmail.com)"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#257335]"
                  />
                  <button
                    type="button"
                    disabled={isGoogleLoading || !customGoogleEmail}
                    onClick={() => handleExecuteGoogleLogin(customGoogleEmail, customGoogleName || 'Google User')}
                    className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGoogleLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Sign in with this Account'
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 text-center leading-relaxed">
                By continuing, Google will share your name, email address, and profile picture with Mansha Texo.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filter orders for logged-in user
  const userOrders = orders;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Nav Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              {/* User Profile Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#257335]/30 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#257335] flex items-center justify-center font-serif text-xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-extrabold text-gray-900 truncate">{user.name}</h3>
                    {user.provider === 'google' && (
                      <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        Google
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#257335] bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {user.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
                  </span>
                </div>
              </div>

              {/* Mobile Segmented Tab Selector */}
              <div className="lg:hidden grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-white text-[#257335] shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'orders'
                      ? 'bg-white text-[#257335] shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>Orders</span>
                  {userOrders.length > 0 && (
                    <span className="text-[10px] bg-emerald-100 text-[#257335] px-1.5 py-0.2 rounded-full font-bold">
                      {userOrders.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-white text-[#257335] shadow-xs font-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Addresses
                </button>
              </div>

              {/* Navigation Tabs (Desktop) */}
              <nav className="hidden lg:block space-y-1 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors text-left cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-50 text-[#257335]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" /> Personal Profile
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-colors text-left cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-emerald-50 text-[#257335]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package className="w-4 h-4" /> My Orders
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {userOrders.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors text-left cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-emerald-50 text-[#257335]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-4 h-4" /> Saved Addresses
                </button>

                {isAdmin && (
                  <button
                    onClick={() => onNavigate('/admin')}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 text-left font-bold"
                  >
                    <Shield className="w-4 h-4 text-[#257335]" /> Go to Admin Dashboard
                  </button>
                )}

                <button
                  onClick={logoutUser}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-red-600 hover:bg-red-50 text-left cursor-pointer pt-3 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </nav>

              {/* Mobile Quick Action Strip (Admin / Sign out) */}
              <div className="lg:hidden flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                {isAdmin && (
                  <button
                    onClick={() => onNavigate('/admin')}
                    className="text-xs font-bold text-[#257335] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin Portal
                  </button>
                )}
                <button
                  onClick={logoutUser}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content (8 cols) */}
          <div className="lg:col-span-8">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-3">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => updateUserProfile({ name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={user.phone || ''}
                      onChange={(e) => updateUserProfile({ phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3.5 py-2.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Account Role</label>
                    <input
                      type="text"
                      disabled
                      value={user.role.toUpperCase()}
                      className="w-full px-3.5 py-2.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-lg font-extrabold text-gray-900 mb-2">Order History</h2>

                {userOrders.length > 0 ? (
                  userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-100 gap-2">
                        <div>
                          <p className="text-sm font-black font-mono text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#257335] bg-emerald-50 px-3 py-1 rounded-full uppercase">
                            {String(order.orderStatus || order.status || OrderStatus.PENDING).replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-extrabold text-gray-900">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.productImage}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                              />
                              <div>
                                <h4 className="font-bold text-gray-900">{item.productName}</h4>
                                <p className="text-[11px] text-gray-500">
                                  Qty: {item.quantity} • {item.size} • {item.color}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-2">
                        <button
                          onClick={() => onNavigate(`/track-order?id=${order.orderNumber}`)}
                          className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-[#257335] text-gray-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#257335]" /> Track Shipment
                        </button>

                        <button
                          onClick={() => handleReorder(order.id)}
                          className="px-4 py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reorder Items
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                    <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-800">No orders placed yet</p>
                    <p className="text-xs text-gray-500 mt-1">Explore our collections to make your first order.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-extrabold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="px-4 py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3 relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-gray-900">{addr.fullName}</h4>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-[#257335] bg-emerald-50 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          {addr.houseFlat}, {addr.street}<br />
                          {addr.area && `${addr.area}, `}{addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-mono">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => deleteAddress(addr.id || '')}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Add New Delivery Address</h3>

            <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Flat / House No. *</label>
                <input
                  type="text"
                  required
                  value={addrHouse}
                  onChange={(e) => setAddrHouse(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Street / Colony *</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#257335] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
