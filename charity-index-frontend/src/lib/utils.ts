import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8000';

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
 * Format date: "2025-04-10" → "10 Apr 2025"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}
