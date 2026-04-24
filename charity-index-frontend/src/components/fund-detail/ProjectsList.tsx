import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { projectsApi, ProjectData } from '@/src/api/projects';
import { formatMoney, formatNumber, cn } from '@/src/lib/utils';

interface ProjectsListProps {
  fundId: string;
  className?: string;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ fundId, className }) => {
  const { t } = useTranslation('fund_detail');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'planned' | 'completed'>('all');

  useEffect(() => {
    if (!fundId) return;
    setLoading(true);
    projectsApi.getByFund(fundId)
      .then(res => setProjects(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fundId]);

  const filtered = projects.filter(p =>
    activeTab === 'all' ? true : p.status === activeTab
  );

  const tabs = [
    { id: 'all',       label: t('projects.tabs.all') },
    { id: 'active',    label: t('projects.tabs.active') },
    { id: 'planned',   label: t('projects.tabs.planned') },
    { id: 'completed', label: t('projects.tabs.completed') },
  ];

  return (
    <div className={cn("bg-white shadow-card rounded-2xl p-6 border border-slate-100", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-900">{t('projects.title')}</h2>
        <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full">
          {t('projects.count', { count: projects.length })}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold transition-all',
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
          <Circle className="w-10 h-10 opacity-20" />
          <p className="text-sm font-bold">{t('projects.noProjects')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const progress = project.budget > 0
                ? Math.min(100, Math.round((project.spent / project.budget) * 100))
                : 0;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                >
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
                    project.status === 'completed' ? 'from-emerald-400 to-emerald-600' :
                    project.status === 'active'    ? 'from-blue-400 to-blue-600' :
                    'from-slate-300 to-slate-400'
                  )} />

                  <div className="pl-3">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight pr-20 group-hover:text-primary-600 transition-colors">
                        {project.title_uz}
                      </h3>
                      <div className={cn(
                        'px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0',
                        project.status === 'completed' ? 'bg-emerald-100/50 text-emerald-700' :
                        project.status === 'active'    ? 'bg-blue-100/50 text-blue-700' :
                        'bg-slate-200/50 text-slate-600'
                      )}>
                        {project.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                         project.status === 'active'    ? <Circle className="w-3 h-3 fill-current" /> :
                         <Clock className="w-3 h-3" />}
                        {project.status === 'completed' ? t('projects.status.completed') :
                         project.status === 'active'    ? t('projects.status.active') : t('projects.status.planned')}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{t('projects.budget')}</span>
                        <span className="text-slate-900">{formatMoney(project.budget)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                              'h-full rounded-full bg-gradient-to-r',
                              project.status === 'completed' ? 'from-emerald-400 to-emerald-600' :
                              project.status === 'active'    ? 'from-blue-400 to-blue-600' :
                              'from-slate-300 to-slate-400'
                            )}
                          />
                        </div>
                        <span className={cn(
                          "text-sm font-black",
                          project.status === 'completed' ? 'text-emerald-600' :
                          project.status === 'active'    ? 'text-blue-600' : 'text-slate-500'
                        )}>
                          {progress}%
                        </span>
                      </div>

                      <div className="text-[10px] font-medium text-slate-500">
                        {t('projects.spent', { amount: formatMoney(project.spent) })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>{t('projects.beneficiaries', { count: formatNumber(project.beneficiaries_count) })}</span>
                      </div>
                      {project.end_date && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{project.end_date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
