
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import SensitivityAnalysis from '@/components/investor/SensitivityAnalysis';
import DownloadActions from '@/components/investor/DownloadActions';
import ExecutiveSummarySection from '@/components/investor/sections/ExecutiveSummarySection';
import FinancialsSection from '@/components/investor/sections/FinancialsSection';
import AnalysisSection from '@/components/investor/sections/AnalysisSection';

const InvestorPacketPage = () => {
  const { activeScenario } = useAppStore();
  const { t } = useTranslation(['investorPacket', 'common', 'dashboard']); 
  const [monteCarloResult, setMonteCarloResult] = useState(null);
  const [tornadoData, setTornadoData] = useState(null);
  
  if (!activeScenario.results) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{t('noData', { ns: 'dashboard' })}</CardTitle>
            <CardDescription>{t('configureInputs', { ns: 'dashboard' })}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { results, settings } = activeScenario;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('title', { ns: 'investorPacket' })}</h1>
      
      {/* Run sensitivity analysis when component mounts */}
      <SensitivityAnalysis 
        settings={settings}
        setMonteCarloResult={setMonteCarloResult}
        setTornadoData={setTornadoData}
      />
      
      <DownloadActions activeScenario={activeScenario} />
      
      {/* Wrap all content to be included in the PDF in a single div with ID */}
      <div id="investor-packet-content" className="space-y-6">
        <ExecutiveSummarySection results={results} settings={settings} />
        
        <FinancialsSection results={results} settings={settings} />
        
        <AnalysisSection 
          tornadoData={tornadoData} 
          monteCarloResult={monteCarloResult}
          settings={settings}
          results={results}
        />
      </div>
    </div>
  );
};

export default InvestorPacketPage;
