import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Order, OrderStatus, Coupon } from '../types';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Boxes,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Truck,
  TrendingUp,
  IndianRupee,
  Users,
  AlertTriangle,
  Search,
  Eye,
  LogOut,
  Save,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  Layers,
  Image,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Link2,
  MoveUp,
  MoveDown,
  Palette,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    products,
    categories,
    orders,
    coupons,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    updateSettings,
    addToast,
    logoutUser,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'inventory' | 'coupons' | 'settings'
  >('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.id || '');
  const [prodPrice, setProdPrice] = useState(599);
  const [prodMrp, setProdMrp] = useState(999);
  const [prodStock, setProdStock] = useState(50);
  const [prodMaterial, setProdMaterial] = useState('100% Ring-Spun Cotton');
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  );
  const [prodSizes, setProdSizes] = useState('40x60 cm, 50x80 cm');
  const [prodColors, setProdColors] = useState('Emerald Forest, Neutral Beige');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState(
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'
  );

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [orderCourierName, setOrderCourierName] = useState('Delhivery Express');
  const [orderTrackingNum, setOrderTrackingNum] = useState('');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(15);
  const [couponMinOrder, setCouponMinOrder] = useState(599);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState<number | ''>(500);
  const [couponDesc, setCouponDesc] = useState('');
  const [couponExpiryDays, setCouponExpiryDays] = useState(30);

  // Settings Sub-Tabs
  const [settingsSubTab, setSettingsSubTab] = useState<
    'branding' | 'contact' | 'navigation' | 'footer' | 'policies'
  >('branding');

  // Menu Link Modal / State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);
  const [menuLabel, setMenuLabel] = useState('');
  const [menuPath, setMenuPath] = useState('');
  const [menuBadge, setMenuBadge] = useState('');
  const [menuIsExternal, setMenuIsExternal] = useState(false);

  // Footer Link Modals
  const [isFooterShopModalOpen, setIsFooterShopModalOpen] = useState(false);
  const [footerShopLabel, setFooterShopLabel] = useState('');
  const [footerShopPath, setFooterShopPath] = useState('');

  const [isFooterCareModalOpen, setIsFooterCareModalOpen] = useState(false);
  const [footerCareLabel, setFooterCareLabel] = useState('');
  const [footerCarePath, setFooterCarePath] = useState('');

  // Value Prop Modal
  const [isValuePropModalOpen, setIsValuePropModalOpen] = useState(false);
  const [editingVpIndex, setEditingVpIndex] = useState<number | null>(null);
  const [vpTitle, setVpTitle] = useState('');
  const [vpDesc, setVpDesc] = useState('');
  const [vpIcon, setVpIcon] = useState<'truck' | 'rotate-ccw' | 'shield' | 'credit-card' | 'sparkles' | 'phone' | 'heart'>('truck');

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const lowStockCount = products.filter((p) => p.stock < 15).length;
  const pendingOrders = orders.filter((o) => {
    const st = o.orderStatus || o.status;
    return st === OrderStatus.PENDING || st === OrderStatus.CONFIRMED;
  }).length;

  // Open Edit Product
  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.categoryId);
    setProdPrice(p.price);
    setProdMrp(p.mrp);
    setProdStock(p.stock);
    setProdMaterial(p.material);
    setProdImage(p.images[0] || '');
    setProdSizes(p.sizes.join(', '));
    setProdColors(p.colors.join(', '));
    setProdDesc(p.description);
    setProdIsFeatured(!!p.isFeatured);
    setProdIsBestSeller(!!p.isBestSeller);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryObj = categories.find((c) => c.id === prodCategory) || categories[0];
    const sizesArray = prodSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colorsArray = prodColors.split(',').map((c) => c.trim()).filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        price: Number(prodPrice),
        mrp: Number(prodMrp),
        stock: Number(prodStock),
        material: prodMaterial,
        categoryId: categoryObj.id,
        categorySlug: categoryObj.slug,
        categoryName: categoryObj.name,
        images: [prodImage],
        sizes: sizesArray.length ? sizesArray : ['Standard'],
        colors: colorsArray.length ? colorsArray : ['Standard'],
        description: prodDesc,
        isFeatured: prodIsFeatured,
        isBestSeller: prodIsBestSeller,
      });
      addToast('success', 'Product Updated', `${prodName} saved successfully.`);
    } else {
      const slug = prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      addProduct({
        name: prodName,
        slug,
        description: prodDesc || `${prodName} manufactured by Mansha Texo with high-density fibers.`,
        shortDescription: `Premium ${categoryObj.name} for home luxury.`,
        price: Number(prodPrice),
        mrp: Number(prodMrp),
        discountPercentage: Math.round(((prodMrp - prodPrice) / prodMrp) * 100),
        categoryId: categoryObj.id,
        categorySlug: categoryObj.slug,
        categoryName: categoryObj.name,
        images: [prodImage],
        sizes: sizesArray.length ? sizesArray : ['Standard (40x60 cm)'],
        colors: colorsArray.length ? colorsArray : ['Natural Beige'],
        material: prodMaterial,
        stock: Number(prodStock),
        rating: 4.8,
        reviewCount: 4,
        isActive: true,
        isFeatured: prodIsFeatured,
        isBestSeller: prodIsBestSeller,
        isNewArrival: true,
        sku: `MT-${Math.floor(1000 + Math.random() * 9000)}`,
        tags: [categoryObj.name.toLowerCase()],
        variants: [],
      });
      addToast('success', 'Product Created', `${prodName} added to active catalog.`);
    }

    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    addCategory({
      name: catName,
      slug,
      description: catDesc,
      image: catImage,
      isActive: true,
      order: categories.length + 1,
    });
    setIsCategoryModalOpen(false);
    setCatName('');
    setCatDesc('');
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const val = Number(couponValue) || 10;
    const minVal = Number(couponMinOrder) || 0;
    const maxDisc = couponMaxDiscount ? Number(couponMaxDiscount) : undefined;
    const expiry = new Date(Date.now() + (Number(couponExpiryDays) || 30) * 24 * 60 * 60 * 1000).toISOString();

    addCoupon({
      code: couponCode.toUpperCase().trim(),
      discountType: couponType,
      discountValue: val,
      discountPercent: couponType === 'percentage' ? val : undefined,
      discountAmount: couponType === 'fixed' ? val : undefined,
      minOrderValue: minVal,
      minOrderAmount: minVal,
      maxDiscount: maxDisc,
      isActive: true,
      expiryDate: expiry,
      description: couponDesc.trim() || `${val}${couponType === 'fixed' ? ' ₹' : '%'} OFF on orders above ₹${minVal}`,
    });

    setIsCouponModalOpen(false);
    setCouponCode('');
    setCouponDesc('');
  };

  // Menu Links Handlers
  const handleOpenAddMenu = () => {
    setEditingMenuIndex(null);
    setMenuLabel('');
    setMenuPath('/category/');
    setMenuBadge('');
    setMenuIsExternal(false);
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (idx: number) => {
    const item = settings.menuLinks?.[idx];
    if (!item) return;
    setEditingMenuIndex(idx);
    setMenuLabel(item.label);
    setMenuPath(item.path);
    setMenuBadge(item.badge || '');
    setMenuIsExternal(!!item.isExternal);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenuLink = (e: React.FormEvent) => {
    e.preventDefault();
    const currentLinks = [...(settings.menuLinks || [])];
    const newLink = {
      id: editingMenuIndex !== null && currentLinks[editingMenuIndex] ? currentLinks[editingMenuIndex].id : `menu-${Date.now()}`,
      label: menuLabel.trim(),
      path: menuPath.trim(),
      badge: menuBadge.trim() || undefined,
      isExternal: menuIsExternal,
    };

    if (editingMenuIndex !== null) {
      currentLinks[editingMenuIndex] = newLink;
    } else {
      currentLinks.push(newLink);
    }

    updateSettings({ menuLinks: currentLinks });
    setIsMenuModalOpen(false);
    addToast('success', 'Menu Updated', `Navigation link "${menuLabel}" saved successfully.`);
  };

  const handleDeleteMenuLink = (idx: number) => {
    const currentLinks = [...(settings.menuLinks || [])];
    const removed = currentLinks.splice(idx, 1);
    updateSettings({ menuLinks: currentLinks });
    addToast('info', 'Link Removed', `Removed "${removed[0]?.label}" from header menu.`);
  };

  const handleMoveMenuLink = (idx: number, direction: 'up' | 'down') => {
    const currentLinks = [...(settings.menuLinks || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentLinks.length) return;
    const temp = currentLinks[idx];
    currentLinks[idx] = currentLinks[targetIdx];
    currentLinks[targetIdx] = temp;
    updateSettings({ menuLinks: currentLinks });
  };

  // Footer Shop Links Handlers
  const handleSaveFooterShopLink = (e: React.FormEvent) => {
    e.preventDefault();
    const currentLinks = [...(settings.footer?.shopLinks || [])];
    currentLinks.push({
      id: `fl-${Date.now()}`,
      label: footerShopLabel.trim(),
      path: footerShopPath.trim(),
    });
    updateSettings({
      footer: {
        ...settings.footer,
        shopLinks: currentLinks,
      },
    });
    setIsFooterShopModalOpen(false);
    setFooterShopLabel('');
    setFooterShopPath('');
    addToast('success', 'Footer Link Added', `Shop link "${footerShopLabel}" added.`);
  };

  const handleDeleteFooterShopLink = (idx: number) => {
    const currentLinks = [...(settings.footer?.shopLinks || [])];
    currentLinks.splice(idx, 1);
    updateSettings({
      footer: {
        ...settings.footer,
        shopLinks: currentLinks,
      },
    });
    addToast('info', 'Link Removed', 'Footer shop collection link removed.');
  };

  // Footer Customer Care Links Handlers
  const handleSaveFooterCareLink = (e: React.FormEvent) => {
    e.preventDefault();
    const currentLinks = [...(settings.footer?.customerCareLinks || [])];
    currentLinks.push({
      id: `cc-${Date.now()}`,
      label: footerCareLabel.trim(),
      path: footerCarePath.trim(),
    });
    updateSettings({
      footer: {
        ...settings.footer,
        customerCareLinks: currentLinks,
      },
    });
    setIsFooterCareModalOpen(false);
    setFooterCareLabel('');
    setFooterCarePath('');
    addToast('success', 'Care Link Added', `Customer care link "${footerCareLabel}" added.`);
  };

  const handleDeleteFooterCareLink = (idx: number) => {
    const currentLinks = [...(settings.footer?.customerCareLinks || [])];
    currentLinks.splice(idx, 1);
    updateSettings({
      footer: {
        ...settings.footer,
        customerCareLinks: currentLinks,
      },
    });
    addToast('info', 'Link Removed', 'Customer care link removed.');
  };

  // Value Proposition Handlers
  const handleOpenEditVp = (idx: number) => {
    const vp = settings.footer?.valueProps?.[idx];
    if (!vp) return;
    setEditingVpIndex(idx);
    setVpTitle(vp.title);
    setVpDesc(vp.description);
    setVpIcon(vp.icon);
    setIsValuePropModalOpen(true);
  };

  const handleSaveValueProp = (e: React.FormEvent) => {
    e.preventDefault();
    const currentVps = [...(settings.footer?.valueProps || [])];
    const newVp = {
      id: editingVpIndex !== null && currentVps[editingVpIndex] ? currentVps[editingVpIndex].id : `vp-${Date.now()}`,
      title: vpTitle.trim(),
      description: vpDesc.trim(),
      icon: vpIcon,
    };
    if (editingVpIndex !== null) {
      currentVps[editingVpIndex] = newVp;
    } else {
      currentVps.push(newVp);
    }
    updateSettings({
      footer: {
        ...settings.footer,
        valueProps: currentVps,
      },
    });
    setIsValuePropModalOpen(false);
    addToast('success', 'Badge Updated', `Trust badge "${vpTitle}" saved.`);
  };

  const handleDeleteValueProp = (idx: number) => {
    const currentVps = [...(settings.footer?.valueProps || [])];
    currentVps.splice(idx, 1);
    updateSettings({
      footer: {
        ...settings.footer,
        valueProps: currentVps,
      },
    });
    addToast('info', 'Badge Removed', 'Value proposition badge removed.');
  };

  return (
    <div className="bg-[#111815] min-h-screen text-gray-100 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-[#18241F] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#257335] text-white flex items-center justify-center font-serif font-black text-base shadow-sm">
            MT
          </div>
          <div>
            <h1 className="font-serif font-extrabold text-sm text-white tracking-wide flex items-center gap-2">
              Mansha Texo Operations Hub
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full">
                ADMIN v2.0
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">Panipat Manufacturing & Dispatch Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Storefront
          </button>
          <button
            onClick={() => {
              logoutUser();
              onNavigate('/');
            }}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#141E1A] border-r border-white/10 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4" /> Products Catalog
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <FolderTree className="w-4 h-4" /> Category Tree
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{categories.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" /> Orders & Shipments
            </span>
            {pendingOrders > 0 && (
              <span className="text-[10px] bg-[#E87244] text-white font-bold px-2 py-0.5 rounded-full">
                {pendingOrders} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <Boxes className="w-4 h-4" /> Stock Controller
            </span>
            {lowStockCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded-full">
                {lowStockCount} low
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coupons' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" /> Discount Coupons
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#257335] text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Store Settings
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#18241F] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Total Sales Revenue</span>
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-serif text-white">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +18.4% this month
                  </p>
                </div>

                <div className="bg-[#18241F] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Total Orders Placed</span>
                    <ShoppingBag className="w-4 h-4 text-[#E87244]" />
                  </div>
                  <div className="text-2xl font-black font-serif text-white">
                    {totalOrders}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {pendingOrders} awaiting fulfillment
                  </p>
                </div>

                <div className="bg-[#18241F] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Live Products</span>
                    <Package className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black font-serif text-white">
                    {products.length}
                  </div>
                  <p className="text-[11px] text-gray-400">Across {categories.length} categories</p>
                </div>

                <div className="bg-[#18241F] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black font-serif text-amber-300">
                    {lowStockCount} SKUs
                  </div>
                  <p className="text-[11px] text-gray-400">Restock required</p>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#257335] hover:text-emerald-300 font-bold"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-gray-400 border-b border-white/10 uppercase text-[10px]">
                      <tr>
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-white/5">
                          <td className="py-3 font-mono font-bold text-white">{order.orderNumber}</td>
                          <td className="py-3">{order.customerName}</td>
                          <td className="py-3">{order.items.length} items</td>
                          <td className="py-3 font-bold text-white">₹{order.total.toLocaleString('en-IN')}</td>
                          <td className="py-3">
                            <span className="uppercase text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-[10px] font-bold uppercase bg-white/10 text-white px-2 py-0.5 rounded-full">
                              {String(order.orderStatus || order.status || OrderStatus.PENDING).replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setViewingOrder(order);
                                setOrderTrackingNum(order.trackingNumber || '');
                              }}
                              className="text-xs text-emerald-400 hover:underline font-bold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Products Management</h2>
                  <p className="text-xs text-gray-400">Add, edit pricing, update images, and manage inventory.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setProdName('');
                    setProdDesc('');
                    setIsProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4">
                <div className="relative max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title..."
                    className="w-full px-3.5 py-2 pl-9 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-gray-400 border-b border-white/10 uppercase text-[10px]">
                      <tr>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Selling Price</th>
                        <th className="pb-3">MRP</th>
                        <th className="pb-3">Stock</th>
                        <th className="pb-3">Featured</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {products
                        .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.images[0]}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover bg-gray-800"
                                />
                                <div>
                                  <h4 className="font-bold text-white">{product.name}</h4>
                                  <span className="text-[10px] text-gray-400 font-mono">{product.sku}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-emerald-300 font-semibold">{product.categoryName}</td>
                            <td className="py-3 font-bold text-white">₹{product.price}</td>
                            <td className="py-3 text-gray-400 line-through">₹{product.mrp}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  product.stock < 10 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="py-3">
                              {product.isFeatured ? (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                                  FEATURED
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-lg"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ${product.name}?`)) {
                                    deleteProduct(product.id);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Category Hierarchy</h2>
                  <p className="text-xs text-gray-400">Organize bath mats, rugs, door mats, and carpet categories.</p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-4 py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-[#18241F] rounded-2xl p-5 border border-white/5 flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                        <p className="text-[11px] text-gray-400">{cat.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete category ${cat.name}?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Fulfillment & Orders</h2>
                  <p className="text-xs text-gray-400">Process dispatches, assign courier tracking numbers, and update delivery states.</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#18241F] border border-white/10 text-xs text-white rounded-xl p-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                    <option value={OrderStatus.PROCESSING}>Processing</option>
                    <option value={OrderStatus.SHIPPED}>Shipped</option>
                    <option value={OrderStatus.OUT_FOR_DELIVERY}>Out for Delivery</option>
                    <option value={OrderStatus.DELIVERED}>Delivered</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-400 border-b border-white/10 uppercase text-[10px]">
                    <tr>
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Recipient</th>
                      <th className="pb-3">Destination City</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {orders
                      .filter((o) => {
                        const st = o.orderStatus || o.status || OrderStatus.PENDING;
                        return orderStatusFilter === 'all' || st === orderStatusFilter;
                      })
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-white/5">
                          <td className="py-3 font-mono font-bold text-white">{order.orderNumber}</td>
                          <td className="py-3 text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-3">
                            <p className="font-bold text-white">{order.customerName}</p>
                            <p className="text-[10px] text-gray-400">{order.phone || order.customerPhone || ''}</p>
                          </td>
                          <td className="py-3">{order.shippingAddress.city}</td>
                          <td className="py-3 font-bold text-white">₹{order.total.toLocaleString('en-IN')}</td>
                          <td className="py-3">
                            <span className="text-[10px] font-bold uppercase bg-white/10 text-white px-2 py-0.5 rounded-full">
                              {String(order.orderStatus || order.status || OrderStatus.PENDING).replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setViewingOrder(order);
                                setOrderTrackingNum(order.trackingNumber || '');
                              }}
                              className="px-3 py-1.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                            >
                              Dispatch / Update
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-black text-white">Stock Level Controller</h2>
                <p className="text-xs text-gray-400">Quickly adjust live inventory units for factory production.</p>
              </div>

              <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-gray-400 border-b border-white/10 uppercase text-[10px]">
                    <tr>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Current Stock</th>
                      <th className="pb-3 text-right">Quick Stock Modifier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="py-3 font-mono text-[11px] text-gray-400">{p.sku}</td>
                        <td className="py-3 font-bold text-white">{p.name}</td>
                        <td className="py-3 text-emerald-400">{p.categoryName}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                              p.stock < 15 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 10) })}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded font-mono font-bold"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded font-mono font-bold"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => updateProduct(p.id, { stock: p.stock + 50 })}
                            className="px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded font-mono font-bold"
                          >
                            +50 (Batch)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Promotional Discount Coupons</h2>
                  <p className="text-xs text-gray-400">Create, manage, and monitor coupon codes applied by customers in checkout.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCouponCode('FESTIVE20');
                      setCouponType('percentage');
                      setCouponValue(20);
                      setCouponMinOrder(899);
                      setCouponMaxDiscount(400);
                      setCouponDesc('20% Festive Offer on orders above ₹899');
                      setIsCouponModalOpen(true);
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 cursor-pointer"
                  >
                    + Quick Festive Promo
                  </button>
                  <button
                    onClick={() => {
                      setCouponCode('');
                      setCouponType('percentage');
                      setCouponValue(15);
                      setCouponMinOrder(599);
                      setCouponMaxDiscount(500);
                      setCouponDesc('');
                      setIsCouponModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Create Coupon
                  </button>
                </div>
              </div>

              {coupons.length === 0 ? (
                <div className="bg-[#18241F] rounded-2xl p-12 text-center border border-white/5 space-y-3">
                  <Tag className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
                  <h3 className="text-sm font-bold text-white">No Coupons Configured</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">Create promo codes to boost sales, encourage higher cart value, and reward loyal customers.</p>
                  <button
                    onClick={() => setIsCouponModalOpen(true)}
                    className="mt-2 px-4 py-2 bg-[#257335] text-white text-xs font-bold rounded-xl"
                  >
                    Create Your First Coupon
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.map((coupon) => {
                    const isPercentage = coupon.discountType === 'percentage' || (!coupon.discountType && coupon.discountPercent);
                    const val = coupon.discountValue ?? coupon.discountPercent ?? coupon.discountAmount ?? 0;
                    const minCart = coupon.minOrderValue ?? coupon.minOrderAmount ?? 0;
                    const isExpired = new Date(coupon.expiryDate).getTime() < Date.now();

                    return (
                      <div
                        key={coupon.id || coupon.code}
                        className={`bg-[#18241F] rounded-2xl p-5 border space-y-3 relative transition-all ${
                          coupon.isActive && !isExpired ? 'border-white/10 hover:border-emerald-500/40' : 'border-red-500/20 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 tracking-wider">
                              {coupon.code}
                            </span>
                            {coupon.isActive && !isExpired ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-300">
                                Inactive
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => deleteCoupon(coupon.id || coupon.code)}
                            className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs text-gray-300 space-y-1.5 pt-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-gray-400">Discount Benefit:</span>
                            <span className="font-extrabold text-white text-sm">
                              {isPercentage ? `${val}% OFF` : `₹${val} FLAT OFF`}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <span className="text-gray-400">Min Cart Value:</span>
                            <span className="font-bold text-gray-200">
                              {minCart > 0 ? `₹${minCart.toLocaleString('en-IN')}` : 'No Minimum'}
                            </span>
                          </div>

                          {coupon.maxDiscount && isPercentage && (
                            <div className="flex items-baseline justify-between">
                              <span className="text-gray-400">Max Discount:</span>
                              <span className="font-bold text-gray-200">₹{coupon.maxDiscount}</span>
                            </div>
                          )}

                          {coupon.description && (
                            <p className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5">
                              {coupon.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5">
                            <span>Expiry: {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {coupon.usedCount !== undefined && <span>Used: {coupon.usedCount} times</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-black text-white">Store & Brand Administration</h2>
                  <p className="text-xs text-gray-400">
                    Manage brand logo, header navigation, contact info, email addresses, and footer sections.
                  </p>
                </div>
                <button
                  onClick={() => addToast('success', 'Changes Saved', 'All store configurations and brand assets are active.')}
                  className="px-5 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-colors self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" /> Save All Changes
                </button>
              </div>

              {/* Settings Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
                <button
                  onClick={() => setSettingsSubTab('branding')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'branding'
                      ? 'bg-[#257335] text-white shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Palette className="w-4 h-4" /> Brand & Logo
                </button>
                <button
                  onClick={() => setSettingsSubTab('contact')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'contact'
                      ? 'bg-[#257335] text-white shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Phone className="w-4 h-4" /> Contact & Emails
                </button>
                <button
                  onClick={() => setSettingsSubTab('navigation')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'navigation'
                      ? 'bg-[#257335] text-white shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Menu className="w-4 h-4" /> Menu Navigation
                </button>
                <button
                  onClick={() => setSettingsSubTab('footer')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'footer'
                      ? 'bg-[#257335] text-white shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Footer Section
                </button>
                <button
                  onClick={() => setSettingsSubTab('policies')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'policies'
                      ? 'bg-[#257335] text-white shadow-sm'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Truck className="w-4 h-4" /> Shipping & Rates
                </button>
              </div>

              {/* 1. BRANDING & LOGO */}
              {settingsSubTab === 'branding' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Form Controls (8 cols) */}
                    <div className="lg:col-span-8 bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                        <Image className="w-4 h-4 text-[#E87244]" /> Store Identity & Logo Management
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-300 mb-1">Store / Brand Name *</label>
                          <input
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => updateSettings({ storeName: e.target.value })}
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-300 mb-1">Brand Tagline</label>
                          <input
                            type="text"
                            value={settings.brandTagline}
                            onChange={(e) => updateSettings({ brandTagline: e.target.value })}
                            placeholder="e.g. Artisanal Indian Rugs & Mats"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Custom Logo Image URL</label>
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={settings.logoUrl || ''}
                            onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                            placeholder="https://your-domain.com/logo.png (leave empty for artisanal text logo)"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs"
                          />
                          <p className="text-[11px] text-gray-400">
                            Recommended: High-resolution PNG or SVG with transparent background (Height: 40px - 80px).
                          </p>
                        </div>
                      </div>

                      {/* Quick Logo Presets */}
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                        <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                          Quick Preset Logos:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateSettings({
                                logoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
                              })
                            }
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] text-gray-200 transition-colors"
                          >
                            Sample Handloom Emblem
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSettings({ logoUrl: '' })}
                            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[11px] transition-colors"
                          >
                            Reset to Default Styled Typographic Logo
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.showLogoImage !== false}
                            onChange={(e) => updateSettings({ showLogoImage: e.target.checked })}
                            className="rounded text-[#257335] w-4 h-4"
                          />
                          <div>
                            <span className="font-bold text-white block">Display Logo Icon / Image</span>
                            <span className="text-[11px] text-gray-400">Show graphic symbol alongside text</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.showLogoText !== false}
                            onChange={(e) => updateSettings({ showLogoText: e.target.checked })}
                            className="rounded text-[#257335] w-4 h-4"
                          />
                          <div>
                            <span className="font-bold text-white block">Display Store Name & Tagline</span>
                            <span className="text-[11px] text-gray-400">Show brand typography in header</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Live Preview (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-[#18241F] rounded-3xl p-5 border border-white/5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> Live Header & Footer Preview
                        </h4>

                        {/* Light Mode Header Preview */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">Header (Light Mode):</span>
                          <div className="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-xs">
                            <div className="flex items-center gap-3">
                              {settings.logoUrl && settings.showLogoImage !== false ? (
                                <img
                                  src={settings.logoUrl}
                                  alt={settings.storeName}
                                  className="h-10 object-contain rounded-md"
                                />
                              ) : (
                                settings.showLogoImage !== false && (
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#257335] to-[#174821] text-white flex items-center justify-center font-serif font-black text-lg shadow-sm">
                                    MT
                                  </div>
                                )
                              )}
                              {settings.showLogoText !== false && (
                                <div className="leading-tight">
                                  <span className="font-serif text-lg font-black tracking-tight text-gray-900 block">
                                    {settings.storeName}
                                  </span>
                                  <span className="text-[9px] uppercase tracking-widest text-[#E87244] font-bold block">
                                    {settings.brandTagline}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Dark Mode Footer Preview */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">Footer (Dark Canvas):</span>
                          <div className="p-4 bg-[#19221C] rounded-2xl border border-white/10 flex items-center justify-center">
                            <div className="flex items-center gap-3">
                              {settings.logoUrl && settings.showLogoImage !== false ? (
                                <img
                                  src={settings.logoUrl}
                                  alt={settings.storeName}
                                  className="h-10 object-contain rounded-md brightness-110"
                                />
                              ) : (
                                settings.showLogoImage !== false && (
                                  <div className="w-10 h-10 rounded-xl bg-white text-[#257335] flex items-center justify-center font-serif font-black text-lg shadow-sm">
                                    MT
                                  </div>
                                )
                              )}
                              {settings.showLogoText !== false && (
                                <div className="leading-tight">
                                  <span className="font-serif text-lg font-black tracking-tight text-white block">
                                    {settings.storeName}
                                  </span>
                                  <span className="text-[9px] uppercase tracking-widest text-[#E87244] font-bold block">
                                    {settings.brandTagline}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CONTACT & EMAILS */}
              {settingsSubTab === 'contact' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-5 text-xs">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                      <Phone className="w-4 h-4 text-emerald-400" /> Customer Support & Manufacturing Hub Contacts
                    </h3>

                    {/* Email Addresses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Primary Store Email *</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={settings.email}
                            onChange={(e) => updateSettings({ email: e.target.value })}
                            placeholder="care@manshatexo.com"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium pl-9"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Customer Support / Helpdesk Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={settings.supportEmail || ''}
                            onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                            placeholder="support@manshatexo.com"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium pl-9"
                          />
                          <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Phone Numbers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Primary Support Helpline *</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={settings.phone}
                            onChange={(e) => updateSettings({ phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono pl-9"
                          />
                          <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Secondary / Toll-Free Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={settings.secondaryPhone || ''}
                            onChange={(e) => updateSettings({ secondaryPhone: e.target.value })}
                            placeholder="1800 123 4567"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono pl-9"
                          />
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Business Hours & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Support Operational Hours</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={settings.businessHours}
                            onChange={(e) => updateSettings({ businessHours: e.target.value })}
                            placeholder="Mon - Sat: 9:00 AM - 7:00 PM IST"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white pl-9"
                          />
                          <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Factory & Dispatch Hub Address</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={settings.address}
                            onChange={(e) => updateSettings({ address: e.target.value })}
                            placeholder="Industrial Area, Sector 25, Panipat, Haryana - 132103"
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white pl-9"
                          />
                          <MapPin className="w-4 h-4 text-[#E87244] absolute left-3 top-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Support Integration */}
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-emerald-400" />
                          <div>
                            <h4 className="font-bold text-white text-xs">WhatsApp Direct Chat Floating Button</h4>
                            <p className="text-[11px] text-gray-400">Allow customers to chat directly with store support on WhatsApp</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.whatsappEnabled}
                            onChange={(e) => updateSettings({ whatsappEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-gray-300 mb-1">WhatsApp Business Number (with country code)</label>
                          <input
                            type="text"
                            value={settings.whatsappNumber}
                            onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                            placeholder="919876543210"
                            className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-300 mb-1">Default Pre-filled Message</label>
                          <input
                            type="text"
                            value={settings.whatsappMessage}
                            onChange={(e) => updateSettings({ whatsappMessage: e.target.value })}
                            placeholder="Hello Mansha Texo, I have a question regarding my order..."
                            className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MENU NAVIGATION MANAGER */}
              {settingsSubTab === 'navigation' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Menu className="w-4 h-4 text-emerald-400" /> Header Navigation Menu Items
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          Add, edit, reorder or remove navigation links rendered in the top header bar.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateSettings({
                              menuLinks: [
                                { id: 'nav-1', label: 'Bath Mats', path: '/category/bath-mats' },
                                { id: 'nav-2', label: 'Living Room Carpets', path: '/category/carpets', badge: 'Popular' },
                                { id: 'nav-3', label: 'Artisanal Rugs', path: '/category/rugs' },
                                { id: 'nav-4', label: 'Floor Mats', path: '/category/floor-mats' },
                                { id: 'nav-5', label: 'Door Mats', path: '/category/door-mats' },
                                { id: 'nav-6', label: 'Kitchen Runners', path: '/category/kitchen-mats' },
                                { id: 'nav-7', label: 'Fresh Arrivals', path: '/new-arrivals', badge: 'New' },
                              ],
                            });
                            addToast('info', 'Default Menu Restored', 'Header navigation links reset to standard catalog.');
                          }}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Restore Default
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenAddMenu}
                          className="px-4 py-2 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" /> Add Menu Link
                        </button>
                      </div>
                    </div>

                    {/* Table / List of Menu Items */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase">
                            <th className="pb-3 px-2">Order</th>
                            <th className="pb-3">Label</th>
                            <th className="pb-3">Target Path / URL</th>
                            <th className="pb-3">Badge</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(settings.menuLinks || []).map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-white/5 group">
                              <td className="py-3 px-2 text-gray-400 font-mono">
                                <div className="flex items-center gap-1">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => handleMoveMenuLink(idx, 'up')}
                                    className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Move Up"
                                  >
                                    <MoveUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    disabled={idx === (settings.menuLinks?.length || 0) - 1}
                                    onClick={() => handleMoveMenuLink(idx, 'down')}
                                    className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <MoveDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 font-bold text-white">{item.label}</td>
                              <td className="py-3 text-gray-300 font-mono text-xs">{item.path}</td>
                              <td className="py-3">
                                {item.badge ? (
                                  <span className="text-[10px] font-bold bg-[#E87244]/20 text-[#E87244] px-2 py-0.5 rounded-full border border-[#E87244]/30">
                                    {item.badge}
                                  </span>
                                ) : (
                                  <span className="text-gray-600 text-xs">—</span>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditMenu(idx)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                    title="Edit Link"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenuLink(idx)}
                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Link"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FOOTER SECTION MANAGER */}
              {settingsSubTab === 'footer' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* About Text & Newsletter */}
                  <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                      <Layers className="w-4 h-4 text-amber-400" /> Footer Brand Blurb & Newsletter
                    </h3>

                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Footer About Brand Text</label>
                      <textarea
                        rows={3}
                        value={settings.footer?.aboutText || ''}
                        onChange={(e) =>
                          updateSettings({
                            footer: {
                              ...settings.footer,
                              aboutText: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Newsletter Box Heading</label>
                        <input
                          type="text"
                          value={settings.footer?.newsletterHeading || ''}
                          onChange={(e) =>
                            updateSettings({
                              footer: {
                                ...settings.footer,
                                newsletterHeading: e.target.value,
                              },
                            })
                          }
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Newsletter Subtext / Guarantee</label>
                        <input
                          type="text"
                          value={settings.footer?.newsletterSubtext || ''}
                          onChange={(e) =>
                            updateSettings({
                              footer: {
                                ...settings.footer,
                                newsletterSubtext: e.target.value,
                              },
                            })
                          }
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Value Proposition Cards */}
                  <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" /> 4 Value Proposition Badges
                        </h3>
                        <p className="text-[11px] text-gray-400">Rendered at the top of the footer to establish buyer trust.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVpIndex(null);
                          setVpTitle('');
                          setVpDesc('');
                          setVpIcon('truck');
                          setIsValuePropModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Badge
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(settings.footer?.valueProps || []).map((vp, idx) => (
                        <div
                          key={vp.id || idx}
                          className="p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-start justify-between gap-3 group"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                              Icon: {vp.icon}
                            </span>
                            <h4 className="font-bold text-white mt-1">{vp.title}</h4>
                            <p className="text-[11px] text-gray-400">{vp.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditVp(idx)}
                              className="p-1 text-gray-400 hover:text-white cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteValueProp(idx)}
                              className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shop & Customer Care Link Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Shop Collections Links */}
                    <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                          <Link2 className="w-4 h-4 text-[#E87244]" /> Footer Shop Links
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setFooterShopLabel('');
                            setFooterShopPath('/category/');
                            setIsFooterShopModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Link
                        </button>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {(settings.footer?.shopLinks || []).map((link, idx) => (
                          <div
                            key={link.id || idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-gray-300"
                          >
                            <div>
                              <span className="font-bold text-white block">{link.label}</span>
                              <span className="text-[10px] font-mono text-gray-400">{link.path}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteFooterShopLink(idx)}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Care Links */}
                    <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                          <Link2 className="w-4 h-4 text-emerald-400" /> Customer Care Links
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setFooterCareLabel('');
                            setFooterCarePath('/');
                            setIsFooterCareModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Link
                        </button>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {(settings.footer?.customerCareLinks || []).map((link, idx) => (
                          <div
                            key={link.id || idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-gray-300"
                          >
                            <div>
                              <span className="font-bold text-white block">{link.label}</span>
                              <span className="text-[10px] font-mono text-gray-400">{link.path}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteFooterCareLink(idx)}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Copyright & Payment Badges */}
                  <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">
                      Sub-footer Copyright & Trust Seals
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Copyright Line Text</label>
                        <input
                          type="text"
                          value={settings.footer?.copyrightText || ''}
                          onChange={(e) =>
                            updateSettings({
                              footer: {
                                ...settings.footer,
                                copyrightText: e.target.value,
                              },
                            })
                          }
                          placeholder="Mansha Texo. All Rights Reserved. Crafted with care in India."
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-300 mb-1">Payment Method Seal Text</label>
                        <input
                          type="text"
                          value={settings.footer?.paymentBadgesText || ''}
                          onChange={(e) =>
                            updateSettings({
                              footer: {
                                ...settings.footer,
                                paymentBadgesText: e.target.value,
                              },
                            })
                          }
                          placeholder="100% Safe Payments:"
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. POLICIES & RATES */}
              {settingsSubTab === 'policies' && (
                <div className="bg-[#18241F] rounded-3xl p-6 border border-white/5 space-y-4 text-xs animate-fadeIn">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <Truck className="w-4 h-4 text-emerald-400" /> Shipping Limits, Taxes & Notice Bar
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Free Shipping Threshold (₹)</label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Standard Shipping Fee (₹)</label>
                      <input
                        type="number"
                        value={settings.shippingFee}
                        onChange={(e) => updateSettings({ shippingFee: Number(e.target.value) })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">GST Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.taxRatePercent}
                        onChange={(e) => updateSettings({ taxRatePercent: Number(e.target.value) })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-300 mb-1">Cash on Delivery (COD) Surcharge (₹)</label>
                      <input
                        type="number"
                        value={settings.codFee || 0}
                        onChange={(e) => updateSettings({ codFee: Number(e.target.value) })}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Top Announcement Marquee / Notice</label>
                    <input
                      type="text"
                      value={settings.storeNotice || ''}
                      onChange={(e) => updateSettings({ storeNotice: e.target.value })}
                      placeholder="Special Launch Offer: Extra 10% OFF on all Panipat Handcrafted Rugs with code MANSHA10"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Menu Link Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#18241F] border border-white/10 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white">
              {editingMenuIndex !== null ? 'Edit Menu Navigation Link' : 'Add New Header Menu Link'}
            </h3>
            <form onSubmit={handleSaveMenuLink} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Menu Label *</label>
                <input
                  type="text"
                  required
                  value={menuLabel}
                  onChange={(e) => setMenuLabel(e.target.value)}
                  placeholder="e.g. Anti-Skid Mats"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Target Route Path / URL *</label>
                <input
                  type="text"
                  required
                  value={menuPath}
                  onChange={(e) => setMenuPath(e.target.value)}
                  placeholder="e.g. /category/floor-mats or /deals"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Badge Tag (Optional)</label>
                <input
                  type="text"
                  value={menuBadge}
                  onChange={(e) => setMenuBadge(e.target.value)}
                  placeholder="e.g. Popular, Hot, New, 20% OFF"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#257335] text-white font-bold rounded-xl"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Shop Link Modal */}
      {isFooterShopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#18241F] border border-white/10 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white">Add Footer Shop Collection Link</h3>
            <form onSubmit={handleSaveFooterShopLink} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  value={footerShopLabel}
                  onChange={(e) => setFooterShopLabel(e.target.value)}
                  placeholder="e.g. Handmade Bohemian Runners"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Route Path *</label>
                <input
                  type="text"
                  required
                  value={footerShopPath}
                  onChange={(e) => setFooterShopPath(e.target.value)}
                  placeholder="e.g. /category/rugs"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFooterShopModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#257335] text-white font-bold rounded-xl"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Customer Care Link Modal */}
      {isFooterCareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#18241F] border border-white/10 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white">Add Footer Customer Care Link</h3>
            <form onSubmit={handleSaveFooterCareLink} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  value={footerCareLabel}
                  onChange={(e) => setFooterCareLabel(e.target.value)}
                  placeholder="e.g. Warranty & Quality Assurance"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Route Path *</label>
                <input
                  type="text"
                  required
                  value={footerCarePath}
                  onChange={(e) => setFooterCarePath(e.target.value)}
                  placeholder="e.g. /faq or /contact"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFooterCareModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#257335] text-white font-bold rounded-xl"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Value Proposition Modal */}
      {isValuePropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#18241F] border border-white/10 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white">
              {editingVpIndex !== null ? 'Edit Trust Badge' : 'Add Value Proposition Badge'}
            </h3>
            <form onSubmit={handleSaveValueProp} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Badge Title *</label>
                <input
                  type="text"
                  required
                  value={vpTitle}
                  onChange={(e) => setVpTitle(e.target.value)}
                  placeholder="e.g. Free Express Delivery"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={vpDesc}
                  onChange={(e) => setVpDesc(e.target.value)}
                  placeholder="e.g. On all prepaid orders over ₹499"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Icon Style</label>
                <select
                  value={vpIcon}
                  onChange={(e) => setVpIcon(e.target.value as any)}
                  className="w-full p-3 bg-[#141E1A] border border-white/10 rounded-xl text-white font-medium"
                >
                  <option value="truck">Truck (Delivery / Logistics)</option>
                  <option value="rotate-ccw">Rotate Counter-Clockwise (Easy Returns)</option>
                  <option value="shield">Shield (Quality & Authenticity)</option>
                  <option value="credit-card">Credit Card (Secure Payments)</option>
                  <option value="sparkles">Sparkles (Artisanal Craft)</option>
                  <option value="phone">Phone (24/7 Helpline)</option>
                  <option value="heart">Heart (Customer Love)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsValuePropModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#257335] text-white font-bold rounded-xl"
                >
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#18241F] border border-white/10 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white">
              {editingProductId ? 'Edit Product' : 'Create New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Ultra Plush Microfiber Bath Mat"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full p-3 bg-[#141E1A] border border-white/10 rounded-xl text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Material Specification</label>
                  <input
                    type="text"
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    placeholder="e.g. 100% Ring-Spun Cotton"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">MRP / Cut Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodMrp}
                    onChange={(e) => setProdMrp(Number(e.target.value))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    value={prodSizes}
                    onChange={(e) => setProdSizes(e.target.value)}
                    placeholder="40x60 cm, 50x80 cm"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Colors (Comma separated)</label>
                  <input
                    type="text"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    placeholder="Emerald Forest, Beige"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                    className="rounded text-[#257335]"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsBestSeller}
                    onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    className="rounded text-[#257335]"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#18241F] border border-white/10 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="text-lg font-bold text-white">Add New Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Kitchen Mats"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="e.g. Anti-fatigue waterproof kitchen rugs"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#257335] text-white font-bold rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#18241F] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Create Promotional Discount Coupon</h3>
                <p className="text-[11px] text-gray-400">Configure discount rules, threshold, and expiry.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Coupon Code (Promo Code) *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  placeholder="e.g. FESTIVE25, WELCOME200, MANSHA10"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono uppercase tracking-wider text-sm font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full p-3 bg-[#111A16] border border-white/10 rounded-xl text-white font-bold"
                  >
                    <option value="percentage">Percentage Discount (% OFF)</option>
                    <option value="fixed">Flat Amount (₹ FLAT OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    {couponType === 'percentage' ? 'Discount Percentage (%) *' : 'Flat Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={couponType === 'percentage' ? 95 : 10000}
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Minimum Cart Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    placeholder="0 for no minimum"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    Max Discount Cap (₹) <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={couponMaxDiscount}
                    onChange={(e) => setCouponMaxDiscount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 500"
                    disabled={couponType === 'fixed'}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Validity Duration</label>
                  <select
                    value={couponExpiryDays}
                    onChange={(e) => setCouponExpiryDays(Number(e.target.value))}
                    className="w-full p-3 bg-[#111A16] border border-white/10 rounded-xl text-white"
                  >
                    <option value={7}>7 Days (Flash Sale)</option>
                    <option value={15}>15 Days (Mid Season)</option>
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={90}>90 Days (Quarterly)</option>
                    <option value={365}>365 Days (1 Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Campaign Note / Description</label>
                  <input
                    type="text"
                    value={couponDesc}
                    onChange={(e) => setCouponDesc(e.target.value)}
                    placeholder="e.g. Special festive celebration discount"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white font-bold rounded-xl cursor-pointer shadow-md"
                >
                  Save & Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Fulfillment Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#18241F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase">Order Management</span>
                <h3 className="text-base font-bold text-white font-mono">{viewingOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-400 hover:text-white font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Update Order Status</label>
                <select
                  value={viewingOrder.orderStatus || viewingOrder.status || OrderStatus.PENDING}
                  onChange={(e) => {
                    const nextStatus = e.target.value as OrderStatus;
                    updateOrderStatus(viewingOrder.id, nextStatus, 'Status updated by store manager', orderCourierName, orderTrackingNum);
                    setViewingOrder({ ...viewingOrder, orderStatus: nextStatus, status: nextStatus });
                  }}
                  className="w-full p-3 bg-[#141E1A] border border-white/10 rounded-xl text-white font-bold"
                >
                  <option value={OrderStatus.PENDING}>PENDING</option>
                  <option value={OrderStatus.CONFIRMED}>CONFIRMED</option>
                  <option value={OrderStatus.PROCESSING}>PROCESSING / PACKING</option>
                  <option value={OrderStatus.SHIPPED}>SHIPPED</option>
                  <option value={OrderStatus.OUT_FOR_DELIVERY}>OUT FOR DELIVERY</option>
                  <option value={OrderStatus.DELIVERED}>DELIVERED</option>
                  <option value={OrderStatus.CANCELLED}>CANCELLED</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={orderCourierName}
                    onChange={(e) => setOrderCourierName(e.target.value)}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 mb-1">AWB / Tracking Number</label>
                  <input
                    type="text"
                    value={orderTrackingNum}
                    onChange={(e) => setOrderTrackingNum(e.target.value)}
                    placeholder="e.g. DL9823471029IN"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl space-y-2 border border-white/5">
                <p className="font-bold text-white">Recipient Address:</p>
                <p className="text-gray-300">
                  {viewingOrder.shippingAddress.fullName} ({viewingOrder.phone || viewingOrder.customerPhone || ''})<br />
                  {viewingOrder.shippingAddress.houseFlat}, {viewingOrder.shippingAddress.street}, {viewingOrder.shippingAddress.city} - {viewingOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  updateOrderStatus(
                    viewingOrder.id,
                    viewingOrder.orderStatus || viewingOrder.status || OrderStatus.PENDING,
                    'Dispatch & tracking updated by admin',
                    orderCourierName,
                    orderTrackingNum
                  );
                  addToast('success', 'Order Updated', `Order ${viewingOrder.orderNumber} updated with tracking info.`);
                  setViewingOrder(null);
                }}
                className="px-5 py-2.5 bg-[#257335] text-white font-bold rounded-xl"
              >
                Save Dispatch Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
