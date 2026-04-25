import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Fund } from '@/src/types';

interface CompareRadarProps {
  funds: Fund[];
}

const COLORS = ['#1A56DB', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg px-4 py-3 text-sm">
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="font-medium text-[#64748B]">{entry.name}:</span>
          <span className="font-bold text-[#1E293B]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const CompareRadar: React.FC<CompareRadarProps> = ({ funds }) => {
  const { t } = useTranslation('compare');

  const axes = [
    { subject: t('totalScore'), key: 'overall' as const },
    { subject: t('transparency'), key: 'transparency' as const },
    { subject: t('openness'), key: 'openness' as const },
    { subject: t('trust'), key: 'trust' as const },
  ];

  const data = axes.map(({ subject, key }) => {
    const row: Record<string, any> = { subject, fullMark: 100 };
    funds.forEach((fund, index) => {
      row[`fund${index}`] = fund.indexes[key];
    });
    return row;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1E293B]">{t('radarTitle')}</h3>
        <div className="flex items-center gap-4">
          {funds.map((fund, i) => (
            <div key={fund.id} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-xs font-semibold text-[#64748B] max-w-[100px] truncate">
                {fund.name_uz}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              axisLine={false}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            {funds.map((fund, index) => (
              <Radar
                key={fund.id}
                name={fund.name_uz}
                dataKey={`fund${index}`}
                stroke={COLORS[index]}
                fill={COLORS[index]}
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{ r: 4, fill: COLORS[index], strokeWidth: 2, stroke: '#fff' }}
                isAnimationActive
              />
            ))}
            <Legend wrapperStyle={{ display: 'none' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
