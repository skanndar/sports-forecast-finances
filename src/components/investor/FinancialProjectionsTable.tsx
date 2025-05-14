
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { ProjectResult, Settings } from '@/lib/types';

interface FinancialProjectionsTableProps {
  results: ProjectResult;
  settings: Settings;
}

const FinancialProjectionsTable = ({ results }: FinancialProjectionsTableProps) => {
  const { t } = useTranslation(['table', 'investorPacket', 'common']);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">{t('metric', { ns: 'table' })}</th>
            {results.yearlyResults.map((_, index) => (
              <th key={index} className="text-right p-2">{t('year', { ns: 'common' })} {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">{t('customersPerYear', { ns: 'investorPacket' })}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">
                {formatNumber(yr.customersCount || 0)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('revenue', { ns: 'table' })}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.revenue)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('variableCosts', { ns: 'table' })}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.variableCosts)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('grossMargin', { ns: 'table' })}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">
                {formatPercentage((yr.revenue - yr.variableCosts) / yr.revenue)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('structuralCosts', { ns: 'table' })}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.structuralCosts)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('ebitda', { ns: 'table' })}</td>
            {results.yearlyResults.map((yr, index) => (
              <td key={index} className="text-right p-2">{formatCurrency(yr.ebitda)}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-2">{t('ebitdaMargin', { ns: 'table' })}</td>
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
