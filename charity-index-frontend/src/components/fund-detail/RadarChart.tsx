import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';

interface RadarChartProps {
  fund: Fund;
  size?: number;
  dark?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({ fund, size = 300, dark = false }) => {
  const { i18n } = useTranslation('fund_detail');
  const lang = i18n.language;

  const labels = {
    transparency: lang === 'en' ? 'Transp.' : 'Shaffoflik',
    openness:     lang === 'en' ? 'Openness' : 'Ochiqlik',
    trust:        lang === 'en' ? 'Trust' : 'Ishonchlilik',
  };

  const data = [
    { subject: labels.transparency, A: fund.indexes.transparency, fullMark: 100 },
    { subject: labels.openness,     A: fund.indexes.openness,     fullMark: 100 },
    { subject: labels.trust,        A: fund.indexes.trust,        fullMark: 100 },
  ];

  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="52%" data={data}>
          <PolarGrid stroke={dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)", fontSize: 9, fontWeight: 700 }}
          />
          <Radar
            name="Indeks"
            dataKey="A"
            stroke={dark ? "#fff" : "#3B82F6"}
            fill={dark ? "#fff" : "#3B82F6"}
            fillOpacity={dark ? 0.2 : 0.4}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};
