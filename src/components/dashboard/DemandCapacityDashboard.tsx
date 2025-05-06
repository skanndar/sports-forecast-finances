
import React from 'react';
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
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectResult, Settings } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/formatters';
import KpiCard from './KpiCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DemandCapacityDashboardProps {
  results: ProjectResult;
  settings: Settings;
}

const DemandCapacityDashboard = ({ results, settings }: DemandCapacityDashboardProps) => {
  const { t } = useTranslation();

  // Prepare data for the line chart
  const chartData = results.yearlyResults.map((yr, index) => {
    let totalDemand = 0;
    let totalCapacity = 0;
    let totalActual = 0;

    if (yr.demandRentals) {
      Object.values(yr.demandRentals).forEach(val => totalDemand += val);
    }
    
    if (yr.potentialCapacity) {
      Object.values(yr.potentialCapacity).forEach(val => totalCapacity += val);
    }

    if (yr.actualRentals) {
      Object.values(yr.actualRentals).forEach(val => totalActual += val);
    }
    
    return {
      year: `${t('common.year')} ${index + 1}`,
      demand: Math.round(totalDemand),
      capacity: Math.round(totalCapacity),
      actual: Math.round(totalActual)
    };
  });

  // Calculate overall metrics for KPI cards
  const latestYear = results.yearlyResults[results.yearlyResults.length - 1];
  let totalDemand = 0;
  let totalCapacity = 0;
  let totalActual = 0;
  let avgOccupancy = 0;

  if (latestYear) {
    if (latestYear.demandRentals) {
      Object.values(latestYear.demandRentals).forEach(val => totalDemand += val);
    }
    
    if (latestYear.potentialCapacity) {
      Object.values(latestYear.potentialCapacity).forEach(val => totalCapacity += val);
    }

    if (latestYear.actualRentals) {
      Object.values(latestYear.actualRentals).forEach(val => totalActual += val);
    }
    
    avgOccupancy = totalCapacity > 0 ? totalActual / totalCapacity : 0;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t('inputs.demandRentals')}
          value={formatNumber(totalDemand)}
          description={t('investorPacket.demand')}
        />
        <KpiCard
          title={t('inputs.potentialCapacity')}
          value={formatNumber(totalCapacity)}
          description={t('investorPacket.capacity')}
        />
        <KpiCard
          title={t('inputs.actualRentals')}
          value={formatNumber(totalActual)}
          description={t('investorPacket.actualRentals')}
        />
        <KpiCard
          title={t('inputs.occupancyReal')}
          value={formatPercentage(avgOccupancy)}
          description={t('dashboard.occupancyRates')}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.demandCapacity')}</CardTitle>
          <CardDescription>{t('dashboard.demandCapacitySummary')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="demand" name={t('inputs.demandRentals')} stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="capacity" name={t('inputs.potentialCapacity')} stroke="#82ca9d" />
                <Line type="monotone" dataKey="actual" name={t('inputs.actualRentals')} stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('investorPacket.demandVsCapacity')}</CardTitle>
          <CardDescription>{t('investorPacket.demandVsCapacityDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('inputs.productName')}</TableHead>
                <TableHead>{t('inputs.maxRentalsPerUnit')}</TableHead>
                <TableHead>{t('inputs.potentialCapacity')}</TableHead>
                <TableHead>{t('inputs.demandRentals')}</TableHead>
                <TableHead>{t('inputs.occupancyReal')}</TableHead>
                <TableHead>{t('inputs.actualRentals')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.products.map((product, idx) => {
                const latestYear = results.yearlyResults[results.yearlyResults.length - 1];
                const demandRental = latestYear?.demandRentals?.[product.name] || 0;
                const potentialCapacity = latestYear?.potentialCapacity?.[product.name] || 0;
                const maxRentalsPerUnit = latestYear?.maxRentalsPerUnit?.[product.name] || 0;
                const realOccupancy = latestYear?.realOccupancy?.[product.name] || 0;
                const actualRental = latestYear?.actualRentals?.[product.name] || 0;
                
                return (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatNumber(maxRentalsPerUnit)}</TableCell>
                    <TableCell>{formatNumber(potentialCapacity)}</TableCell>
                    <TableCell>{formatNumber(demandRental)}</TableCell>
                    <TableCell>{formatPercentage(realOccupancy)}</TableCell>
                    <TableCell>{formatNumber(actualRental)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandCapacityDashboard;
