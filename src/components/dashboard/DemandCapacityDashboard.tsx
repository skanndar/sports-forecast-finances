
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, ComposedChart } from 'recharts';
import { ProjectResult, Settings } from '@/lib/types';
import { formatNumber, formatPercentage } from '@/lib/formatters';
import KpiCard from './KpiCard';

interface DemandCapacityDashboardProps {
  results: ProjectResult;
  settings: Settings;
}

const DemandCapacityDashboard = ({ results, settings }: DemandCapacityDashboardProps) => {
  // Updated to use multiple namespaces
  const { t } = useTranslation(['dashboard', 'inputs', 'investorPacket', 'common']);

  // Prepare data for the line chart
  const chartData = results.yearlyResults.map((yr, index) => {
    let totalDemand = 0;
    let totalCapacity = 0;
    let totalActual = 0;
    let totalLostDemand = 0;

    if (yr.demandRentals) {
      Object.values(yr.demandRentals).forEach(val => totalDemand += val);
    }
    
    if (yr.potentialCapacity) {
      Object.values(yr.potentialCapacity).forEach(val => totalCapacity += val);
    }

    if (yr.actualRentals) {
      Object.values(yr.actualRentals).forEach(val => totalActual += val);
    }
    
    if (yr.lostDemand) {
      Object.values(yr.lostDemand).forEach(val => totalLostDemand += val);
    }
    
    return {
      year: `${t('year', { ns: 'common' })} ${index + 1}`,
      demand: Math.round(totalDemand),
      capacity: Math.round(totalCapacity),
      actual: Math.round(totalActual),
      lost: Math.round(totalLostDemand)
    };
  });

  // Calculate overall metrics for KPI cards
  const latestYear = results.yearlyResults[results.yearlyResults.length - 1];
  let totalDemand = 0;
  let totalCapacity = 0;
  let totalActual = 0;
  let totalLostDemand = 0;
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
    
    if (latestYear.lostDemand) {
      Object.values(latestYear.lostDemand).forEach(val => totalLostDemand += val);
    }
    
    avgOccupancy = totalCapacity > 0 ? totalActual / totalCapacity : 0;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t('demandRentals', { ns: 'inputs' })}
          value={formatNumber(totalDemand)}
          description={t('demand', { ns: 'investorPacket' })}
        />
        <KpiCard
          title={t('potentialCapacity', { ns: 'inputs' })}
          value={formatNumber(totalCapacity)}
          description={t('capacity', { ns: 'investorPacket' })}
        />
        <KpiCard
          title={t('actualRentals', { ns: 'inputs' })}
          value={formatNumber(totalActual)}
          description={t('actualRentals', { ns: 'investorPacket' })}
        />
        <KpiCard
          title={t('lostDemand', { ns: 'dashboard' })}
          value={formatNumber(totalLostDemand)}
          description={t('lostDemandDesc', { ns: 'dashboard' })}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('demandCapacity', { ns: 'dashboard' })}</CardTitle>
          <CardDescription>{t('demandCapacitySummary', { ns: 'dashboard' })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="demand" name={t('demandRentals', { ns: 'inputs' })} stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="capacity" name={t('potentialCapacity', { ns: 'inputs' })} stroke="#82ca9d" />
                <Line type="monotone" dataKey="actual" name={t('actualRentals', { ns: 'inputs' })} stroke="#ff7300" />
                <Bar dataKey="lost" name={t('lostDemand', { ns: 'dashboard' })} fill="#d95555" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('demandVsCapacity', { ns: 'investorPacket' })}</CardTitle>
          <CardDescription>{t('demandVsCapacityDesc', { ns: 'investorPacket' })}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('productName', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('maxRentalsPerUnit', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('potentialCapacity', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('demandRentals', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('occupancyCap', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('occupancyReal', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('actualRentals', { ns: 'inputs' })}</TableHead>
                <TableHead>{t('lostDemand', { ns: 'dashboard' })}</TableHead>
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
                const lostDemand = latestYear?.lostDemand?.[product.name] || 0;
                
                return (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatNumber(maxRentalsPerUnit)}</TableCell>
                    <TableCell>{formatNumber(potentialCapacity)}</TableCell>
                    <TableCell>{formatNumber(demandRental)}</TableCell>
                    <TableCell>{formatPercentage(product.occupancyCap)}</TableCell>
                    <TableCell>{formatPercentage(realOccupancy)}</TableCell>
                    <TableCell>{formatNumber(actualRental)}</TableCell>
                    <TableCell>{formatNumber(lostDemand)}</TableCell>
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
