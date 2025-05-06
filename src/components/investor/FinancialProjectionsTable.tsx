
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { ProjectResult, Settings } from '@/lib/types';

interface FinancialProjectionsTableProps {
  results: ProjectResult;
  settings: Settings;
}

const FinancialProjectionsTable = ({ results }: FinancialProjectionsTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">{t('table.metric')}</th>
            {results.yearlyResults.map((_, index) => (
              <th key={index} className="text-right p-2">{t('common.year')} {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">{t('investorPacket.customersPerYear')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">
                {formatNumber(yr.customersCount || 0)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('table.revenue')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.revenue)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('table.variableCosts')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.variableCosts)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('table.grossMargin')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">
                {formatPercentage((yr.revenue - yr.variableCosts) / yr.revenue)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('table.structuralCosts')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.structuralCosts)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('table.ebitda')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.ebitda)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('table.ebitdaMargin')}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">
                {formatPercentage(yr.ebitda / yr.revenue)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialProjectionsTable;
