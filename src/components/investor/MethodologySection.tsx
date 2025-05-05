
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
                  <TableHead>{t('investorPacket.interpretation', { defaultValue: "Interpretación" })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.irr')}
                    <InfoTooltip id="irr" />
                  </TableCell>
                  <TableCell>{t('investorPacket.irrFormula')}</TableCell>
                  <TableCell>{t('metrics.irrDesc', { defaultValue: "Compara con WACC para decidir si crea valor." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.npv')}
                    <InfoTooltip id="npv" />
                  </TableCell>
                  <TableCell>{t('investorPacket.npvFormula')}</TableCell>
                  <TableCell>{t('metrics.npvDesc', { defaultValue: "Valor presente neto de los flujos de caja futuros." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('investorPacket.cac')}
                    <InfoTooltip id="cac" />
                  </TableCell>
                  <TableCell>{t('investorPacket.cacFormula', { defaultValue: "CAC = (Marketing Spend + Prescriber Commissions for New Customers) / New Customers" })}</TableCell>
                  <TableCell>{t('metrics.cacDesc', { defaultValue: "Coste promedio para adquirir un nuevo cliente." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('investorPacket.ltv')}
                    <InfoTooltip id="ltv" />
                  </TableCell>
                  <TableCell>{t('investorPacket.ltvFormula', { defaultValue: "LTV = (Revenue per Customer × Gross Margin %) × Rentals per Customer / Churn" })}</TableCell>
                  <TableCell>{t('metrics.ltvDesc', { defaultValue: "Valor económico total que un cliente aporta durante su ciclo de vida." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('investorPacket.paybackPeriod')}
                    <InfoTooltip id="payback" />
                  </TableCell>
                  <TableCell>{t('investorPacket.paybackFormula')}</TableCell>
                  <TableCell>{t('metrics.paybackDesc', { defaultValue: "Tiempo necesario para recuperar el coste de adquisición." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.ltvCacRatio')}
                    <InfoTooltip id="ltvCac" />
                  </TableCell>
                  <TableCell>LTV / CAC</TableCell>
                  <TableCell>{t('metrics.ltvCacDesc', { defaultValue: "Ratio > 3 indica un buen modelo de negocio." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.ebitda')}
                    <InfoTooltip id="ebitda" />
                  </TableCell>
                  <TableCell>{t('investorPacket.ebitdaFormula', { defaultValue: "EBITDA = Revenue - Total Variable Costs - Structural Costs" })}</TableCell>
                  <TableCell>{t('metrics.ebitdaDesc', { defaultValue: "Beneficio antes de intereses, impuestos, depreciaciones y amortizaciones." })}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('table.ebitdaMargin')}
                    <InfoTooltip id="ebitda-margin" />
                  </TableCell>
                  <TableCell>{t('investorPacket.ebitdaMarginFormula', { defaultValue: "EBITDA Margin = EBITDA / Revenue" })}</TableCell>
                  <TableCell>{t('metrics.ebitdaMarginDesc', { defaultValue: "Rentabilidad operativa del negocio como porcentaje de los ingresos." })}</TableCell>
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
