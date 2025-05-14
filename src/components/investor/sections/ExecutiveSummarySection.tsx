
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectResult, Settings } from '@/lib/types';
import FinancialHighlights from '@/components/investor/FinancialHighlights';
import KeyPerformanceIndicators from '@/components/investor/KeyPerformanceIndicators';

interface ExecutiveSummarySectionProps {
  results: ProjectResult;
  settings: Settings;
}

const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({ results, settings }) => {
  const { t } = useTranslation(['investorPacket']);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" id="summary-section">
      <Card>
        <CardHeader>
          <CardTitle>{t('executiveSummary', { ns: 'investorPacket' })}</CardTitle>
          <CardDescription>{t('financialHighlights', { ns: 'investorPacket' })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FinancialHighlights results={results} settings={settings} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('keyPerformanceIndicators', { ns: 'investorPacket' })}</CardTitle>
          <CardDescription>{t('financialOperationalKpis', { ns: 'investorPacket' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <KeyPerformanceIndicators results={results} settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummarySection;
