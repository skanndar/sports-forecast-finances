
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, ProjectResult } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/formatters';
import InfoTooltip from "@/components/ui/info-tooltip";

interface MethodologySectionProps {
  settings: Settings;
  results?: ProjectResult;
  className?: string;
  id?: string;
}

const MethodologySection = ({ settings, results, className = "", id }: MethodologySectionProps) => {
  const { t } = useTranslation();

  // Example calculation for better understanding - ensure all values are numbers
  const exampleUnits = 10;
  const exampleMinDays = 15;
  const examplePricePerDay = 50;
  const examplePricePerMonth = 1000;
  const exampleShippingIncome = 10;
  const exampleShippingCost = 5;
  
  // New calculation examples for demand vs capacity
  const exampleMaxRentalsPerUnitDaily = 365 / exampleMinDays;
  const exampleMaxRentalsPerUnitMonthly = 12;
  const examplePotentialCapacityDaily = exampleUnits * exampleMaxRentalsPerUnitDaily;
  const examplePotentialCapacityMonthly = exampleUnits * exampleMaxRentalsPerUnitMonthly;
  
  // Example customer growth calculation
  const exampleNewCustomers = 100;
  const exampleGrowth = 0.15;
  const exampleChurn = 0.2;
  const exampleRentalsPerCustomer = 2;
  
  const exampleCustomersY1 = exampleNewCustomers;
  const exampleCustomersY2 = exampleCustomersY1 * (1 - exampleChurn) + exampleNewCustomers * (1 + exampleGrowth);
  const exampleCustomersY3 = exampleCustomersY2 * (1 - exampleChurn) + exampleNewCustomers * Math.pow((1 + exampleGrowth), 2);

  // Example demand vs capacity calculation
  const exampleDemandY1 = exampleCustomersY1 * exampleRentalsPerCustomer;
  const exampleRealOccupancyY1 = Math.min(1, exampleDemandY1 / examplePotentialCapacityDaily);
  const exampleActualRentalsY1 = exampleRealOccupancyY1 * examplePotentialCapacityDaily;
  
  const exampleDemandY2 = exampleCustomersY2 * exampleRentalsPerCustomer;
  const exampleRealOccupancyY2 = Math.min(1, exampleDemandY2 / examplePotentialCapacityDaily);
  const exampleActualRentalsY2 = exampleRealOccupancyY2 * examplePotentialCapacityDaily;

  return (
    <Card className={`mt-6 ${className}`} id={id}>
      <CardHeader>
        <CardTitle>{t('investorPacket.methodology')}</CardTitle>
        <CardDescription>{t('investorPacket.methodologyDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.customerRetention')}</h3>
            <p className="mb-2">{t('investorPacket.customerRetentionDesc')}</p>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.customerGrowthFormula')}
              {"\n"}
              {t('common.year')} 1: {t('inputs.newCustomers')}
              {"\n"}
              {t('common.year')} 2: {t('inputs.newCustomers')} × (1 + {t('inputs.growth')}) + {t('common.year')} 1 {t('inputs.rentalsPerCustomer')} × (1 - {t('inputs.churn')})
              {"\n"}
              {t('common.year')} 3: {t('inputs.newCustomers')} × (1 + {t('inputs.growth')})² + {t('common.year')} 2 {t('inputs.rentalsPerCustomer')} × (1 - {t('inputs.churn')})
            </pre>
            
            <div className="mt-4 bg-muted/50 p-2 rounded-md">
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc', { defaultValue: "Example calculation" })}</h4>
              <p className="text-sm">
                {t('common.year')} 1: {exampleNewCustomers} {t('inputs.newCustomers')} = {exampleCustomersY1} {t('investorPacket.customersPerYear')}
              </p>
              <p className="text-sm mt-1">
                {t('common.year')} 2: {exampleNewCustomers} × (1 + {(exampleGrowth * 100).toFixed(0)}%) + {exampleCustomersY1} × (1 - {(exampleChurn * 100).toFixed(0)}%) = {Math.round(exampleCustomersY2)} {t('investorPacket.customersPerYear')}
              </p>
              <p className="text-sm mt-1">
                {t('common.year')} 3: {exampleNewCustomers} × (1 + {(exampleGrowth * 100).toFixed(0)}%)² + {Math.round(exampleCustomersY2)} × (1 - {(exampleChurn * 100).toFixed(0)}%) = {Math.round(exampleCustomersY3)} {t('investorPacket.customersPerYear')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.demandVsCapacity')}</h3>
            <p className="mb-2">{t('investorPacket.demandVsCapacityDesc')}</p>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.maxRentalsFormula', { defaultValue: "MaxRentalsPerUnit = Daily ? (365/MinDays) : 12" })}
              {"\n"}
              {t('investorPacket.potentialCapacityFormula', { defaultValue: "PotentialCapacity = Units × MaxRentalsPerUnit" })}
              {"\n"}
              {t('investorPacket.demandFormula', { defaultValue: "DemandRentals = CustomersPerYear × RentalsPerCustomer" })}
              {"\n"}
              {t('investorPacket.realOccupancyFormula', { defaultValue: "RealOccupancy = Min(1, DemandRentals/PotentialCapacity)" })}
              {"\n"}
              {t('investorPacket.actualRentalsFormula', { defaultValue: "ActualRentals = RealOccupancy × PotentialCapacity" })}
            </pre>
            
            <div className="mt-4 bg-muted/50 p-2 rounded-md">
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc')}</h4>
              <p className="text-sm">
                {t('inputs.maxRentalsPerUnit')}: {t('investorPacket.daily')} {exampleMaxRentalsPerUnitDaily.toFixed(1)}, {t('investorPacket.monthly')} {exampleMaxRentalsPerUnitMonthly}
              </p>
              <p className="text-sm mt-1">
                {t('inputs.potentialCapacity')}: {exampleUnits} {t('inputs.units')} × {exampleMaxRentalsPerUnitDaily.toFixed(1)} = {examplePotentialCapacityDaily.toFixed(1)} {t('investorPacket.capacity')}
              </p>
              <p className="text-sm mt-1">
                {t('inputs.demandRentals')} {t('common.year')} 1: {exampleCustomersY1} × {exampleRentalsPerCustomer} = {exampleDemandY1} {t('investorPacket.demand')}
              </p>
              <p className="text-sm mt-1">
                {t('inputs.occupancyReal')}: Min(1, {exampleDemandY1}/{examplePotentialCapacityDaily.toFixed(1)}) = {exampleRealOccupancyY1.toFixed(2)} ({(exampleRealOccupancyY1 * 100).toFixed(0)}%)
              </p>
              <p className="text-sm mt-1">
                {t('inputs.actualRentals')}: {exampleRealOccupancyY1.toFixed(2)} × {examplePotentialCapacityDaily.toFixed(1)} = {exampleActualRentalsY1.toFixed(1)} {t('investorPacket.actualRentals')}
              </p>
              <p className="text-sm mt-2 font-medium">
                {t('common.year')} 2 ({t('investorPacket.growingCustomerBase')}):
              </p>
              <p className="text-sm mt-1">
                {t('inputs.demandRentals')}: {Math.round(exampleCustomersY2)} × {exampleRentalsPerCustomer} = {Math.round(exampleDemandY2)} {t('investorPacket.demand')}
              </p>
              <p className="text-sm mt-1">
                {t('inputs.occupancyReal')}: Min(1, {Math.round(exampleDemandY2)}/{examplePotentialCapacityDaily.toFixed(1)}) = {exampleRealOccupancyY2.toFixed(2)} ({(exampleRealOccupancyY2 * 100).toFixed(0)}%)
              </p>
              <p className="text-sm mt-1">
                {t('inputs.actualRentals')}: {exampleRealOccupancyY2.toFixed(2)} × {examplePotentialCapacityDaily.toFixed(1)} = {exampleActualRentalsY2.toFixed(1)} {t('investorPacket.actualRentals')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.revenueCalculation')}</h3>
            <p className="mb-2">{t('investorPacket.revenueFormula')}</p>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.rentalsPerYearDaily', { defaultValue: "Daily pricing: Rentals/Year = ActualRentals (from above)" })}
              {'\n'}
              {t('investorPacket.revenueDailyFormula', { defaultValue: "Daily pricing: Revenue = ActualRentals × Price per Day × Min Days × GrowthFactor" })}
              {'\n'}
              {t('investorPacket.rentalsPerYearMonthly', { defaultValue: "Monthly pricing: Rentals/Year = ActualRentals (from above)" })}
              {'\n'}
              {t('investorPacket.revenueMonthlyFormula', { defaultValue: "Monthly pricing: Revenue = ActualRentals × Price per Month × GrowthFactor" })}
              {'\n\n'}
              {t('inputs.shippingIncome')}: {t('inputs.shippingIncome')} = {t('investorPacket.actualRentals')} × {t('inputs.shippingIncome')} × GrowthFactor {t('common.byYear')}
            </pre>
            
            <div className="mt-4 bg-muted/50 p-2 rounded-md">
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc', { defaultValue: "Example calculation" })}</h4>
              <p className="text-sm">
                {t('investorPacket.exampleDailyFormula', {
                  defaultValue: "Daily: With {{units}} units, {{actualRentals}} actual rentals, {{daysMin}} min days, {{price}}€/day → Revenue = {{revenue}}€",
                  units: exampleUnits,
                  actualRentals: exampleActualRentalsY1.toFixed(1),
                  daysMin: exampleMinDays,
                  price: examplePricePerDay,
                  revenue: Math.round(exampleActualRentalsY1 * examplePricePerDay * exampleMinDays).toLocaleString()
                })}
              </p>
              <p className="text-sm mt-1">
                {t('investorPacket.exampleMonthlyFormula', {
                  defaultValue: "Monthly: With {{units}} units, {{actualRentals}} actual rentals, {{price}}€/month → Revenue = {{revenue}}€",
                  units: exampleUnits,
                  actualRentals: examplePotentialCapacityMonthly * exampleRealOccupancyY1,
                  price: examplePricePerMonth,
                  revenue: Math.round(examplePotentialCapacityMonthly * exampleRealOccupancyY1 * examplePricePerMonth).toLocaleString()
                })}
              </p>
              <p className="text-sm mt-1">
                {t('inputs.shippingIncome')}: {exampleActualRentalsY1.toFixed(1)} {t('investorPacket.actualRentals')} × {exampleShippingIncome}€ = {Math.round(exampleActualRentalsY1 * exampleShippingIncome)}€
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.costsCalculation')}</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.productCostsFormula', { defaultValue: "ProductCosts = ActualRentals × VariableCost × InflationFactor × GrowthFactor" })}
              {'\n'}
              {t('inputs.shippingCost')}: {t('inputs.shippingCost')} = {t('investorPacket.actualRentals')} × {t('inputs.shippingCost')} × InflationFactor × GrowthFactor {t('common.byYear')}
              {'\n'}
              {t('investorPacket.prescriberCostsFormula')}
              {'\n'}
              {t('investorPacket.directorCostsFormula')}
              {'\n'}
              {t('investorPacket.structuralCostsFormula')}
            </pre>
            
            <div className="mt-4 bg-muted/50 p-2 rounded-md">
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc')}</h4>
              <p className="text-sm">
                {t('table.productCosts')}: {exampleActualRentalsY1.toFixed(1)} {t('investorPacket.actualRentals')} × 10€ = {Math.round(exampleActualRentalsY1 * 10)}€
              </p>
              <p className="text-sm mt-1">
                {t('inputs.shippingCost')}: {exampleActualRentalsY1.toFixed(1)} {t('investorPacket.actualRentals')} × {exampleShippingCost}€ = {Math.round(exampleActualRentalsY1 * exampleShippingCost)}€
              </p>
            </div>
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
          
          {results && results.customersPerYear && (
            <div>
              <h3 className="text-lg font-medium mb-2">{t('investorPacket.customersPerYear')}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.year')}</TableHead>
                    <TableHead>{t('investorPacket.customersPerYear')}</TableHead>
                    <TableHead>{t('inputs.demandRentals')}</TableHead>
                    <TableHead>{t('inputs.actualRentals')}</TableHead>
                    <TableHead>{t('inputs.occupancyReal')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.customersPerYear.map((customers, idx) => {
                    // Calculate total demand and actual rentals for this year
                    let totalDemand = 0;
                    let totalActual = 0;
                    let weightedOccupancy = 0;
                    let totalCapacity = 0;
                    
                    if (results.yearlyResults[idx]) {
                      const yr = results.yearlyResults[idx];
                      
                      // Sum values across all products
                      if (yr.demandRentals) {
                        Object.values(yr.demandRentals).forEach(val => totalDemand += val);
                      }
                      
                      if (yr.actualRentals) {
                        Object.values(yr.actualRentals).forEach(val => totalActual += val);
                      }
                      
                      if (yr.potentialCapacity) {
                        Object.values(yr.potentialCapacity).forEach(val => totalCapacity += val);
                      }
                      
                      // Calculate weighted average occupancy
                      if (totalCapacity > 0) {
                        weightedOccupancy = totalDemand / totalCapacity;
                        if (weightedOccupancy > 1) weightedOccupancy = 1;
                      }
                    }
                    
                    return (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{Math.round(customers).toLocaleString()}</TableCell>
                        <TableCell>{Math.round(totalDemand).toLocaleString()}</TableCell>
                        <TableCell>{Math.round(totalActual).toLocaleString()}</TableCell>
                        <TableCell>{formatPercentage(weightedOccupancy)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
