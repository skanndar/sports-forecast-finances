
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { YearResult } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

interface CashFlowSectionProps {
  yearlyResults: YearResult[];
  initialInvestment: number;
}

const CashFlowSection: React.FC<CashFlowSectionProps> = ({ yearlyResults, initialInvestment }) => {
  const { t } = useTranslation(['table', 'investorPacket']);

  return (
    <>
      <TableRow className="bg-muted">
        <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
          {t('cashFlow', { ns: 'table' })}
        </TableCell>
      </TableRow>
      
      {initialInvestment > 0 && (
        <TableRow>
          <TableCell className="pl-6">
            {t('initialInvestment', { ns: 'table' })}
            <InfoTooltip id="initial-investment" />
          </TableCell>
          <TableCell className="text-right text-danger">
            {formatCurrency(-initialInvestment)}
          </TableCell>
          {yearlyResults.slice(1).map((_, index) => (
            <TableCell key={index} className="text-right">
              {formatCurrency(0)}
            </TableCell>
          ))}
        </TableRow>
      )}
      
      <TableRow>
        <TableCell className="pl-6">
          {t('operatingCashFlow', { ns: 'table' })}
          <InfoTooltip id="operating-cash-flow" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right">
            {formatCurrency(yr.cash)}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow className="border-t border-primary/10">
        <TableCell className="font-medium">
          {t('netCashFlow', { ns: 'table' })}
          <InfoTooltip id="net-cash-flow" />
        </TableCell>
        <TableCell className="text-right font-medium">
          {formatCurrency(-initialInvestment + yearlyResults[0].cash)}
        </TableCell>
        {yearlyResults.slice(1).map((yr, index) => (
          <TableCell key={index + 1} className="text-right font-medium">
            {formatCurrency(yr.cash)}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow>
        <TableCell className="font-medium">
          {t('cumulativeCashFlow', { ns: 'table' })}
          <InfoTooltip id="cumulative-cash-flow" />
        </TableCell>
        {yearlyResults.map((_, yearIndex) => {
          const cumulativeCashFlow = [-initialInvestment, ...yearlyResults.map(yr => yr.cash)]
            .slice(0, yearIndex + 2)
            .reduce((sum, cash) => sum + cash, 0);
          
          return (
            <TableCell key={yearIndex} className="text-right font-medium">
              {formatCurrency(cumulativeCashFlow)}
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );
};

export default CashFlowSection;
