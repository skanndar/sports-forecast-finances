
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { ProjectResult, Settings } from '@/lib/types';
import InfoTooltip from "@/components/ui/info-tooltip";

interface FinancialHighlightsProps {
  results: ProjectResult;
  settings: Settings;
}

const FinancialHighlights = ({ results, settings }: FinancialHighlightsProps) => {
  const { t } = useTranslation();
  const lastYearResult = results.yearlyResults[results.yearlyResults.length - 1];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('investorPacket.financialHighlights')}</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{t('table.revenue')}:</strong> {formatCurrency(lastYearResult.revenue)} {t('common.byYear')} {settings.forecastYears}
          </li>
          <li>
            <strong>{t('table.ebitda')}:</strong> {formatCurrency(lastYearResult.ebitda)} ({formatPercentage(lastYearResult.ebitda / lastYearResult.revenue)})
          </li>
          <li>
            <strong>{t('kpis.irr')}:</strong> {formatPercentage(results.irr)}
            <InfoTooltip id="irr" />
          </li>
          <li>
            <strong>{t('kpis.npv')}:</strong> {formatCurrency(results.npv)}
            <InfoTooltip id="npv" />
          </li>
        </ul>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('investorPacket.unitEconomics')}</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{t('investorPacket.cac')}:</strong> {formatCurrency(results.unitEconomics.cac)}
            <InfoTooltip id="cac" />
          </li>
          <li>
            <strong>{t('investorPacket.ltv')}:</strong> {formatCurrency(results.unitEconomics.ltv)}
            <InfoTooltip id="ltv" />
          </li>
          <li>
            <strong>{t('investorPacket.ltvCacRatio')}:</strong> {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
            <InfoTooltip id="ltvCac" />
          </li>
          <li>
            <strong>{t('investorPacket.paybackPeriod')}:</strong> {formatNumber(results.unitEconomics.paybackMonths)} {t('common.months')}
            <InfoTooltip id="payback" />
          </li>
        </ul>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('investorPacket.keyAssumptions')}</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>{t('inputs.growth')}:</strong> {formatPercentage(settings.growth)}
          </li>
          <li>
            <strong>{t('inputs.products')}:</strong> {settings.products.length} {t('investorPacket.differentProductOfferings')}
          </li>
          <li>
            <strong>{t('inputs.newCustomers')} ({t('common.yearly')}):</strong> {formatNumber(settings.newCustomers)}
          </li>
          <li>
            <strong>{t('inputs.churn')}:</strong> {formatPercentage(settings.churn)}
          </li>
          <li>
            <strong>{t('inputs.initialInvestment')}:</strong> {formatCurrency(settings.initialInvestment)}
          </li>
          <li>
            <strong>{t('inputs.directorCommission')}:</strong> {formatPercentage(settings.directorCommission)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FinancialHighlights;
