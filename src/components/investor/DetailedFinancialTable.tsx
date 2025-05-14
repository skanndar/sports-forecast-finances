
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProjectResult, Settings } from '@/lib/types';

// Import components
import TableHeaderComponent from './financial-table/TableHeader';
import RevenueSection from './financial-table/RevenueSection';
import VariableCostsSection from './financial-table/VariableCostsSection';
import GrossMarginSection from './financial-table/GrossMarginSection';
import StructuralCostsSection from './financial-table/StructuralCostsSection';
import EbitdaSection from './financial-table/EbitdaSection';
import RetentionSection from './financial-table/RetentionSection';
import CashFlowSection from './financial-table/CashFlowSection';
import { calculateGrossMargin, calculateGrossMarginPct } from './financial-table/CalculationHelpers';

interface DetailedFinancialTableProps {
  results: ProjectResult;
  settings: Settings;
  className?: string;
  id?: string;
}

const DetailedFinancialTable = ({ 
  results, 
  settings,
  className = "",
  id
}: DetailedFinancialTableProps) => {
  const { t } = useTranslation(['investorPacket', 'table', 'inputs', 'common']);
  // Changed to expanded by default
  const [isExpanded, setIsExpanded] = useState(true);
  
  const yearlyResults = results.yearlyResults;
  const initialInvestment = settings.initialInvestment || 0;
  const churn = settings.churn || 0;
  const rentalsPerCustomer = settings.rentalsPerCustomer || 0;

  if (!yearlyResults.length) return null;

  // Get all product names from revenue breakdown
  const productNames: string[] = [];
  yearlyResults.forEach(yr => {
    if (yr.revenueByProduct) {
      Object.keys(yr.revenueByProduct).forEach(name => {
        if (!productNames.includes(name)) {
          productNames.push(name);
        }
      });
    }
  });

  return (
    <Card className={`mt-6 ${className}`} id={id}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div>
          <CardTitle>{t('detailedForecast', { ns: 'investorPacket' })}</CardTitle>
          <CardDescription>{t('lineItemDetail', { ns: 'investorPacket' })}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
          aria-label={isExpanded ? t('common.collapse', { ns: 'common' }) : t('common.expand', { ns: 'common' })}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {isExpanded ? t('hideDetail', { ns: 'common' }) : t('showDetail', { ns: 'common' })}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeaderComponent yearlyResults={yearlyResults} />
              <TableBody>
                <RevenueSection 
                  yearlyResults={yearlyResults} 
                  productNames={productNames} 
                />
                
                <VariableCostsSection 
                  yearlyResults={yearlyResults}
                />
                
                <GrossMarginSection 
                  yearlyResults={yearlyResults}
                  calculateGrossMargin={calculateGrossMargin}
                  calculateGrossMarginPct={calculateGrossMarginPct}
                />
                
                <StructuralCostsSection 
                  yearlyResults={yearlyResults}
                />
                
                <EbitdaSection 
                  yearlyResults={yearlyResults}
                />
                
                <RetentionSection 
                  yearlyResults={yearlyResults}
                  churn={churn}
                  rentalsPerCustomer={rentalsPerCustomer}
                />
                
                <CashFlowSection 
                  yearlyResults={yearlyResults}
                  initialInvestment={initialInvestment}
                />
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DetailedFinancialTable;
