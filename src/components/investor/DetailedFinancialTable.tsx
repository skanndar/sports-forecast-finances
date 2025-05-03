
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
import { YearResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import InfoTooltip from "@/components/ui/info-tooltip";

interface DetailedFinancialTableProps {
  yearlyResults: YearResult[];
  initialInvestment?: number;
  className?: string;
  id?: string;
}

const DetailedFinancialTable = ({ 
  yearlyResults, 
  initialInvestment = 0, 
  className = "",
  id
}: DetailedFinancialTableProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

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
          <CardTitle>{t('investorPacket.detailedForecast')}</CardTitle>
          <CardDescription>{t('investorPacket.lineItemDetail')}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
          aria-label={isExpanded ? t('common.collapse') : t('common.expand')}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {isExpanded ? t('common.hideDetail') : t('common.showDetail')}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">{t('table.item')}</TableHead>
                  {yearlyResults.map((_, index) => (
                    <TableHead key={index} className="text-right">
                      {t('common.year')} {index + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Revenue by product */}
                <TableRow className="bg-muted">
                  <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
                    {t('table.revenue')}
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
                    {t('table.totalRevenue')}
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
                    {t('table.variableCosts')}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="pl-6">
                    {t('table.productCosts')}
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
                    {t('table.prescriberCommissions')}
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
                    {t('table.directorCommission')}
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
                    {t('table.totalVariableCosts')}
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
                    {t('table.grossMargin')}
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
                    {t('table.structuralCosts')}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">
                    {t('table.structuralCosts')}
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
                    {t('table.ebitda')}
                    <InfoTooltip id="ebitda-detail" />
                  </TableCell>
                  {yearlyResults.map((yr, index) => (
                    <TableCell key={index} className="text-right font-medium">
                      {formatCurrency(yr.ebitda)}
                      ({formatPercentage(yr.ebitda / yr.revenue)})
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Cash Flow */}
                <TableRow className="bg-muted">
                  <TableCell colSpan={yearlyResults.length + 1} className="font-bold">
                    {t('table.cashFlow')}
                  </TableCell>
                </TableRow>
                
                {initialInvestment > 0 && (
                  <TableRow>
                    <TableCell className="pl-6">
                      {t('table.initialInvestment')}
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
                    {t('table.operatingCashFlow')}
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
                    {t('table.netCashFlow')}
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
                    {t('table.cumulativeCashFlow')}
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
