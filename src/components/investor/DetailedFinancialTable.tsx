
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ProjectResult, Settings, YearResult } from '@/lib/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import InfoTooltip from "@/components/ui/info-tooltip";

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

  // Calculate gross margin for each year
  const calculateGrossMargin = (year: YearResult) => {
    return year.revenue - year.variableCosts;
  };

  // Calculate gross margin percentage for each year
  const calculateGrossMarginPct = (year: YearResult) => {
    if (year.revenue === 0) return 0;
    return (calculateGrossMargin(year) / year.revenue) * 100;
  };

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
              <TableBody>
                {/* Revenue by product */}
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
                
                {/* Variable Costs */}
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
                
                {/* Gross Margin */}
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
                
                {/* Structural Costs */}
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
                
                {/* EBITDA */}
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
                
                {/* Retention Metrics */}
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
                
                {/* Cash Flow */}
                <TableRow className="bg-muted">
                  <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
                    {t('cashFlow', { ns: 'table' })}
                  </TableCell>
                </TableRow>
                
                {initialInvestment > 0 && (
                  <TableRow>
                    <TableCell className="pl-6">
                      {t('initialInvestment', { ns: 'table' })}
                      <InfoTooltip id="initial-investment" />
                    </TableCell>
                    <TableCell className="text-right text-danger">
                      {formatCurrency(-initialInvestment)}
                    </TableCell>
                    {yearlyResults.slice(1).map((_, index) => (
                      <TableCell key={index} className="text-right">
                        {formatCurrency(0)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
                
                <TableRow>
                  <TableCell className="pl-6">
                    {t('operatingCashFlow', { ns: 'table' })}
                    <InfoTooltip id="operating-cash-flow" />
                  </TableCell>
                  {yearlyResults.map((yr, index) => (
                    <TableCell key={index} className="text-right">
                      {formatCurrency(yr.cash)}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow className="border-t border-primary/10">
                  <TableCell className="font-medium">
                    {t('netCashFlow', { ns: 'table' })}
                    <InfoTooltip id="net-cash-flow" />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(-initialInvestment + yearlyResults[0].cash)}
                  </TableCell>
                  {yearlyResults.slice(1).map((yr, index) => (
                    <TableCell key={index + 1} className="text-right font-medium">
                      {formatCurrency(yr.cash)}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">
                    {t('cumulativeCashFlow', { ns: 'table' })}
                    <InfoTooltip id="cumulative-cash-flow" />
                  </TableCell>
                  {yearlyResults.map((_, yearIndex) => {
                    const cumulativeCashFlow = [-initialInvestment, ...yearlyResults.map(yr => yr.cash)]
                      .slice(0, yearIndex + 2)
                      .reduce((sum, cash) => sum + cash, 0);
                    
                    return (
                      <TableCell key={yearIndex} className="text-right font-medium">
                        {formatCurrency(cumulativeCashFlow)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DetailedFinancialTable;
