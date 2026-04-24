import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/context/LanguageContext';
import { Layout } from '@/src/components/layout/Layout';
import { useCompareStore } from '@/src/store/compareStore';
import { useToast } from '@/src/context/ToastContext';
import { generateFundPDF } from '@/src/lib/generateFundPDF';
import { useDataStore } from '@/src/store/useDataStore';
import { fundsApi } from '@/src/api/funds';
import { Fund } from '@/src/types';

// Components
import { FundHero } from '@/src/components/fund-detail/FundHero';
import { IndexPanel } from '@/src/components/fund-detail/IndexPanel';
import { ProjectsList } from '@/src/components/fund-detail/ProjectsList';
import { ReportsList } from '@/src/components/fund-detail/ReportsList';
import { FinancialChart } from '@/src/components/fund-detail/FinancialChart';
import { ReviewSection } from '@/src/components/fund-detail/ReviewSection';
import { ComplaintModal } from '@/src/components/fund-detail/ComplaintModal';

export default function FundDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('fund_detail');
  const { language } = useLanguage();
  const { funds } = useDataStore();
  const { addFund, removeFund, isSelected } = useCompareStore();
  const { showToast } = useToast();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [detailFund, setDetailFund] = useState<Fund | null>(null);

  // Fallback from store while detail loads
  const storeFund = funds.find((f) => f.slug === slug);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo(0, 0);
    fundsApi.getBySlug(slug)
      .then(setDetailFund)
      .catch(() => {
        if (!storeFund) navigate('/funds');
      });
  }, [slug]);

  useEffect(() => {
    if (!storeFund && !detailFund) navigate('/funds');
  }, [storeFund, detailFund]);

  const fund = detailFund ?? storeFund;
  if (!fund) return null;

  const selected = isSelected(fund.id);

  const handleCompare = () => {
    if (selected) {
      removeFund(fund.id);
    } else {
      const result = addFund(fund);
      showToast(result.message, result.success ? 'success' : 'warning');
    }
  };

  const handleDownloadPDF = async () => {
    showToast(t('pdf.preparing'), "info");
    try {
      await generateFundPDF(fund);
      showToast(t('pdf.success'), "success");
    } catch (error) {
      console.error("PDF generation failed:", error);
      showToast(t('pdf.error'), "error");
    }
  };

  return (
    <Layout>
      <FundHero 
        fund={fund} 
        selected={selected} 
        onCompare={handleCompare} 
        onComplaint={() => setIsComplaintModalOpen(true)} 
        onDownloadPDF={handleDownloadPDF}
      />

      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <IndexPanel fund={fund} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <ProjectsList fundId={fund.id} />
                </motion.div>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ReportsList fundId={fund.id} />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <FinancialChart fundId={fund.id} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ReviewSection fundId={fund.id} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        fundId={fund.id}
        fundName={(language === 'en' && fund.name_en) ? fund.name_en : fund.name_uz}
      />
    </Layout>
  );
}
