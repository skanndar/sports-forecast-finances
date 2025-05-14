
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { ProjectResult } from '@/lib/types';

interface DownloadActionsProps {
  activeScenario: { 
    name: string;
    results?: ProjectResult;
  };
}

const DownloadActions: React.FC<DownloadActionsProps> = ({ activeScenario }) => {
  const { toast } = useToast();
  const { t } = useTranslation(['investorPacket', 'common', 'dashboard']);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generatePdf } = usePdfGenerator();

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Use our new PDF generator
      await generatePdf('investor-packet-content', `${activeScenario.name || 'investor-packet'}.pdf`);
      
      toast({
        title: t('pdfGenerated', { ns: 'investorPacket' }),
        description: t('downloadReady', { ns: 'investorPacket' }),
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: t('error', { ns: 'common' }),
        description: t('generationFailed', { ns: 'investorPacket' }),
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadCSV = () => {
    try {
      if (!activeScenario.results || !activeScenario.results.yearlyResults.length) {
        toast({
          title: t('noData', { ns: 'dashboard' }),
          description: t('configureInputs', { ns: 'dashboard' }),
          variant: 'destructive'
        });
        return;
      }
      
      // Generate CSV content
      const headers = ['Year', 'Revenue', 'VariableCosts', 'StructuralCosts', 'EBITDA', 'Cash', 'CustomersCount'];
      
      const csvContent = [
        headers.join(','),
        ...activeScenario.results.yearlyResults.map(yr => [
          `Year ${yr.year + 1}`,
          yr.revenue,
          yr.variableCosts,
          yr.structuralCosts,
          yr.ebitda,
          yr.cash,
          yr.customersCount || 0
        ].join(','))
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeScenario.name || 'financial-forecast'}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('csvReady', { ns: 'investorPacket' }),
        description: t('downloadReady', { ns: 'investorPacket' })
      });
    } catch (error) {
      toast({
        title: t('error', { ns: 'common' }),
        description: t('downloadFailed', { ns: 'investorPacket' }),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <Button 
        onClick={handleGeneratePDF} 
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        {isGenerating ? t('generatingPdf', { ns: 'investorPacket' }) : t('downloadInvestorPacket', { ns: 'investorPacket' })}
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleDownloadCSV}
        className="flex items-center gap-2"
      >
        <Download size={16} /> {t('downloadCsv', { ns: 'investorPacket' })}
      </Button>
    </div>
  );
};

export default DownloadActions;
