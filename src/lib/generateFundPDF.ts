import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Fund } from '../types';

export const generateFundPDF = async (fund: Fund) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const today = new Date().toLocaleDateString('uz-UZ');

  // Helper for footer
  const addFooter = (pageNum: number) => {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Charity Index Uzbekistan | charityindex.uz | Hisobot sanasi: ${today}`, margin, pageHeight - 10);
    doc.text(`Sahifa ${pageNum}`, pageWidth - margin - 10, pageHeight - 10);
  };

  // PAGE 1 - Overview
  // Header Bar
  doc.setFillColor(26, 86, 219); // primary-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CHARITY INDEX UZBEKISTAN', margin, 15);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Fond Ma\'lumotlari Hisoboti', margin, 25);
  doc.text(`Sana: ${today}`, margin, 32);

  // Fund Info Section
  let y = 55;
  doc.setTextColor(30, 41, 59); // slate-900
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(fund.name_uz, margin, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`${fund.indexes.grade.toUpperCase()} DARAJA | ${fund.is_verified ? 'TASDIQLANGAN' : 'TASDIQLANMAGAN'}`, margin, y);

  y += 15;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(margin, y, pageWidth - margin, y);

  y += 15;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  
  const infoGrid = [
    { label: 'Rahbar', value: fund.director },
    { label: 'Tashkil yili', value: fund.founded_year.toString() },
    { label: 'Kategoriya', value: fund.category },
    { label: 'Viloyat', value: fund.region },
    { label: 'Veb-sayt', value: fund.website || 'Mavjud emas' },
    { label: 'INN', value: fund.inn }
  ];

  infoGrid.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xPos = margin + col * (pageWidth / 2 - margin);
    const yPos = y + row * 12;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, xPos, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, xPos + 30, yPos);
  });

  // Index Scores
  y += 45;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Indeks Ko\'rsatkichlari', margin, y);

  y += 15;
  const scores = [
    { label: 'Shaffoflik', score: fund.indexes.transparency },
    { label: 'Ochiqlik', score: fund.indexes.openness },
    { label: 'Ishonchlilik', score: fund.indexes.trust }
  ];

  scores.forEach((item, i) => {
    const xPos = margin + i * (pageWidth / 3 - 10);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, xPos, y);
    
    doc.setFontSize(16);
    doc.setTextColor(26, 86, 219);
    doc.text(`${item.score}/100`, xPos, y + 8);
    
    // Progress bar
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(241, 245, 249);
    doc.rect(xPos, y + 12, 40, 2, 'F');
    doc.setFillColor(26, 86, 219);
    doc.rect(xPos, y + 12, (item.score / 100) * 40, 2, 'F');
  });

  y += 35;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, pageWidth - 2 * margin, 30, 'F');
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text('UMUMIY INDEKS:', margin + 10, y + 12);
  doc.setFontSize(24);
  doc.setTextColor(26, 86, 219);
  doc.text(`${fund.indexes.overall}/100`, margin + 10, y + 22);
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.text('DARAJA:', margin + 80, y + 12);
  doc.setFontSize(18);
  doc.text(fund.indexes.grade.toUpperCase(), margin + 80, y + 22);

  y += 45;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Hisoblash Formulasi:', margin, y);
  doc.setFont('courier', 'normal');
  doc.text('Umumiy = (Shaffoflik x 40%) + (Ochiqlik x 30%) + (Ishonchlilik x 30%)', margin, y + 7);

  addFooter(1);

  // PAGE 2 - Projects
  doc.addPage();
  y = 30;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Loyihalar', margin, y);

  y += 15;
  const projects = [
    { name: '100 ta maktabga kutubxona', status: 'Yakunlangan', budget: '450 mln', spent: '442 mln', perc: '98%' },
    { name: 'Yetim bolalar ta\'lim dasturi', status: 'Faol', budget: '280 mln', spent: '156 mln', perc: '56%' },
    { name: 'O\'qituvchilar malaka oshirish', status: 'Rejalashtirilgan', budget: '120 mln', spent: '0', perc: '0%' }
  ];

  projects.forEach((p, i) => {
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, pageWidth - 2 * margin, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(p.name, margin + 5, y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Holati: ${p.status} | Budjet: ${p.budget} | Sarflandi: ${p.spent} | Bajarildi: ${p.perc}`, margin + 5, y + 18);
    
    y += 30;
  });

  addFooter(2);

  // PAGE 3 - Financial
  doc.addPage();
  y = 30;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Moliyaviy Ko\'rsatkichlar', margin, y);

  y += 15;
  doc.setFontSize(12);
  doc.text('Umumiy xulosa', margin, y);
  
  y += 10;
  const financialSummary = [
    ['Jami Kirim', `${fund.total_income.toLocaleString()} so'm`],
    ['Jami Chiqim', `${fund.total_spent.toLocaleString()} so'm`],
    ['Qoldiq', `${(fund.total_income - fund.total_spent).toLocaleString()} so'm`]
  ];

  financialSummary.forEach((row, i) => {
    doc.setFont('helvetica', 'normal');
    doc.text(row[0], margin, y + i * 8);
    doc.setFont('helvetica', 'bold');
    doc.text(row[1], margin + 60, y + i * 8);
  });

  y += 40;
  doc.setFontSize(12);
  doc.text('Yillik ko\'rsatkichlar', margin, y);
  
  y += 10;
  const yearlyData = [
    ['Yil', 'Kirim', 'Chiqim'],
    ['2022', '280,000,000', '260,000,000'],
    ['2023', '450,000,000', '420,000,000'],
    ['2024', '510,000,000', '500,000,000']
  ];

  yearlyData.forEach((row, i) => {
    const yPos = y + i * 10;
    doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
    doc.text(row[0], margin, yPos);
    doc.text(row[1], margin + 40, yPos);
    doc.text(row[2], margin + 90, yPos);
    
    if (i === 0) {
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    }
  });

  addFooter(3);

  // Save PDF
  const filename = `${fund.slug}-hisobot-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
