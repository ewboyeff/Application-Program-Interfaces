import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8000';

/** Funds tagged with this category appear under every category filter, in addition to their own. */
export const MULTI_SECTOR_CATEGORY = "Ko'p tarmoqli";

export function assetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format money: 1240000000 → "1,240,000,000 UZS"
 */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS';
}

/**
 * Format number: 45000 → "45,000"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

/**
 * Get score color class
 */
export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

/**
 * Get score bg color class
 */
export function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

/**
 * Get grade config
 */
export type Grade = 'platinum' | 'gold' | 'silver' | 'bronze' | 'unrated';

export function getGradeConfig(grade: Grade) {
  switch (grade) {
    case 'platinum':
      return {
        label: 'Platinum',
        icon: '👑',
        bg: 'bg-[#F5F3FF]',
        text: 'text-[#7C3AED]',
        border: 'border-[#DDD6FE]',
      };
    case 'gold':
      return {
        label: 'Gold',
        icon: '🥇',
        bg: 'bg-[#FFFBEB]',
        text: 'text-[#B45309]',
        border: 'border-[#FDE68A]',
      };
    case 'silver':
      return {
        label: 'Silver',
        icon: '🥈',
        bg: 'bg-[#F8FAFC]',
        text: 'text-[#475569]',
        border: 'border-[#CBD5E1]',
      };
    case 'bronze':
      return {
        label: 'Bronze',
        icon: '🥉',
        bg: 'bg-[#FFF7ED]',
        text: 'text-[#92400E]',
        border: 'border-[#FED7AA]',
      };
    default:
      return {
        label: 'Unrated',
        icon: '⚪',
        bg: 'bg-[#F8FAFC]',
        text: 'text-[#94A3B8]',
        border: 'border-[#E2E8F0]',
      };
  }
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Maps an app language code to an Intl/Date locale string.
 */
export function dateLocale(lang: string): string {
  if (lang === 'en') return 'en-GB';
  if (lang === 'ru') return 'ru-RU';
  return 'uz-UZ';
}

/**
 * Format date: "2025-04-10" → formatted according to language
 */
export function formatDate(dateStr: string, lang = 'uz'): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(dateLocale(lang), {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Localized fund name selector
 */
export function getFundName(
  fund: { name_uz?: string; name_ru?: string | null; name_en?: string | null } | null | undefined,
  lang?: string
): string {
  if (!fund) return '';
  if (lang === 'ru' && fund.name_ru?.trim()) return fund.name_ru;
  if (lang === 'en' && fund.name_en?.trim()) return fund.name_en;
  return fund.name_uz || fund.name_ru || fund.name_en || '';
}

/**
 * Localized fund description selector
 */
export function getFundDesc(
  fund: { description_uz?: string; description_ru?: string | null; description_en?: string | null } | null | undefined,
  lang?: string
): string {
  if (!fund) return '';
  if (lang === 'ru' && fund.description_ru?.trim()) return fund.description_ru;
  if (lang === 'en' && fund.description_en?.trim()) return fund.description_en;
  return fund.description_uz || fund.description_ru || fund.description_en || '';
}

/**
 * Localized project title selector
 */
export function getProjectTitle(
  proj: { title?: string; title_uz?: string | null; title_ru?: string | null; title_en?: string | null } | null | undefined,
  lang?: string
): string {
  if (!proj) return '';
  if (lang === 'ru' && proj.title_ru?.trim()) return proj.title_ru;
  if (lang === 'en' && proj.title_en?.trim()) return proj.title_en;
  return proj.title_uz || proj.title || proj.title_ru || proj.title_en || '';
}

/**
 * Localized news helpers
 */
export function getNewsTitle(
  news: { title: string; title_uz?: string | null; title_ru?: string | null; title_en?: string | null } | null | undefined,
  lang?: string
): string {
  if (!news) return '';
  if (lang === 'ru' && news.title_ru?.trim()) return news.title_ru;
  if (lang === 'en' && news.title_en?.trim()) return news.title_en;
  return news.title_uz || news.title;
}

export function getNewsContent(
  news: { content: string; content_ru?: string | null; content_en?: string | null } | null | undefined,
  lang?: string
): string {
  if (!news) return '';
  if (lang === 'ru' && news.content_ru?.trim()) return news.content_ru;
  if (lang === 'en' && news.content_en?.trim()) return news.content_en;
  return news.content;
}
