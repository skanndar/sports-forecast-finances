
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { YearResult } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

interface RevenueSectionProps {
  yearlyResults: YearResult[];
  productNames: string[];
}

const RevenueSection: React.FC<RevenueSectionProps> = ({ yearlyResults, productNames }) => {
  const { t } = useTranslation(['table', 'investorPacket']);

  return (
    <>
      <TableRow className="bg-muted">
        <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
          {t('revenue', { ns: 'table' })}
        </TableCell>
      </TableRow>
      
      {productNames.map(productName => (
        <TableRow key={productName}>
          <TableCell className="pl-6">{productName}</TableCell>
          {yearlyResults.map((yr, index) => (
            <TableCell key={index} className="text-right">
              {formatCurrency(yr.revenueByProduct?.[productName] || 0)}
            </TableCell>
          ))}
        </TableRow>
      ))}
      
      <TableRow className="border-t border-primary/10">
        <TableCell className="font-medium">
          {t('totalRevenue', { ns: 'table' })}
          <InfoTooltip id="total-revenue" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right font-medium">
            {formatCurrency(yr.revenue)}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export default RevenueSection;
