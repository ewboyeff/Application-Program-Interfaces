import { useState, useEffect } from 'react';
import { platformStatsApi } from '@/src/api/funds';

interface PlatformStats {
  funds: number;
  projects: number;
  beneficiaries: number;
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}K+`;
  return String(n);
}

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>({ funds: 0, projects: 0, beneficiaries: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    platformStatsApi.get()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return {
    loaded,
    fundsNum:         formatStat(stats.funds),
    projectsNum:      formatStat(stats.projects),
    beneficiariesNum: formatStat(stats.beneficiaries),
  };
}
