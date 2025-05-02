
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KpiCard from '@/components/dashboard/KpiCard';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, TooltipProps, Cell } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { YearResult } from '@/lib/types';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9370DB', 
  '#20B2AA', '#FF6347', '#7B68EE', '#00FA9A', '#FF69B4'
];

const getLTVCACStatusColor = (ltvCac: number) => {
  if (ltvCac >= 3) return "green";
  if (ltvCac >= 2) return "amber";
  return "red";
};

const getPaybackStatusColor = (paybackMonths: number) => {
  if (paybackMonths <= 12) return "green";
  if (paybackMonths <= 18) return "amber";
  return "red";
};

const formatTooltipValue = (value: number) => {
  return formatCurrency(value);
};

interface CustomTooltipProps extends TooltipProps<any, any> {
  formatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, formatter = formatCurrency }: CustomTooltipProps) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border shadow-lg rounded-md p-2">
        <p className="text-sm font-medium">{`${t('common.year')} ${payload[0].payload.year}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formatter(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  
  return null;
};

const pieChartLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#fff" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DashboardPage = () => {
  const [chartView, setChartView] = useState<'cashflow' | 'revenue'| 'margins'>('cashflow');
  const { activeScenario } = useAppStore();
  const { settings, results } = activeScenario;
  const { t } = useTranslation();
  
  if (!results || !results.yearlyResults.length) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{t('dashboard.noData')}</CardTitle>
            <CardDescription>{t('dashboard.configureInputs')}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const lastYearResult = results.yearlyResults[results.yearlyResults.length - 1];
  const firstYearResult = results.yearlyResults[0];
  
  // Prepare data for revenue by product chart
  const revenueByProductData: Array<{ name: string; value: number }> = [];
  
  if (lastYearResult.revenueByProduct) {
    Object.entries(lastYearResult.revenueByProduct).forEach(([name, value]) => {
      revenueByProductData.push({ name, value });
    });
  }
  
  // Prepare financial metrics
  const grossProfit = lastYearResult.revenue - lastYearResult.variableCosts;
  const grossMargin = (grossProfit / lastYearResult.revenue) * 100;
  
  const revenueGrowth = 
    results.yearlyResults.length > 1
      ? ((lastYearResult.revenue - results.yearlyResults[results.yearlyResults.length - 2].revenue) / 
         results.yearlyResults[results.yearlyResults.length - 2].revenue) * 100
      : 0;
  
  const ebitdaGrowth = 
    results.yearlyResults.length > 1
      ? ((lastYearResult.ebitda - results.yearlyResults[results.yearlyResults.length - 2].ebitda) / 
         Math.abs(results.yearlyResults[results.yearlyResults.length - 2].ebitda)) * 100
      : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title={t('kpis.revenue')}
          value={lastYearResult.revenue}
          formatter={formatCurrency}
          trend={{
            value: revenueGrowth,
            isPositive: revenueGrowth >= 0
          }}
        />
        
        <KpiCard 
          title={t('kpis.grossMargin')}
          value={grossMargin}
          formatter={formatPercentage}
        />
        
        <KpiCard 
          title={t('kpis.ebitda')}
          value={lastYearResult.ebitda}
          formatter={formatCurrency}
          tooltipId="ebitda"
          trend={{
            value: ebitdaGrowth,
            isPositive: ebitdaGrowth >= 0
          }}
        />
        
        <KpiCard 
          title={t('kpis.irr')}
          value={results.irr}
          formatter={formatPercentage}
          tooltipId="irr"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title={t('kpis.npv')}
          value={results.npv}
          formatter={formatCurrency}
          tooltipId="npv"
        />
        
        <KpiCard 
          title={t('kpis.ltvCacRatio')}
          value={results.unitEconomics.ltv / results.unitEconomics.cac}
          statusColor={getLTVCACStatusColor(results.unitEconomics.ltv / results.unitEconomics.cac)}
          formatter={(val) => Number(val).toFixed(1) + 'x'}
          tooltipId="ltvCac"
        />
        
        <KpiCard 
          title={t('kpis.cacPayback')}
          value={results.unitEconomics.paybackMonths}
          statusColor={getPaybackStatusColor(results.unitEconomics.paybackMonths)}
          formatter={(val) => `${formatNumber(val)} ${t('scenarioLab.months')}`}
          tooltipId="payback"
        />
        
        <KpiCard 
          title={t('kpis.breakeven')}
          value={results.unitEconomics.breakEvenYear !== undefined 
            ? `${t('common.year')} ${results.unitEconomics.breakEvenYear + 1}` 
            : t('scenarioLab.notInForecast')}
          formatter={(val) => String(val)}
          tooltipId="breakeven"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('dashboard.financialProjections')}</CardTitle>
              <Tabs defaultValue="cashflow" value={chartView} onValueChange={(v) => setChartView(v as any)}>
                <TabsList className="grid grid-cols-3 w-[300px]">
                  <TabsTrigger value="cashflow">{t('dashboard.cashFlow')}</TabsTrigger>
                  <TabsTrigger value="revenue">{t('dashboard.revenueVsCosts')}</TabsTrigger>
                  <TabsTrigger value="margins">{t('dashboard.margins')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'cashflow' ? (
                  <LineChart
                    data={results.yearlyResults.map(r => ({ ...r, year: r.year + 1 }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name={t('charts.revenue')}
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ebitda" 
                      name={t('charts.ebitda')} 
                      stroke="#00C49F" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cash" 
                      name={t('charts.cashFlow')} 
                      stroke="#FFBB28" 
                    />
                  </LineChart>
                ) : chartView === 'revenue' ? (
                  <BarChart
                    data={results.yearlyResults.map(r => ({ 
                      ...r, 
                      year: r.year + 1,
                      totalCosts: r.variableCosts + r.structuralCosts
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="revenue" name={t('charts.revenue')} stackId="a" fill="#0088FE" />
                    <Bar dataKey="totalCosts" name={t('charts.totalCosts')} stackId="b" fill="#FF8042" />
                  </BarChart>
                ) : (
                  <LineChart
                    data={results.yearlyResults.map(r => ({ 
                      ...r, 
                      year: r.year + 1,
                      grossMargin: ((r.revenue - r.variableCosts) / r.revenue) * 100,
                      ebitdaMargin: (r.ebitda / r.revenue) * 100
                    }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip formatter={(val) => `${val.toFixed(1)}%`} />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="grossMargin"
                      name={t('charts.grossMarginPct')}
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ebitdaMargin" 
                      name={t('charts.ebitdaMarginPct')} 
                      stroke="#00C49F" 
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.revenueByProduct')}</CardTitle>
            <CardDescription>{t('dashboard.finalYearRevenue')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByProductData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={pieChartLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByProductData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.yearlyResults')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('table.year')}</th>
                  <th className="text-right p-2">{t('table.revenue')}</th>
                  <th className="text-right p-2">{t('table.variableCosts')}</th>
                  <th className="text-right p-2">{t('table.grossMargin')}</th>
                  <th className="text-right p-2">{t('table.structuralCosts')}</th>
                  <th className="text-right p-2">{t('table.ebitda')}</th>
                  <th className="text-right p-2">{t('table.cashFlow')}</th>
                </tr>
              </thead>
              <tbody>
                {results.yearlyResults.map((yearResult, index) => {
                  const grossProfit = yearResult.revenue - yearResult.variableCosts;
                  const grossMarginPct = (grossProfit / yearResult.revenue) * 100;
                  
                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2">{t('common.year')} {yearResult.year + 1}</td>
                      <td className="text-right p-2">{formatCurrency(yearResult.revenue)}</td>
                      <td className="text-right p-2">{formatCurrency(yearResult.variableCosts)}</td>
                      <td className="text-right p-2">{formatPercentage(grossMarginPct / 100)}</td>
                      <td className="text-right p-2">{formatCurrency(yearResult.structuralCosts)}</td>
                      <td className="text-right p-2">{formatCurrency(yearResult.ebitda)}</td>
                      <td className="text-right p-2">{formatCurrency(yearResult.cash)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
