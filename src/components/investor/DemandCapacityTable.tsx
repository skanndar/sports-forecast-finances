
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber, formatPercentage } from '@/lib/formatters';
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
              <React.Fragment key={`header-${idx}`}>
                <TableHead>{t('inputs.demandRentals')}: {product.name}</TableHead>
                <TableHead>{t('inputs.potentialCapacity')}: {product.name}</TableHead>
                <TableHead>{t('inputs.occupancyReal')}: {product.name}</TableHead>
                <TableHead>{t('inputs.actualRentals')}: {product.name}</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.yearlyResults.map((yr, yearIndex) => (
            <TableRow key={yearIndex}>
              <TableCell>{yearIndex + 1}</TableCell>
              <TableCell>{formatNumber(yr.customersCount || 0)}</TableCell>
              {settings.products.map((product, productIdx) => (
                <React.Fragment key={`data-${yearIndex}-${productIdx}`}>
                  <TableCell>
                    {yr.demandRentals && formatNumber(yr.demandRentals[product.name] || 0)}
                  </TableCell>
                  <TableCell>
                    {yr.potentialCapacity && formatNumber(yr.potentialCapacity[product.name] || 0)}
                  </TableCell>
                  <TableCell>
                    {yr.realOccupancy && formatPercentage(yr.realOccupancy[product.name] || 0)}
                  </TableCell>
                  <TableCell>
                    {yr.actualRentals && formatNumber(yr.actualRentals[product.name] || 0)}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DemandCapacityTable;
