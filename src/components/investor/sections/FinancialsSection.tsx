
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
import FinancialProjectionsTable from '@/components/investor/FinancialProjectionsTable';
import DetailedFinancialTable from '@/components/investor/DetailedFinancialTable';
import DemandCapacityTable from '@/components/investor/DemandCapacityTable';

interface FinancialsSectionProps {
  results: ProjectResult;
  settings: Settings;
}

const FinancialsSection: React.FC<FinancialsSectionProps> = ({ results, settings }) => {
  const { t } = useTranslation(['investorPacket', 'common']);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('financialProjections', { ns: 'investorPacket' })}</CardTitle>
          <CardDescription>{settings.forecastYears}-{t('yearForecast', { ns: 'common' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialProjectionsTable results={results} settings={settings} />
        </CardContent>
      </Card>
      
      <Card id="demand-capacity-section">
        <CardHeader>
          <CardTitle>{t('demandVsCapacity', { ns: 'investorPacket' })}</CardTitle>
          <CardDescription>{t('demandVsCapacityDesc', { ns: 'investorPacket' })}</CardDescription>
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
    </>
  );
};

export default FinancialsSection;
