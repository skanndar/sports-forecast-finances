
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { ProjectResult, Settings } from '@/lib/types';
import InfoTooltip from "@/components/ui/info-tooltip";

interface KeyPerformanceIndicatorsProps {
  results: ProjectResult;
  settings: Settings;
}

const KeyPerformanceIndicators = ({ results, settings }: KeyPerformanceIndicatorsProps) => {
  const { t } = useTranslation(['kpis', 'common']);
  const lastYearResult = results.yearlyResults[results.yearlyResults.length - 1];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{t('revenue')} ({t('year', { ns: 'common' })} {settings.forecastYears})</p>
          <p className="text-2xl font-bold">{formatCurrency(lastYearResult.revenue)}</p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{t('ebitdaMargin')}</p>
          <p className="text-2xl font-bold">{formatPercentage(lastYearResult.ebitda / lastYearResult.revenue)}</p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t('irr')}
            <InfoTooltip id="irr" />
          </p>
          <p className="text-2xl font-bold">{formatPercentage(results.irr)}</p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t('npv')}
            <InfoTooltip id="npv" />
          </p>
          <p className="text-2xl font-bold">{formatCurrency(results.npv)}</p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t('ltvCacRatio')}
            <InfoTooltip id="ltvCac" />
          </p>
          <p className="text-2xl font-bold">
            {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
          </p>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t('cacPayback')}
            <InfoTooltip id="payback" />
          </p>
          <p className="text-2xl font-bold">{formatNumber(results.unitEconomics.paybackMonths)} {t('months', { ns: 'common' })}</p>
        </div>
      </div>
    </div>
  );
};

export default KeyPerformanceIndicators;
