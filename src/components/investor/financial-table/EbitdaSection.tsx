
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { YearResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface EbitdaSectionProps {
  yearlyResults: YearResult[];
}

const EbitdaSection: React.FC<EbitdaSectionProps> = ({ yearlyResults }) => {
  const { t } = useTranslation(['table', 'investorPacket']);

  return (
    <TableRow className="border-t border-primary/10">
      <TableCell className="font-medium">
        {t('ebitda', { ns: 'table' })}
        <InfoTooltip id="ebitda-detail" />
      </TableCell>
      {yearlyResults.map((yr, index) => (
        <TableCell key={index} className="text-right font-medium">
          {formatCurrency(yr.ebitda)}
          ({formatPercentage(yr.ebitda / yr.revenue)})
        </TableCell>
      ))}
    </TableRow>
  );
};

export default EbitdaSection;
