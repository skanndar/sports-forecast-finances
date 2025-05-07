
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
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc')}</h4>
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
              {t('investorPacket.maxRentalsFormula')}
              {"\n"}
              {t('investorPacket.potentialCapacityFormula')}
              {"\n"}
              {t('investorPacket.demandFormula')}
              {"\n"}
              {t('investorPacket.realOccupancyFormula')}
              {"\n"}
              {t('investorPacket.actualRentalsFormula')}
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
              {t('investorPacket.rentalsPerYearDaily')}
              {'\n'}
              {t('investorPacket.revenueDailyFormula')}
              {'\n'}
              {t('investorPacket.rentalsPerYearMonthly')}
              {'\n'}
              {t('investorPacket.revenueMonthlyFormula')}
              {'\n\n'}
              {t('inputs.shippingIncome')}: {t('inputs.shippingIncome')} = {t('investorPacket.actualRentals')} × {t('inputs.shippingIncome')} × GrowthFactor {t('common.byYear')}
            </pre>
            
            <div className="mt-4 bg-muted/50 p-2 rounded-md">
              <h4 className="font-medium mb-1">{t('investorPacket.exampleCalc')}</h4>
              <p className="text-sm">
                {t('investorPacket.exampleDailyFormula')}
              </p>
              <p className="text-sm mt-1">
                {t('investorPacket.exampleMonthlyFormula')}
              </p>
              <p className="text-sm mt-1">
                {t('inputs.shippingIncome')}: {Math.round(exampleActualRentalsY1).toFixed(1)} {t('investorPacket.actualRentals')} × {exampleShippingIncome}€ = {Math.round(exampleActualRentalsY1 * exampleShippingIncome)}€
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.costsCalculation')}</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.productCostsFormula')}
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
                {t('table.productCosts')}: {Math.round(exampleActualRentalsY1).toFixed(1)} {t('investorPacket.actualRentals')} × 10€ = {Math.round(exampleActualRentalsY1 * 10)}€
              </p>
              <p className="text-sm mt-1">
                {t('inputs.shippingCost')}: {Math.round(exampleActualRentalsY1).toFixed(1)} {t('investorPacket.actualRentals')} × {exampleShippingCost}€ = {Math.round(exampleActualRentalsY1 * exampleShippingCost)}€
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
                  <TableHead>{t('investorPacket.interpretation')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.irr')}
                    <InfoTooltip id="irr" />
                  </TableCell>
                  <TableCell>{t('investorPacket.irrFormula')}</TableCell>
                  <TableCell>{t('metrics.irrDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.npv')}
                    <InfoTooltip id="npv" />
                  </TableCell>
                  <TableCell>{t('investorPacket.npvFormula')}</TableCell>
                  <TableCell>{t('metrics.npvDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('investorPacket.cac')}
                    <InfoTooltip id="cac" />
                  </TableCell>
                  <TableCell>{t('investorPacket.cacFormula')}</TableCell>
                  <TableCell>{t('metrics.cacDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('investorPacket.ltv')}
                    <InfoTooltip id="ltv" />
                  </TableCell>
                  <TableCell>{t('investorPacket.ltvFormula')}</TableCell>
                  <TableCell>{t('metrics.ltvDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('investorPacket.paybackPeriod')}
                    <InfoTooltip id="payback" />
                  </TableCell>
                  <TableCell>{t('investorPacket.paybackFormula')}</TableCell>
                  <TableCell>{t('metrics.paybackDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.ltvCacRatio')}
                    <InfoTooltip id="ltvCac" />
                  </TableCell>
                  <TableCell>LTV / CAC</TableCell>
                  <TableCell>{t('metrics.ltvCacDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('kpis.ebitda')}
                    <InfoTooltip id="ebitda" />
                  </TableCell>
                  <TableCell>{t('investorPacket.ebitdaFormula')}</TableCell>
                  <TableCell>{t('metrics.ebitdaDesc')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('table.ebitdaMargin')}
                    <InfoTooltip id="ebitda-margin" />
                  </TableCell>
                  <TableCell>{t('investorPacket.ebitdaMarginFormula')}</TableCell>
                  <TableCell>{t('metrics.ebitdaMarginDesc')}</TableCell>
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
