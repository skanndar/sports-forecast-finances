
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { formatPercentage, formatNumber } from '@/lib/formatters';
import { YearResult } from '@/lib/types';

interface RetentionSectionProps {
  yearlyResults: YearResult[];
  churn: number;
  rentalsPerCustomer: number;
}

const RetentionSection: React.FC<RetentionSectionProps> = ({ yearlyResults, churn, rentalsPerCustomer }) => {
  const { t } = useTranslation(['table', 'investorPacket', 'inputs']);

  return (
    <>
      <TableRow className="bg-muted">
        <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
          {t('retention', { ns: 'investorPacket' })}
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell className="pl-6">
          {t('churn', { ns: 'inputs' })}
          <InfoTooltip id="churn" />
        </TableCell>
        {yearlyResults.map((_, index) => (
          <TableCell key={index} className="text-right">
            {formatPercentage(churn)}
          </TableCell>
        ))}
      </TableRow>
      
      <TableRow>
        <TableCell className="pl-6">
          {t('rentalsPerCustomer', { ns: 'inputs' })}
          <InfoTooltip id="rentals-per-customer" />
        </TableCell>
        {yearlyResults.map((_, index) => (
          <TableCell key={index} className="text-right">
            {formatNumber(rentalsPerCustomer)}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export default RetentionSection;
