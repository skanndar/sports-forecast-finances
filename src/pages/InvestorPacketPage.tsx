
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
import { useTranslation } from 'react-i18next';
import DetailedFinancialTable from '@/components/investor/DetailedFinancialTable';
import TornadoChart from '@/components/investor/TornadoChart';
import MethodologySection from '@/components/investor/MethodologySection';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { runMonteCarloSimulation, runTornadoAnalysis } from '@/lib/finance';

const InvestorPacketPage = () => {
  const { activeScenario } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [monteCarloResult, setMonteCarloResult] = useState(null);
  const [tornadoData, setTornadoData] = useState(null);
  
  // Calculate Monte Carlo and Tornado analysis results
  const runAnalysis = () => {
    if (!activeScenario.settings) return;
    
    try {
      const mcResult = runMonteCarloSimulation(activeScenario.settings);
      setMonteCarloResult(mcResult);
      
      const tdResult = runTornadoAnalysis(activeScenario.settings);
      setTornadoData(tdResult);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: t('common.error'),
        description: t('sensitivity.analysisFailed', { defaultValue: "Failed to run sensitivity analysis" }),
        variant: 'destructive'
      });
    }
  };
  
  // Run analysis on component mount if needed
  React.useEffect(() => {
    if (activeScenario.settings && !monteCarloResult && !tornadoData) {
      runAnalysis();
    }
  }, [activeScenario.settings]);
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Create a new PDF document with landscape orientation for better table viewing
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Helper function to capture and add HTML content to the PDF
      const addHtmlToPDF = async (elementId: string, title?: string, options = {}) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Add a page break except for the first element
        if (doc.getNumberOfPages() > 0) {
          doc.addPage();
        }
        
        // Add title if provided
        if (title) {
          doc.setFontSize(16);
          doc.text(title, 14, 15);
          doc.setFontSize(12);
        }
        
        const canvas = await html2canvas(element, {
          scale: 2,
          logging: false,
          useCORS: true,
          ...options
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 280; // slightly reduced to fit margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 10, title ? 25 : 10, imgWidth, imgHeight);
      };
      
      // Capture summary section
      await addHtmlToPDF('summary-section', t('investorPacket.executiveSummary'));
      
      // Capture financial projections table
      await addHtmlToPDF('detail-table', t('investorPacket.financial_detail'));
      
      // Capture tornado chart 
      await addHtmlToPDF('tornado-chart', t('sensitivity.title'));
      
      // Capture Monte Carlo section if it exists
      const monteCarloSection = document.getElementById('monte-carlo-section');
      if (monteCarloSection) {
        await addHtmlToPDF('monte-carlo-section', t('investorPacket.monteCarloSimulation', { defaultValue: "Monte Carlo Simulation" }));
      }
      
      // Capture risk analysis section if it exists
      const riskAnalysisSection = document.getElementById('risk-analysis-section');
      if (riskAnalysisSection) {
        await addHtmlToPDF('risk-analysis-section', t('investorPacket.riskAnalysisSummary', { defaultValue: "Risk Analysis Summary" }));
      }
      
      // Capture methodology section
      await addHtmlToPDF('methodology-section', t('investorPacket.methodology'));

      // Save the PDF - using await to ensure it completes
      await doc.save(`${activeScenario.name || 'investor-packet'}.pdf`);
      
      toast({
        title: t('investorPacket.pdfGenerated'),
        description: t('investorPacket.downloadReady'),
      });
      
      setIsGenerating(false);
    } catch (error) {
      console.error('PDF generation error:', error);
      setIsGenerating(false);
      toast({
        title: t('common.error'),
        description: t('investorPacket.generationFailed'),
        variant: 'destructive'
      });
    }
  };
  
  const handleDownloadCSV = () => {
    try {
      if (!activeScenario.results || !activeScenario.results.yearlyResults.length) {
        toast({
          title: t('dashboard.noData'),
          description: t('dashboard.configureInputs'),
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
        title: t('investorPacket.csvReady'),
        description: t('investorPacket.downloadReady')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('investorPacket.downloadFailed'),
        variant: 'destructive'
      });
    }
  };
  
  if (!activeScenario.results) {
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

  const { results, settings } = activeScenario;
  const lastYearResult = results.yearlyResults[results.yearlyResults.length - 1];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('investorPacket.title')}</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <Button 
          onClick={handleGeneratePDF} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {isGenerating ? t('investorPacket.generatingPdf') : t('investorPacket.downloadInvestorPacket')}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2"
        >
          <Download size={16} /> {t('investorPacket.downloadCsv')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" id="summary-section">
        <Card>
          <CardHeader>
            <CardTitle>{t('investorPacket.executiveSummary')}</CardTitle>
            <CardDescription>{t('investorPacket.financialHighlights')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t('investorPacket.financialHighlights')}</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>{t('table.revenue')}:</strong> {formatCurrency(lastYearResult.revenue)} {t('common.byYear')} {settings.forecastYears}
                </li>
                <li>
                  <strong>{t('table.ebitda')}:</strong> {formatCurrency(lastYearResult.ebitda)} ({formatPercentage(lastYearResult.ebitda / lastYearResult.revenue)})
                </li>
                <li>
                  <strong>{t('kpis.irr')}:</strong> {formatPercentage(results.irr)}
                </li>
                <li>
                  <strong>{t('kpis.npv')}:</strong> {formatCurrency(results.npv)}
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t('investorPacket.unitEconomics')}</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>{t('investorPacket.cac')}:</strong> {formatCurrency(results.unitEconomics.cac)}
                </li>
                <li>
                  <strong>{t('investorPacket.ltv')}:</strong> {formatCurrency(results.unitEconomics.ltv)}
                </li>
                <li>
                  <strong>{t('investorPacket.ltvCacRatio')}:</strong> {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
                </li>
                <li>
                  <strong>{t('investorPacket.paybackPeriod')}:</strong> {formatNumber(results.unitEconomics.paybackMonths)} {t('common.months')}
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t('investorPacket.keyAssumptions')}</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>{t('inputs.growth')}:</strong> {formatPercentage(settings.growth)}
                </li>
                <li>
                  <strong>{t('inputs.products')}:</strong> {settings.products.length} {t('investorPacket.differentProductOfferings')}
                </li>
                <li>
                  <strong>{t('inputs.newCustomers')} ({t('common.yearly')}):</strong> {formatNumber(settings.newCustomers)}
                </li>
                <li>
                  <strong>{t('inputs.churn')}:</strong> {formatPercentage(settings.churn)}
                </li>
                <li>
                  <strong>{t('inputs.initialInvestment')}:</strong> {formatCurrency(settings.initialInvestment)}
                </li>
                <li>
                  <strong>{t('inputs.directorCommission')}:</strong> {formatPercentage(settings.directorCommission)}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('investorPacket.keyPerformanceIndicators')}</CardTitle>
            <CardDescription>{t('investorPacket.financialOperationalKpis')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('table.revenue')} ({t('common.year')} {settings.forecastYears})</p>
                  <p className="text-2xl font-bold">{formatCurrency(lastYearResult.revenue)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('table.ebitdaMargin')}</p>
                  <p className="text-2xl font-bold">{formatPercentage(lastYearResult.ebitda / lastYearResult.revenue)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('kpis.irr')}</p>
                  <p className="text-2xl font-bold">{formatPercentage(results.irr)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('kpis.npv')}</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.npv)}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('kpis.ltvCacRatio')}</p>
                  <p className="text-2xl font-bold">
                    {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('kpis.cacPayback')}</p>
                  <p className="text-2xl font-bold">{formatNumber(results.unitEconomics.paybackMonths)} {t('common.months')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('investorPacket.financialProjections')}</CardTitle>
          <CardDescription>{settings.forecastYears}-{t('common.yearForecast')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('table.metric')}</th>
                  {results.yearlyResults.map((_, index) => (
                    <th key={index} className="text-right p-2">{t('common.year')} {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">{t('table.revenue')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.revenue)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.variableCosts')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.variableCosts)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.grossMargin')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">
                      {formatPercentage((yr.revenue - yr.variableCosts) / yr.revenue)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.structuralCosts')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.structuralCosts)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.ebitda')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.ebitda)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.ebitdaMargin')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatPercentage(yr.ebitda / yr.revenue)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.cashFlow')}</td>
                  {results.yearlyResults.map((yr, index) => (
                    <td key={index} className="text-right p-2">{formatCurrency(yr.cash)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t('table.cumulativeCashFlow')}</td>
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
      
      {/* Detailed Financial Table */}
      <DetailedFinancialTable 
        yearlyResults={results.yearlyResults} 
        initialInvestment={settings.initialInvestment}
        churn={settings.churn}
        rentalsPerCustomer={settings.rentalsPerCustomer}
        id="detail-table"
      />
      
      {/* Sensitivity Analysis */}
      <TornadoChart id="tornado-chart" />
      
      {/* Monte Carlo Simulation */}
      {monteCarloResult && (
        <Card className="mt-6" id="monte-carlo-section">
          <CardHeader>
            <CardTitle>{t('investorPacket.monteCarloSimulation', { defaultValue: "Monte Carlo Simulation" })}</CardTitle>
            <CardDescription>
              {t('investorPacket.monteCarloDesc', { defaultValue: "1,000 runs with random variations in key parameters" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t('investorPacket.confidenceInterval', { defaultValue: "90% Confidence Interval" })}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('investorPacket.monteCarloExplanation', { 
                    defaultValue: "Based on 1,000 simulation runs with ±20% random variations in key parameters, the 90% confidence interval for the final year EBITDA is:" 
                  })}
                </p>
                
                <div className="relative pt-8 pb-4">
                  <div className="absolute w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-full bg-brand-500 rounded-full"
                      style={{ 
                        left: `${0}%`, 
                        width: `${100}%` 
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('investorPacket.p5', { defaultValue: "P5 (Pessimistic)" })}
                      </div>
                      <div className="font-bold">{formatCurrency(monteCarloResult.p5)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('investorPacket.p50', { defaultValue: "P50 (Base)" })}
                      </div>
                      <div className="font-bold">{formatCurrency(monteCarloResult.p50)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('investorPacket.p95', { defaultValue: "P95 (Optimistic)" })}
                      </div>
                      <div className="font-bold">{formatCurrency(monteCarloResult.p95)}</div>
                    </div>
                  </div>
                </div>
                
                <Table className="mt-6">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('table.metric')}</TableHead>
                      <TableHead className="text-right">{t('table.value')}</TableHead>
                      <TableHead>{t('investorPacket.interpretation', { defaultValue: "Interpretation" })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('investorPacket.p5', { defaultValue: "P5" })}</TableCell>
                      <TableCell className="text-right">{formatCurrency(monteCarloResult.p5)}</TableCell>
                      <TableCell>{t('investorPacket.p5Desc', { defaultValue: "Worst case scenario (5%)" })}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('investorPacket.p50', { defaultValue: "P50" })}</TableCell>
                      <TableCell className="text-right">{formatCurrency(monteCarloResult.p50)}</TableCell>
                      <TableCell>{t('investorPacket.p50Desc', { defaultValue: "Median case (50%)" })}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('investorPacket.p95', { defaultValue: "P95" })}</TableCell>
                      <TableCell className="text-right">{formatCurrency(monteCarloResult.p95)}</TableCell>
                      <TableCell>{t('investorPacket.p95Desc', { defaultValue: "Best case scenario (95%)" })}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Risk Analysis Summary */}
      {tornadoData && (
        <Card className="mt-6" id="risk-analysis-section">
          <CardHeader>
            <CardTitle>
              {t('investorPacket.riskAnalysisSummary', { defaultValue: "Risk Analysis Summary" })}
            </CardTitle>
            <CardDescription>
              {t('investorPacket.riskAnalysisDesc', { defaultValue: "Key findings from sensitivity analysis" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t('investorPacket.sensititiveVariables', { defaultValue: "Most Sensitive Parameters" })}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('investorPacket.sensititiveVariablesDesc', { defaultValue: "These parameters have the highest impact on your financial results" })}
                </p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('table.variable', { defaultValue: "Variable" })}</TableHead>
                      <TableHead className="text-right">{t('investorPacket.impactOnEbitda', { defaultValue: "Impact on EBITDA (%)" })}</TableHead>
                      <TableHead>{t('investorPacket.mitigationPriority', { defaultValue: "Mitigation Priority" })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tornadoData.slice(0, 5).map((item, index) => {
                      const impact = Math.max(Math.abs(item.positiveImpact), Math.abs(item.negativeImpact)) * 100;
                      let priority = "Low";
                      if (impact > 15) priority = "High";
                      else if (impact > 7) priority = "Medium";
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.variable}</TableCell>
                          <TableCell className="text-right">±{impact.toFixed(1)}%</TableCell>
                          <TableCell>
                            {t(`investorPacket.priority${priority}`, { defaultValue: priority })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t('investorPacket.recommendations', { defaultValue: "Recommendations" })}
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    {t('investorPacket.recommendation1', { 
                      defaultValue: "Focus on optimizing the top sensitive parameters to improve financial outcomes" 
                    })}
                  </li>
                  <li>
                    {t('investorPacket.recommendation2', { 
                      defaultValue: "Consider scenario planning for both pessimistic and optimistic cases" 
                    })}
                  </li>
                  <li>
                    {t('investorPacket.recommendation3', { 
                      defaultValue: "Revisit assumptions regularly to refine the forecast accuracy" 
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Methodology Section */}
      <MethodologySection 
        settings={settings} 
        id="methodology-section" 
      />
    </div>
  );
};

export default InvestorPacketPage;
