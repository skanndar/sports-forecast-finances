
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { YearResult } from '@/lib/types';

interface TableHeaderProps {
  yearlyResults: YearResult[];
}

const TableHeaderComponent: React.FC<TableHeaderProps> = ({ yearlyResults }) => {
  const { t } = useTranslation(['table', 'common']);

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[180px]">{t('item', { ns: 'table' })}</TableHead>
        {yearlyResults.map((_, index) => (
          <TableHead key={index} className="text-right">
            {t('year', { ns: 'common' })} {index + 1}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderComponent;
