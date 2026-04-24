import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Fund } from '@/src/types';
import { FundAvatar } from '@/src/components/ui/FundAvatar';
import { GradeBadge } from '@/src/components/ui/GradeBadge';
import { useCompareStore } from '@/src/store/compareStore';
import { useDataStore } from '@/src/store/useDataStore';
import { useToast } from '@/src/context/ToastContext';
import { assetUrl } from '@/src/lib/utils';

function resolveLogoUrl(url?: string | null): string | undefined {
  return assetUrl(url);
}

export const FundSelector: React.FC = () => {
  const { selectedFunds, addFund, removeFund } = useCompareStore();
  const { funds, fundsLoading, fetchFunds } = useDataStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (funds.length === 0 && !fundsLoading) {
      fetchFunds();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = funds
    .filter(
      (fund) =>
        fund.name_uz.toLowerCase().includes(search.toLowerCase()) &&
        !selectedFunds.some((f) => f.id === fund.id)
    )
    .slice(0, 6);

  const handleAdd = (fund: Fund) => {
    const result = addFund(fund);
    showToast(result.message, result.success ? 'success' : 'warning');
    if (result.success) {
      setSearch('');
      setShowDropdown(false);
    }
  };

  const focusInput = () => {
    if (selectedFunds.length >= 3) return;
    inputRef.current?.focus();
    setShowDropdown(true);
  };

  const slots = [0, 1, 2];

  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-[#1E293B] text-base">Fondlarni tanlang</h3>
          <p className="text-[#94A3B8] text-[13px] mt-0.5">
            Taqqoslash uchun 2 yoki 3 ta fond qo'shing
          </p>
        </div>
        <div className="flex items-center gap-2">
          {slots.map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < selectedFunds.length ? 'bg-[#1A56DB]' : 'bg-[#E2E8F0]'
              }`}
            />
          ))}
          <span className="text-[13px] font-bold text-[#64748B] ml-1">
            {selectedFunds.length}/3
          </span>
        </div>
      </div>

      {/* 3 Slots */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {slots.map((i) => {
          const fund = selectedFunds[i];

          if (fund) {
            return (
              <motion.div
                key={fund.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex flex-col items-center gap-2.5 text-center"
              >
                <button
                  onClick={() => removeFund(fund.id)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-[#E2E8F0]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <FundAvatar
                  initials={fund.logo_initials}
                  color={fund.logo_color}
                  size="md"
                  imageUrl={resolveLogoUrl(fund.logo_url)}
                />
                <div className="w-full">
                  <p className="text-[13px] font-bold text-[#1E293B] truncate leading-tight">
                    {fund.name_uz}
                  </p>
                  <div className="flex justify-center mt-1.5">
                    <GradeBadge grade={fund.indexes.grade} className="scale-75" />
                  </div>
                </div>
                <div className="text-lg font-black text-[#1A56DB]">
                  {fund.indexes.overall}
                </div>
              </motion.div>
            );
          }

          return (
            <button
              key={i}
              onClick={focusInput}
              disabled={selectedFunds.length >= 3}
              className="h-[152px] border-2 border-dashed border-[#E2E8F0] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#CBD5E1] hover:border-[#1A56DB] hover:text-[#1A56DB] hover:bg-[#EFF6FF] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E2E8F0] disabled:hover:text-[#CBD5E1] disabled:hover:bg-transparent transition-all group"
            >
              <div className="w-9 h-9 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-[#1A56DB]/10 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold">Fond qo'shish</span>
            </button>
          );
        })}
      </div>

      {/* Search input */}
      {selectedFunds.length < 3 && (
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Fond nomi bo'yicha qidirish..."
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#1A56DB] focus:bg-white transition-all outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setShowDropdown(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#64748B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showDropdown && search.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#E2E8F0] z-50 overflow-hidden"
              >
                {fundsLoading ? (
                  <div className="p-8 text-center text-[#94A3B8] text-sm">Yuklanmoqda...</div>
                ) : filteredResults.length > 0 ? (
                  <div className="divide-y divide-[#F8FAFC] py-1.5">
                    {filteredResults.map((fund) => (
                      <div
                        key={fund.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        onClick={() => handleAdd(fund)}
                      >
                        <div className="flex items-center gap-3">
                          <FundAvatar
                            initials={fund.logo_initials}
                            color={fund.logo_color}
                            size="sm"
                            imageUrl={resolveLogoUrl(fund.logo_url)}
                          />
                          <div>
                            <div className="text-sm font-bold text-[#1E293B]">{fund.name_uz}</div>
                            <GradeBadge grade={fund.indexes.grade} className="scale-75 origin-left" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-[#1A56DB]">
                            {fund.indexes.overall}
                          </span>
                          <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center text-[#1A56DB] hover:bg-[#1A56DB] hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[#94A3B8] text-sm">
                    "{search}" bo'yicha fond topilmadi
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {selectedFunds.length === 3 && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <span className="font-bold">✓</span>
          <span>3 ta fond tanlandi. Taqqoslash tayyor!</span>
        </div>
      )}
    </div>
  );
};
