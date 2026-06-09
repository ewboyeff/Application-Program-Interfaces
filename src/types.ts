export type Grade = 'platinum' | 'gold' | 'silver' | 'bronze' | 'unrated';

export interface Fund {
  id: string;
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  category: string;
  region: string;
  director: string;
  founded_year: number;
  description_uz: string;
  description_en?: string;
  logo_url?: string;
  logo_initials: string;
  logo_color: string;
  website: string;
  telegram: string;
  instagram?: string;
  donation_url?: string;
  inn: string;
  registration: string;
  is_verified: boolean;
  indexes: {
    transparency: number;
    openness: number;
    trust: number;
    overall: number;
    grade: Grade;
    calculated_at?: string;
  };
  projects_count: number;
  beneficiaries: number;
  total_income: number;
  total_spent: number;
}

export interface Project {
  id: string;
  title: string;
  title_uz?: string;
  fundId: string;
  status: 'active' | 'completed' | 'planned';
  budget: number;
  spent: number;
  beneficiaries: number;
  region: string;
  start_date: string;
  end_date: string;
}

export interface News {
  id: string;
  category: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  excerpt: string;
  content: string;
  content_en?: string;
  fund_slug: string | null;
  fund_name: string | null;
  fundId?: string | null;
  date: string;
  read_time: number;
  gradient: string;
  image_url?: string | null;
  source_url?: string | null;
  file_url?: string | null;
  is_featured: boolean;
  active?: boolean;
}

export interface Review {
  id: string;
  fundId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Complaint {
  id: string;
  fundId: string;
  userName: string;
  reason: string;
  description: string;
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
}
