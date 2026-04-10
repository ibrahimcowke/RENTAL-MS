import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

export interface ReceiptData {
  receiptNumber: string;
  tenantName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  propertyAddress: string;
  language: 'so' | 'en';
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const isSomali = data.language === 'so';

  // Branding Colors
  const primaryColor = '#0F766E'; // Deep Teal
  const secondaryColor = '#F59E0B'; // Amber

  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 148, 40, 'F');
  
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MOGADISHU RENTAL', 15, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Property Management Solutions', 15, 25);

  // Logo Placeholder (Text-based)
  doc.setDrawColor('#FFFFFF');
  doc.setLineWidth(0.5);
  doc.circle(125, 20, 10, 'S');
  doc.text('MR', 122, 22);

  // Receipt Titles
  doc.setTextColor('#333333');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(isSomali ? 'CADDEYN BIXIN' : 'PAYMENT RECEIPT', 15, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${isSomali ? 'Lambarka' : 'Receipt No'}: ${data.receiptNumber}`, 15, 62);
  doc.text(`${isSomali ? 'Taariikhda' : 'Date'}: ${format(new Date(data.date), 'PPP')}`, 15, 68);

  // Info Box
  doc.setDrawColor('#EEEEEE');
  doc.setFillColor('#F9FAFB');
  doc.roundedRect(12, 75, 124, 45, 5, 5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text(isSomali ? 'AYAA KA HELAY' : 'RECEIVED FROM', 20, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(data.tenantName, 20, 92);

  doc.setFont('helvetica', 'bold');
  doc.text(isSomali ? 'CADADKA' : 'AMOUNT PAID', 20, 102);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text(`$${data.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 20, 110);

  // Details Table
  doc.setTextColor('#666666');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(isSomali ? 'HABKA BIXINTA' : 'PAYMENT METHOD', 15, 130);
  doc.text(isSomali ? 'GURIGA' : 'PROPERTY/LEASE', 80, 130);

  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentMethod, 15, 136);
  doc.text(data.propertyAddress, 80, 136);

  // Footer / Signature
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.2);
  doc.line(80, 170, 135, 170);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text(isSomali ? 'Saxiixa Maamulka' : 'Authorized Signature', 95, 175);

  // Decorative element
  doc.setFillColor(secondaryColor);
  doc.rect(0, 200, 148, 10, 'F');
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.text('Kala soco gurigaaga si casri ah - Mogadishu Rental MGMT', 25, 206);

  // Save/Return
  doc.save(`Receipt_${data.receiptNumber}.pdf`);
};
