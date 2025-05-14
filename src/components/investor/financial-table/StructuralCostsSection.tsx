
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import InfoTooltip from "@/components/ui/info-tooltip";
import { YearResult } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

interface StructuralCostsSectionProps {
  yearlyResults: YearResult[];
}

const StructuralCostsSection: React.FC<StructuralCostsSectionProps> = ({ yearlyResults }) => {
  const { t } = useTranslation(['table', 'investorPacket']);

  return (
    <>
      <TableRow className="bg-muted">
        <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
          {t('structuralCosts', { ns: 'table' })}
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell className="font-medium">
          {t('structuralCosts', { ns: 'table' })}
          <InfoTooltip id="structural-costs" />
        </TableCell>
        {yearlyResults.map((yr, index) => (
          <TableCell key={index} className="text-right">
            {formatCurrency(yr.structuralCosts)}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export default StructuralCostsSection;
