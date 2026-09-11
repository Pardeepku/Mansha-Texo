import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const { faqs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Products', 'Care & Cleaning', 'Orders & Shipping', 'Returns & Refunds', 'Payments'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-[#257335] text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" /> Got Questions? We Have Answers
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Everything you need to know about Mansha Texo floor mats, rugs, washing care, and dispatch timelines.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., washing, delivery, return, memory foam)..."
            className="w-full px-4 py-3.5 pl-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#257335] shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#257335] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Topics' : cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#257335]" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      openIndex === idx ? 'rotate-180 text-[#257335]' : ''
                    }`}
                  />
                </button>

                {openIndex === idx && (
                  <div className="p-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold text-[#257335] bg-emerald-50 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-800">No matching questions found</p>
              <p className="text-xs text-gray-500 mt-1">Try another search keyword or contact support directly.</p>
            </div>
          )}
        </div>

        {/* Contact Help CTA */}
        <div className="mt-12 p-8 rounded-3xl bg-emerald-900 text-white text-center space-y-3">
          <h3 className="font-serif text-xl font-bold">Still have a question?</h3>
          <p className="text-xs text-emerald-200 max-w-md mx-auto">
            Our textile specialists in Panipat are available Mon-Sat to help you choose the right weave, sizes, and care routines.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-2.5 bg-white text-[#194020] text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
