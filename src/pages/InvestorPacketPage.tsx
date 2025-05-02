
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { Download } from "lucide-react";

const InvestorPacketPage = () => {
  const { activeScenario } = useAppStore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // This is a placeholder - in a real implementation you would use jsPDF or similar
      toast({
        title: 'PDF Generation',
        description: 'This feature would generate a PDF for investors in the real implementation.',
      });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: 'Generation failed',
        description: 'Failed to generate the PDF.',
        variant: 'destructive'
      });
    }
  };
  
  const handleDownloadCSV = () => {
    try {
      if (!activeScenario.results || !activeScenario.results.yearlyResults.length) {
        toast({
          title: 'No data available',
          description: 'Please ensure your scenario has financial results.',
          variant: 'destructive'
        });
        return;
      }
      
      // Generate CSV content
      const headers = ['Year', 'Revenue', 'VariableCosts', 'StructuralCosts', 'EBITDA', 'Cash'];
      
      const csvContent = [
        headers.join(','),
        ...activeScenario.results.yearlyResults.map(yr => [
          `Year ${yr.year + 1}`,
          yr.revenue,
          yr.variableCosts,
          yr.structuralCosts,
          yr.ebitda,
          yr.cash
        ].join(','))
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeScenario.name || 'financial-forecast'}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'CSV downloaded',
        description: 'The financial data has been downloaded successfully.'
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download the CSV file.',
        variant: 'destructive'
      });
    }
  };
  
  if (!activeScenario.results) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>Please configure your financial inputs first.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const { results, settings } = activeScenario;
  const lastYearResult = results.yearlyResults[results.yearlyResults.length - 1];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Investor Packet</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {isGenerating ? 'Generating...' : 'Generate PDF'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2"
        >
          <Download size={16} /> Download CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
            <CardDescription>Financial highlights and key metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Financial Highlights</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Revenue:</strong> {formatCurrency(lastYearResult.revenue)} by year {settings.forecastYears}
                </li>
                <li>
                  <strong>EBITDA:</strong> {formatCurrency(lastYearResult.ebitda)} ({formatPercentage(lastYearResult.ebitda / lastYearResult.revenue)})
                </li>
                <li>
                  <strong>IRR:</strong> {formatPercentage(results.irr)}
                </li>
                <li>
                  <strong>NPV:</strong> {formatCurrency(results.npv)}
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Unit Economics</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Customer Acquisition Cost (CAC):</strong> {formatCurrency(results.unitEconomics.cac)}
                </li>
                <li>
                  <strong>Customer Lifetime Value (LTV):</strong> {formatCurrency(results.unitEconomics.ltv)}
                </li>
                <li>
                  <strong>LTV/CAC Ratio:</strong> {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
                </li>
                <li>
                  <strong>Payback Period:</strong> {formatNumber(results.unitEconomics.paybackMonths)} months
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Key Assumptions</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Growth Rate:</strong> {formatPercentage(settings.growth)}
                </li>
                <li>
                  <strong>Products:</strong> {settings.products.length} different product offerings
                </li>
                <li>
                  <strong>New Customers (Yearly):</strong> {formatNumber(settings.newCustomers)}
                </li>
                <li>
                  <strong>Churn Rate:</strong> {formatPercentage(settings.churn)}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Financial and operational KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Revenue (Year {settings.forecastYears})</p>
                  <p className="text-2xl font-bold">{formatCurrency(lastYearResult.revenue)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">EBITDA Margin</p>
                  <p className="text-2xl font-bold">{formatPercentage(lastYearResult.ebitda / lastYearResult.revenue)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">IRR</p>
                  <p className="text-2xl font-bold">{formatPercentage(results.irr)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">NPV</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.npv)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">LTV/CAC</p>
                  <p className="text-2xl font-bold">
                    {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Payback</p>
                  <p className="text-2xl font-bold">{formatNumber(results.unitEconomics.paybackMonths)} months</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Projections</CardTitle>
          <CardDescription>{settings.forecastYears}-year forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Metric</th>
                  {results.yearlyResults.map((_, index) => (
                    <th key={index} className="text-right p-2">Year {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Revenue</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.revenue)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Variable Costs</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.variableCosts)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Gross Margin</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">
                      {formatPercentage((yr.revenue - yr.variableCosts) / yr.revenue)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Structural Costs</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.structuralCosts)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">EBITDA</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.ebitda)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">EBITDA Margin</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatPercentage(yr.ebitda / yr.revenue)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Cash Flow</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.cash)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Cumulative Cash Flow</td>
                  {results.yearlyResults.map((_, index) => (
                    <td key={index} className="text-right p-2">
                      {formatCurrency(
                        results.yearlyResults
                          .slice(0, index + 1)
                          .reduce((sum, yr) => sum + yr.cash, 0)
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorPacketPage;
