
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { YearResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface GrossMarginSectionProps {
  yearlyResults: YearResult[];
  calculateGrossMargin: (year: YearResult) => number;
  calculateGrossMarginPct: (year: YearResult) => number;
}

const GrossMarginSection: React.FC<GrossMarginSectionProps> = ({ 
  yearlyResults,
  calculateGrossMargin,
  calculateGrossMarginPct
}) => {
  const { t } = useTranslation(['table', 'investorPacket']);

  return (
    <TableRow>
      <TableCell className="font-medium">
        {t('grossMargin', { ns: 'table' })}
        <InfoTooltip id="gross-margin" />
      </TableCell>
      {yearlyResults.map((yr, index) => (
        <TableCell key={index} className="text-right font-medium">
          {formatCurrency(calculateGrossMargin(yr))} 
          ({formatPercentage(calculateGrossMarginPct(yr)/100)})
        </TableCell>
      ))}
    </TableRow>
  );
};

export default GrossMarginSection;
