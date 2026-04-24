import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Eye, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn, getScoreBg } from '@/src/lib/utils';

interface Factor {
  name: string;
  weight: number;
  score: number;
}

interface IndexCardProps {
  title: string;
  score: number;
  factors: Factor[];
  type: 'transparency' | 'openness' | 'trust';
}

export const IndexCard: React.FC<IndexCardProps> = ({ title, score, factors, type }) => {
  const { t } = useTranslation('fund_detail');
  const configs = {
    transparency: {
      icon: Eye,
      color: '#3B82F6',
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    openness: {
      icon: Globe,
      color: '#10B981',
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600'
    },
    trust: {
      icon: Shield,
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  const data = [
    { value: score, fill: config.color },
    { value: 100 - score, fill: '#F1F5F9' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
    >
      {/* TOP COLOR STRIP */}
      <div className={cn("h-1.5 bg-gradient-to-r", config.gradient)} />

      <div className="p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
            <Icon className={cn("w-5 h-5", config.text)} />
          </div>
          <h4 className="font-bold text-slate-900">{title}</h4>
          <div className={cn("ml-auto px-3 py-1 rounded-full text-sm font-black", config.bg, config.text)}>
            {score}
          </div>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="h-36 relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={58}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-xl font-black leading-none", config.text)}>{score}</span>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">/100</span>
        </div>
      </div>

      {/* FACTORS */}
      <div className="p-5 pt-0">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('factors')}</div>
        <div className="space-y-4">
          {factors.map((factor) => (
            <div key={factor.name}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-slate-700 truncate flex-1" title={factor.name}>
                  {factor.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                    {factor.weight}%
                  </span>
                  <span className={cn("text-xs font-black", config.text)}>
                    {factor.score}
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${factor.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={cn("h-full rounded-full", getScoreBg(factor.score))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
