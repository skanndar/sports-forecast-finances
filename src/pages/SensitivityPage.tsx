
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
import { formatCurrency } from '@/lib/formatters';
import { runTornadoAnalysis, runMonteCarloSimulation } from '@/lib/finance';
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from 'react-i18next';

const SensitivityPage = () => {
  const { activeScenario } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [tornadoData, setTornadoData] = useState(null);
  const [monteCarloResult, setMonteCarloResult] = useState(null);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const runAnalysis = async () => {
    setIsRunningAnalysis(true);
    
    try {
      // Use setTimeout to allow the UI to update before running heavy calculations
      setTimeout(() => {
        const tornado = runTornadoAnalysis(activeScenario.settings);
        setTornadoData(tornado);
        
        const monteCarlo = runMonteCarloSimulation(activeScenario.settings);
        setMonteCarloResult(monteCarlo);
        
        setIsRunningAnalysis(false);
        
        toast({
          title: t('sensitivity.analysisComplete', { defaultValue: 'Analysis complete' }),
          description: t('sensitivity.analysisSuccess', { defaultValue: 'Sensitivity analysis has been completed successfully.' })
        });
      }, 100);
    } catch (error) {
      setIsRunningAnalysis(false);
      toast({
        title: t('sensitivity.analysisFailed', { defaultValue: 'Analysis failed' }),
        description: t('sensitivity.analysisError', { defaultValue: 'An error occurred while running the sensitivity analysis.' }),
        variant: 'destructive'
      });
    }
  };

  // Run analysis on component mount if we have a valid scenario
  useEffect(() => {
    if (activeScenario.settings && !tornadoData && !monteCarloResult && !isRunningAnalysis) {
      runAnalysis();
    }
  }, [activeScenario.settings]);

  // Format tornado data for the chart
  const formattedTornadoData = tornadoData?.map(item => ({
    variable: item.variable,
    negative: item.negativeImpact * 100,
    positive: item.positiveImpact * 100
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('sensitivity.title', { defaultValue: "Sensitivity Analysis" })}</h1>
      
      <div className="mb-6 flex justify-end">
        <Button 
          onClick={runAnalysis} 
          disabled={isRunningAnalysis}
          className="flex items-center gap-2"
        >
          {isRunningAnalysis ? 
            t('sensitivity.runningAnalysis', { defaultValue: 'Running Analysis...' }) : 
            t('sensitivity.runAnalysis', { defaultValue: 'Run Analysis' })}
        </Button>
      </div>
      
      {/* Fixed: Added grid-cols-1 and gap-4 to prevent overlapping on small screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('sensitivity.tornadoChart', { defaultValue: "Tornado Analysis" })}</CardTitle>
            <CardDescription>
              {t('sensitivity.tornadoDesc', { defaultValue: "Impact of ±10% variation in key parameters on EBITDA" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!tornadoData ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">
                  {t('sensitivity.runToSeeResults', { defaultValue: "Run analysis to see results" })}
                </p>
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={formattedTornadoData}
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" label={{ 
                      value: t('sensitivity.impactOnEbitda', { defaultValue: 'Impact on EBITDA (%)' }), 
                      position: 'insideBottom', 
                      offset: -5 
                    }} />
                    <YAxis type="category" dataKey="variable" />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, t('sensitivity.impact', { defaultValue: 'Impact' })]} 
                      labelFormatter={(label) => `${t('sensitivity.variable', { defaultValue: 'Variable' })}: ${label}`}
                    />
                    <ReferenceLine x={0} stroke="#000" />
                    <Bar dataKey="negative" fill="#f87171" name={t('sensitivity.negativeImpact', { defaultValue: "Negative Impact" })} />
                    <Bar dataKey="positive" fill="#4ade80" name={t('sensitivity.positiveImpact', { defaultValue: "Positive Impact" })} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('investorPacket.monteCarloSimulation', { defaultValue: "Monte Carlo Simulation" })}</CardTitle>
            <CardDescription>
              {t('investorPacket.monteCarloDesc', { defaultValue: "1,000 runs with random variations in key parameters" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!monteCarloResult ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">
                  {t('sensitivity.runToSeeResults', { defaultValue: "Run analysis to see results" })}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
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
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {t('investorPacket.confidenceInterval', { defaultValue: "Final Year EBITDA - 90% Confidence Interval" })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('investorPacket.simulationRuns', { defaultValue: "Based on 1,000 simulation runs with random variations in key parameters" })}
                    </p>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('table.percentile', { defaultValue: "Percentile" })}</TableHead>
                        <TableHead className="text-right">{t('table.ebitda')}</TableHead>
                        <TableHead className="text-right">
                          {t('investorPacket.interpretation', { defaultValue: "Interpretation" })}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">P5</TableCell>
                        <TableCell className="text-right">{formatCurrency(monteCarloResult.p5)}</TableCell>
                        <TableCell className="text-right">
                          {t('investorPacket.p5Desc', { defaultValue: "Worst case scenario (5%)" })}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">P50</TableCell>
                        <TableCell className="text-right">{formatCurrency(monteCarloResult.p50)}</TableCell>
                        <TableCell className="text-right">
                          {t('investorPacket.p50Desc', { defaultValue: "Median case (50%)" })}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">P95</TableCell>
                        <TableCell className="text-right">{formatCurrency(monteCarloResult.p95)}</TableCell>
                        <TableCell className="text-right">
                          {t('investorPacket.p95Desc', { defaultValue: "Best case scenario (95%)" })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {t('investorPacket.riskAnalysisSummary', { defaultValue: "Risk Analysis Summary" })}
          </CardTitle>
          <CardDescription>
            {t('investorPacket.riskAnalysisDesc', { defaultValue: "Key findings from sensitivity analysis" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tornadoData || !monteCarloResult ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {t('sensitivity.runToSeeResults', { defaultValue: "Run analysis to see results" })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">
                  {t('investorPacket.sensititiveVariables', { defaultValue: "Most Sensitive Parameters" })}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('investorPacket.sensititiveVariablesDesc', { defaultValue: "These parameters have the highest impact on your financial results" })}
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {tornadoData.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.variable} (±{Math.max(Math.abs(item.positiveImpact), Math.abs(item.negativeImpact)).toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">
                  {t('investorPacket.ebitdaRange', { defaultValue: "EBITDA Range" })}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {t('investorPacket.confidenceInterval', { defaultValue: "90% confidence interval from Monte Carlo simulation" })}
                </p>
                <p>
                  {t('investorPacket.ebitdaConfidence', { 
                    defaultValue: "With 90% certainty, the final year EBITDA will be between {{p5}} and {{p95}}",
                    p5: formatCurrency(monteCarloResult.p5),
                    p95: formatCurrency(monteCarloResult.p95)
                  })}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">
                  {t('investorPacket.recommendations', { defaultValue: "Recommendations" })}
                </h3>
                <ul className="list-disc pl-5 space-y-1">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SensitivityPage;
