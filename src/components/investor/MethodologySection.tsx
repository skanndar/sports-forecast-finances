
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings } from '@/lib/types';
import InfoTooltip from "@/components/ui/info-tooltip";

interface MethodologySectionProps {
  settings: Settings;
  className?: string;
  id?: string;
}

const MethodologySection = ({ settings, className = "", id }: MethodologySectionProps) => {
  const { t } = useTranslation();

  // Example calculation for better understanding
  const exampleUnits = 10;
  const exampleOccupancy = 0.5;
  const exampleDaysMin = 15;
  const examplePricePerDay = 50;
  const examplePricePerMonth = 1000;
  
  // Example calculations for daily pricing
  const exampleRentalsYearDaily = (exampleOccupancy * 365) / exampleDaysMin;
  const exampleRevenueDaily = exampleUnits * exampleRentalsYearDaily * examplePricePerDay * exampleDaysMin;
  
  // Example calculations for monthly pricing
  const exampleRentalsYearMonthly = exampleOccupancy * 12;
  const exampleRevenueMonthly = exampleUnits * exampleRentalsYearMonthly * examplePricePerMonth;

  return (
    <Card className={`mt-6 ${className}`} id={id}>
      <CardHeader>
        <CardTitle>{t('investorPacket.methodology')}</CardTitle>
        <CardDescription>{t('investorPacket.methodologyDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.revenueCalculation')}</h3>
            <p className="mb-2">{t('investorPacket.revenueFormula')}</p>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.rentalsPerYearDaily', { defaultValue: "Daily pricing: Rentals/Year = Occupancy × 365 days / Min Days" })}
              {'\n'}
              {t('investorPacket.revenueDailyFormula', { defaultValue: "Daily pricing: Revenue = Units × Rentals/Year × Price per Day × Min Days" })}
              {'\n\n'}
              {t('investorPacket.rentalsPerYearMonthly', { defaultValue: "Monthly pricing: Rentals/Year = Occupancy × 12 months" })}
              {'\n'}
              {t('investorPacket.revenueMonthlyFormula', { defaultValue: "Monthly pricing: Revenue = Units × Rentals/Year × Price per Month" })}
            </pre>
            
            <div className="mt-4 bg-muted/50 p-2 rounded-md">
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc', { defaultValue: "Example calculation" })}</h4>
              <p className="text-sm">
                {t('investorPacket.exampleDailyFormula', {
                  defaultValue: "Daily: With {{units}} units, {{occupancy}}% occupancy, {{daysMin}} min days, {{price}}€/day → Rentals/Year = {{rentals}}, Revenue = {{revenue}}€",
                  units: exampleUnits,
                  occupancy: exampleOccupancy * 100,
                  daysMin: exampleDaysMin,
                  price: examplePricePerDay,
                  rentals: exampleRentalsYearDaily.toFixed(1),
                  revenue: Math.round(exampleRevenueDaily).toLocaleString()
                })}
              </p>
              <p className="text-sm mt-1">
                {t('investorPacket.exampleMonthlyFormula', {
                  defaultValue: "Monthly: With {{units}} units, {{occupancy}}% occupancy, {{price}}€/month → Rentals/Year = {{rentals}}, Revenue = {{revenue}}€",
                  units: exampleUnits,
                  occupancy: exampleOccupancy * 100,
                  price: examplePricePerMonth,
                  rentals: exampleRentalsYearMonthly.toFixed(1),
                  revenue: Math.round(exampleRevenueMonthly).toLocaleString()
                })}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.costsCalculation')}</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.productCostsFormula')}
              {'\n'}
              {t('investorPacket.prescriberCostsFormula')}
              {'\n'}
              {t('investorPacket.directorCostsFormula')}
              {'\n'}
              {t('investorPacket.structuralCostsFormula')}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.profitabilityCalculation')}</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.grossMarginFormula')}
              {'\n'}
              {t('investorPacket.ebitdaFormula')}
              {'\n'}
              {t('investorPacket.cashFlowFormula')}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.financialMetricsCalculation')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.metric')}</TableHead>
                  <TableHead>{t('investorPacket.formula')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{t('kpis.irr')}</TableCell>
                  <TableCell>{t('investorPacket.irrFormula')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('kpis.npv')}</TableCell>
                  <TableCell>{t('investorPacket.npvFormula')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('investorPacket.cac')}</TableCell>
                  <TableCell>{t('investorPacket.cacFormula', { defaultValue: "CAC = (Marketing Spend + Prescriber Commissions for New Customers) / New Customers" })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('investorPacket.ltv')}</TableCell>
                  <TableCell>{t('investorPacket.ltvFormula', { defaultValue: "LTV = (Revenue per Customer × Gross Margin %) × Rentals per Customer / Churn" })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('investorPacket.paybackPeriod')}</TableCell>
                  <TableCell>{t('investorPacket.paybackFormula')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.retention')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.metric')}</TableHead>
                  <TableHead>{t('table.value')}</TableHead>
                  <TableHead>{t('investorPacket.impact')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('inputs.churn')}
                    <InfoTooltip id="churn" />
                  </TableCell>
                  <TableCell>{(settings.churn * 100).toFixed(1)}%</TableCell>
                  <TableCell>{t('investorPacket.churnImpact')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('inputs.rentalsPerCustomer')}
                    <InfoTooltip id="rentals-per-customer" />
                  </TableCell>
                  <TableCell>{settings.rentalsPerCustomer}</TableCell>
                  <TableCell>{t('investorPacket.rentalsImpact')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
