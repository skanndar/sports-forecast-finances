
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TornadoChart from '@/components/investor/TornadoChart';
import MonteCarloSimulation from '@/components/investor/MonteCarloSimulation';
import RiskAnalysis from '@/components/investor/RiskAnalysis';
import MethodologySection from '@/components/investor/MethodologySection';
import { ProjectResult, Settings, TornadoItem, MonteCarloResult } from '@/lib/types';

interface AnalysisSectionProps {
  tornadoData: TornadoItem[] | null;
  monteCarloResult: MonteCarloResult | null;
  settings: Settings;
  results: ProjectResult;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ 
  tornadoData, 
  monteCarloResult,
  settings,
  results
}) => {
  const { t } = useTranslation(['investorPacket', 'sensitivity']);
  
  return (
    <>
      <MethodologySection 
        id="methodology-section"
        settings={settings}
        results={results}
      />
      
      {tornadoData && (
        <Card className="mt-6" id="tornado-chart">
          <CardHeader>
            <CardTitle>{t('tornadoChart', { ns: 'sensitivity' })}</CardTitle>
            <CardDescription>{t('tornadoDesc', { ns: 'sensitivity' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <TornadoChart data={tornadoData} />
          </CardContent>
        </Card>
      )}
      
      <MonteCarloSimulation monteCarloResult={monteCarloResult} />
      
      <RiskAnalysis tornadoData={tornadoData} />
    </>
  );
};

export default AnalysisSection;
