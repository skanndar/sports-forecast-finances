
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { YearResult } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

interface VariableCostsSectionProps {
  yearlyResults: YearResult[];
}

const VariableCostsSection: React.FC<VariableCostsSectionProps> = ({ yearlyResults }) => {
  const { t } = useTranslation(['table', 'investorPacket']);

  return (
    <>
      <TableRow className="bg-muted">
        <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
          {t('variableCosts', { ns: 'table' })}
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell className="pl-6">
          {t('productCosts', { ns: 'table' })}
          <InfoTooltip id="product-costs" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right">
            {formatCurrency(yr.productCosts || 0)}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow>
        <TableCell className="pl-6">
          {t('prescriberCommissions', { ns: 'table' })}
          <InfoTooltip id="prescriber-commissions" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right">
            {formatCurrency(yr.prescriberCosts || 0)}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow>
        <TableCell className="pl-6">
          {t('directorCommission', { ns: 'table' })}
          <InfoTooltip id="director-commission" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right">
            {formatCurrency(yr.directorCost || 0)}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow className="border-t border-primary/10">
        <TableCell className="font-medium">
          {t('totalVariableCosts', { ns: 'table' })}
          <InfoTooltip id="total-variable-costs" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right font-medium">
            {formatCurrency(yr.variableCosts)}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export default VariableCostsSection;
