import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

// 1. About Us
export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#257335]">
            Artisanship & Comfort
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mt-2">
            The Mansha Texo Story
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Pioneering premium home textiles and artisanal floor furnishings from the historic textile capital of Panipat, India.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Mansha Texo Living Room"
              className="w-full h-full object-cover"
            />
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-gray-900">
              Transforming Everyday Living Through Fine Textile Craft
            </h2>
            <p>
              At <strong>Mansha Texo</strong>, we believe every step you take in your home should feel like pure comfort. What started as an artisanal loom workshop in Panipat has grown into one of India’s most trusted home textile brands, creating plush bath mats, designer living room carpets, reversible runners, and heavy-duty entrance mats.
            </p>
            <p>
              Our collections are designed for modern Indian lifestyles—where high absorbency, quick drying, skid resistance, and visual elegance seamlessly intersect.
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-gray-100 text-center">
            <div>
              <span className="font-serif text-3xl font-black text-[#257335]">25,000+</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">Homes Furnished Across India</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-black text-[#E87244]">100%</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">Authentic Indian Manufacturing</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-black text-gray-900">4.8 / 5</span>
              <p className="text-xs text-gray-500 mt-1 font-medium">Average Customer Satisfaction</p>
            </div>
          </div>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Sustainable Materials & Zero Chemical Compromise
            </h3>
            <p>
              Every yarn is meticulously selected—from 100% ring-spun virgin cotton to natural jute and eco-certified microfiber. We strictly utilize OEKOTEX-compliant, azo-free dyes that remain vibrant wash after wash while preserving the sensitive skin of your family and pets.
            </p>
          </section>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate('/shop')}
              className="px-8 py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Contact Us
export const ContactPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const { settings, addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    addToast('success', 'Message Sent', 'Thank you! A Mansha Texo specialist will contact you within 24 hours.');
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#257335]">
            Customer Support
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            Get In Touch With Mansha Texo
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Have a question regarding custom bulk orders, fabric dimensions, or tracking? We’re always here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 bg-[#19221C] text-white rounded-3xl p-8 sm:p-10 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold">Contact Details</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Connect with our Panipat head office or write directly to our customer support desk.
              </p>

              <div className="space-y-5 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E87244] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Central Hub & Manufacturing:</strong>
                    <span className="text-gray-300">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white">Phone Support:</strong>
                    <span className="text-gray-300">{settings.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-white">Email Desk:</strong>
                    <span className="text-gray-300">{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Working Hours:</strong>
                    <span className="text-gray-300">{settings.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-emerald-300">
              <Sparkles className="w-4 h-4 text-[#E87244] inline mr-1.5" />
              Direct WhatsApp chat support available on the bottom-left of your screen.
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Verma"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Order Inquiry / Bulk Order"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you today?"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#257335]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#257335] hover:bg-[#1E5C2B] text-white font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Shipping Policy
export const ShippingPolicyPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            Shipping & Delivery Policy
          </h1>
          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">1. Dispatch Timelines</h2>
            <p>All orders placed on Mansha Texo are dispatched within 24 to 48 business hours from our central fulfillment center in Panipat, Haryana.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">2. Delivery Charges</h2>
            <p>We provide <strong>FREE Standard Delivery</strong> across all Indian PIN codes on orders above ₹499. For orders below ₹499, a nominal flat shipping fee of ₹49 is applied at checkout.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">3. Courier Partners & Tracking</h2>
            <p>We partner with tier-1 express couriers including Bluedart, Delhivery, Shadowfax, and DTDC. Real-time SMS and email tracking links are sent as soon as your parcel is handed to the carrier.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">4. Estimated Delivery Duration</h2>
            <p>Metro Cities: 2-4 business days.<br />Rest of India: 4-6 business days.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

// 4. Return & Refund Policy
export const ReturnPolicyPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            7-Day Return & Replacement Policy
          </h1>
          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">1. 7-Day Window</h2>
            <p>We offer a hassle-free 7-day return or exchange policy from the date of doorstep delivery for all unused products with original tags intact.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">2. Easy Doorstep Pickup</h2>
            <p>Our courier partner will pick up the parcel directly from your address. Once the item arrives at our warehouse and passes a quick quality check, your replacement is dispatched immediately or refund processed.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">3. Refund Processing</h2>
            <p>Prepaid orders are refunded back to the original payment source (UPI/Card/Netbanking) within 3-5 business days. Cash on Delivery (COD) orders are refunded via instant UPI transfer or bank NEFT.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

// 5. Privacy Policy
export const PrivacyPolicyPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            Privacy Policy & Data Security
          </h1>
          <p>
            Mansha Texo respects your privacy and is dedicated to protecting customer data. We never sell, rent, or trade your personal information to third parties. Customer contact details are strictly utilized for processing orders, courier dispatch coordination, and voluntary promotional updates.
          </p>
          <p>
            All payment transactions are encrypted using 256-bit SSL protocols in strict compliance with PCI-DSS guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

// 6. Terms & Conditions
export const TermsPolicyPage: React.FC<StaticPageProps> = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4">
            Terms & Conditions
          </h1>
          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">1. Intellectual Property & Brand Rights</h2>
            <p>All designs, textile weaves, product photographs, and text content published on Mansha Texo are the proprietary intellectual property of Mansha Texo and its manufacturing partners.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">2. Product Specifications & Color Variations</h2>
            <p>Due to the artisanal loom weaving process and varied digital screen color calibrations, slight variations in weave texture and hue tone may naturally occur.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-gray-900 text-base">3. Order Acceptance & Pricing</h2>
            <p>Prices listed are inclusive of GST taxes in Indian Rupees (INR). Mansha Texo reserves the right to cancel or modify any order in the rare case of pricing glitches or stock shortages.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

// 7. Frequently Asked Questions (FAQ)
export const FAQPolicyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'Are your bath mats machine washable?',
      a: 'Yes! All Mansha Texo microfiber and cotton bath mats can be safely washed in a standard washing machine on a gentle cold cycle with mild detergent.',
    },
    {
      q: 'Are the carpets and mats skid-resistant?',
      a: 'Absolutely. Our floor runners and bath rugs feature heavy-duty TPR or natural latex anti-skid rubber backings that firmly grip marble, tiles, and wooden floors.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'We dispatch orders within 24 to 48 hours from Panipat. Metro delivery takes 2-4 days, while non-metro locations take 4-6 business days.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across 26,000+ Indian pincodes without any extra surcharge.',
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#257335]">
            Help Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Find answers to common questions about our materials, care instructions, and delivery.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-2">
              <h3 className="font-serif font-bold text-gray-900 text-base">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <h4 className="font-bold text-gray-900 text-sm">Still have questions?</h4>
          <p className="text-xs text-gray-600 mt-1">Our customer support team in Panipat is ready to help you.</p>
          <button
            onClick={() => onNavigate('/contact')}
            className="mt-3 px-5 py-2.5 bg-[#257335] hover:bg-[#1E5C2B] text-white text-xs font-bold rounded-xl"
          >
            Contact Support Desk
          </button>
        </div>
      </div>
    </div>
  );
};
