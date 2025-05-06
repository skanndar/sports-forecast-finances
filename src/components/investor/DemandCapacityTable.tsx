
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/lib/formatters';
import { ProjectResult, Settings } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface DemandCapacityTableProps {
  results: ProjectResult;
  settings: Settings;
}

const DemandCapacityTable = ({ results, settings }: DemandCapacityTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.year')}</TableHead>
            <TableHead>{t('investorPacket.customersPerYear')}</TableHead>
            {settings.products.map((product, idx) => (
              <TableHead key={idx}>{t('investorPacket.actualRentals')}: {product.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.yearlyResults.map((yr, yearIndex) => (
            <TableRow key={yearIndex}>
              <TableCell>{yearIndex + 1}</TableCell>
              <TableCell>{formatNumber(yr.customersCount || 0)}</TableCell>
              {settings.products.map((product, productIdx) => (
                <TableCell key={productIdx}>
                  {yr.actualRentals && formatNumber(yr.actualRentals[product.name] || 0)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandCapacityTable;
