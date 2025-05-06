
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import DetailedFinancialTable from '@/components/investor/DetailedFinancialTable';
import TornadoChart from '@/components/investor/TornadoChart';
import MethodologySection from '@/components/investor/MethodologySection';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import FinancialHighlights from '@/components/investor/FinancialHighlights';
import KeyPerformanceIndicators from '@/components/investor/KeyPerformanceIndicators';
import FinancialProjectionsTable from '@/components/investor/FinancialProjectionsTable';
import DemandCapacityTable from '@/components/investor/DemandCapacityTable';
import MonteCarloSimulation from '@/components/investor/MonteCarloSimulation';
import RiskAnalysis from '@/components/investor/RiskAnalysis';
import SensitivityAnalysis from '@/components/investor/SensitivityAnalysis';

const InvestorPacketPage = () => {
  const { activeScenario } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [monteCarloResult, setMonteCarloResult] = useState(null);
  const [tornadoData, setTornadoData] = useState(null);
  const { generatePdf } = usePdfGenerator();
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Use our new PDF generator
      await generatePdf('investor-packet-content', `${activeScenario.name || 'investor-packet'}.pdf`);
      
      toast({
        title: t('investorPacket.pdfGenerated'),
        description: t('investorPacket.downloadReady'),
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: t('common.error'),
        description: t('investorPacket.generationFailed'),
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
          title: t('dashboard.noData'),
          description: t('dashboard.configureInputs'),
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
        title: t('investorPacket.csvReady'),
        description: t('investorPacket.downloadReady')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('investorPacket.downloadFailed'),
        variant: 'destructive'
      });
    }
  };
  
  if (!activeScenario.results) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{t('dashboard.noData')}</CardTitle>
            <CardDescription>{t('dashboard.configureInputs')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { results, settings } = activeScenario;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('investorPacket.title')}</h1>
      
      {/* Run sensitivity analysis when component mounts */}
      <SensitivityAnalysis 
        settings={settings}
        setMonteCarloResult={setMonteCarloResult}
        setTornadoData={setTornadoData}
      />
      
      <div className="mb-6 flex flex-wrap gap-4">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {isGenerating ? t('investorPacket.generatingPdf') : t('investorPacket.downloadInvestorPacket')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2"
        >
          <Download size={16} /> {t('investorPacket.downloadCsv')}
        </Button>
      </div>
      
      {/* Wrap all content to be included in the PDF in a single div with ID */}
      <div id="investor-packet-content" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" id="summary-section">
          <Card>
            <CardHeader>
              <CardTitle>{t('investorPacket.executiveSummary')}</CardTitle>
              <CardDescription>{t('investorPacket.financialHighlights')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FinancialHighlights results={results} settings={settings} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('investorPacket.keyPerformanceIndicators')}</CardTitle>
              <CardDescription>{t('investorPacket.financialOperationalKpis')}</CardDescription>
            </CardHeader>
            <CardContent>
              <KeyPerformanceIndicators results={results} settings={settings} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('investorPacket.financialProjections')}</CardTitle>
            <CardDescription>{settings.forecastYears}-{t('common.yearForecast')}</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialProjectionsTable results={results} settings={settings} />
          </CardContent>
        </Card>
        
        <Card id="demand-capacity-section">
          <CardHeader>
            <CardTitle>{t('investorPacket.demandVsCapacity')}</CardTitle>
            <CardDescription>{t('investorPacket.demandVsCapacityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <DemandCapacityTable results={results} settings={settings} />
          </CardContent>
        </Card>
        
        <DetailedFinancialTable
          id="detail-table"
          results={results}
          settings={settings}
        />
        
        <MethodologySection 
          id="methodology-section"
          settings={settings}
          results={results}
        />
        
        {tornadoData && (
          <Card className="mt-6" id="tornado-chart">
            <CardHeader>
              <CardTitle>{t('sensitivity.tornadoChart')}</CardTitle>
              <CardDescription>{t('sensitivity.tornadoDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TornadoChart data={tornadoData} />
            </CardContent>
          </Card>
        )}
        
        <MonteCarloSimulation monteCarloResult={monteCarloResult} />
        
        <RiskAnalysis tornadoData={tornadoData} />
      </div>
    </div>
  );
};

export default InvestorPacketPage;
