
import React, { useState, useEffect } from 'react';
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
import { runMonteCarloSimulation, runTornadoAnalysis } from '@/lib/finance';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import InfoTooltip from "@/components/ui/info-tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const InvestorPacketPage = () => {
  const { activeScenario } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [monteCarloResult, setMonteCarloResult] = useState(null);
  const [tornadoData, setTornadoData] = useState(null);
  const { generatePdf } = usePdfGenerator();
  
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
  useEffect(() => {
    if (activeScenario.settings && !monteCarloResult && !tornadoData) {
      runAnalysis();
    }
  }, [activeScenario.settings]);
  
  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Use our new PDF generator
      await generatePdf('investor-packet-content', `${activeScenario.name || 'investor-packet'}.pdf`);
      
      toast({
        title: t('investorPacket.pdfGenerated'),
        description: t('investorPacket.downloadReady'),
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: t('common.error'),
        description: t('investorPacket.generationFailed'),
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
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
      const headers = ['Year', 'Revenue', 'VariableCosts', 'StructuralCosts', 'EBITDA', 'Cash', 'CustomersCount'];
      
      const csvContent = [
        headers.join(','),
        ...activeScenario.results.yearlyResults.map(yr => [
          `Year ${yr.year + 1}`,
          yr.revenue,
          yr.variableCosts,
          yr.structuralCosts,
          yr.ebitda,
          yr.cash,
          yr.customersCount || 0
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
      
      {/* Wrap all content to be included in the PDF in a single div with ID */}
      <div id="investor-packet-content" className="space-y-6">
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
                    <InfoTooltip id="irr" />
                  </li>
                  <li>
                    <strong>{t('kpis.npv')}:</strong> {formatCurrency(results.npv)}
                    <InfoTooltip id="npv" />
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t('investorPacket.unitEconomics')}</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>{t('investorPacket.cac')}:</strong> {formatCurrency(results.unitEconomics.cac)}
                    <InfoTooltip id="cac" />
                  </li>
                  <li>
                    <strong>{t('investorPacket.ltv')}:</strong> {formatCurrency(results.unitEconomics.ltv)}
                    <InfoTooltip id="ltv" />
                  </li>
                  <li>
                    <strong>{t('investorPacket.ltvCacRatio')}:</strong> {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
                    <InfoTooltip id="ltvCac" />
                  </li>
                  <li>
                    <strong>{t('investorPacket.paybackPeriod')}:</strong> {formatNumber(results.unitEconomics.paybackMonths)} {t('common.months')}
                    <InfoTooltip id="payback" />
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
                    <p className="text-sm text-muted-foreground">
                      {t('kpis.irr')}
                      <InfoTooltip id="irr" />
                    </p>
                    <p className="text-2xl font-bold">{formatPercentage(results.irr)}</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {t('kpis.npv')}
                      <InfoTooltip id="npv" />
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(results.npv)}</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {t('kpis.ltvCacRatio')}
                      <InfoTooltip id="ltvCac" />
                    </p>
                    <p className="text-2xl font-bold">
                      {(results.unitEconomics.ltv / results.unitEconomics.cac).toFixed(1)}x
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {t('kpis.cacPayback')}
                      <InfoTooltip id="payback" />
                    </p>
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
                    <td className="p-2">{t('investorPacket.customersPerYear')}</td>
                    {results.yearlyResults.map((yr, index) => (
                      <td key={index} className="text-right p-2">
                        {formatNumber(yr.customersCount || 0)}
                      </td>
                    ))}
                  </tr>
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
                      <td key={index} className="text-right p-2">
                        {formatPercentage(yr.ebitda / yr.revenue)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card id="demand-capacity-section">
          <CardHeader>
            <CardTitle>{t('investorPacket.demandVsCapacity')}</CardTitle>
            <CardDescription>{t('investorPacket.demandVsCapacityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.year')}</TableHead>
                    <TableHead>{t('investorPacket.customersPerYear')}</TableHead>
                    {settings.products.map((product, idx) => (
                      <TableHead key={idx}>{t('investorPacket.actualRentals')}: {product.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.yearlyResults.map((yr, yearIndex) => (
                    <TableRow key={yearIndex}>
                      <TableCell>{yearIndex + 1}</TableCell>
                      <TableCell>{formatNumber(yr.customersCount || 0)}</TableCell>
                      {settings.products.map((product, productIdx) => (
                        <TableCell key={productIdx}>
                          {yr.actualRentals && formatNumber(yr.actualRentals[product.name] || 0)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <DetailedFinancialTable
          id="detail-table"
          results={results}
          settings={settings}
        />
        
        <MethodologySection 
          id="methodology-section"
          settings={settings}
          results={results}
        />
        
        {tornadoData && (
          <Card className="mt-6" id="tornado-chart">
            <CardHeader>
              <CardTitle>{t('sensitivity.tornadoChart')}</CardTitle>
              <CardDescription>{t('sensitivity.tornadoDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TornadoChart data={tornadoData} />
            </CardContent>
          </Card>
        )}
        
        {monteCarloResult && (
          <Card className="mt-6" id="monte-carlo-section">
            <CardHeader>
              <CardTitle>{t('investorPacket.monteCarloSimulation')}</CardTitle>
              <CardDescription>{t('investorPacket.monteCarloDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="mb-4">{t('investorPacket.monteCarloExplanation')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{t('investorPacket.p5')}</CardTitle>
                      <CardDescription>{t('investorPacket.p5Desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{formatCurrency(monteCarloResult.p5)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{t('investorPacket.p50')}</CardTitle>
                      <CardDescription>{t('investorPacket.p50Desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{formatCurrency(monteCarloResult.p50)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{t('investorPacket.p95')}</CardTitle>
                      <CardDescription>{t('investorPacket.p95Desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{formatCurrency(monteCarloResult.p95)}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">{t('investorPacket.ebitdaRange')}</h3>
                  <p>{t('investorPacket.ebitdaConfidence', {
                    p5: formatCurrency(monteCarloResult.p5),
                    p95: formatCurrency(monteCarloResult.p95)
                  })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mt-6" id="risk-analysis-section">
          <CardHeader>
            <CardTitle>{t('investorPacket.riskAnalysisSummary')}</CardTitle>
            <CardDescription>{t('investorPacket.riskAnalysisDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{t('investorPacket.sensititiveVariables')}</h3>
                <p className="mb-3">{t('investorPacket.sensititiveVariablesDesc')}</p>
                
                {tornadoData && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('table.variable')}</TableHead>
                        <TableHead>{t('investorPacket.impactOnEbitda')}</TableHead>
                        <TableHead>{t('investorPacket.mitigationPriority')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tornadoData.slice(0, 3).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.variable}</TableCell>
                          <TableCell>
                            {formatPercentage(Math.max(Math.abs(item.negativeImpact), Math.abs(item.positiveImpact)))}
                          </TableCell>
                          <TableCell>
                            {index === 0 ? (
                              <span className="text-red-500 font-medium">{t('investorPacket.priorityHigh')}</span>
                            ) : index === 1 ? (
                              <span className="text-amber-500 font-medium">{t('investorPacket.priorityMedium')}</span>
                            ) : (
                              <span className="text-green-600 font-medium">{t('investorPacket.priorityLow')}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">{t('investorPacket.recommendations')}</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t('investorPacket.recommendation1')}</li>
                  <li>{t('investorPacket.recommendation2')}</li>
                  <li>{t('investorPacket.recommendation3')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorPacketPage;
