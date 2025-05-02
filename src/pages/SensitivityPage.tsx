
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
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

const SensitivityPage = () => {
  const { activeScenario } = useAppStore();
  const { toast } = useToast();
  const [tornadoData, setTornadoData] = useState<ReturnType<typeof runTornadoAnalysis> | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<ReturnType<typeof runMonteCarloSimulation> | null>(null);
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
          title: 'Analysis complete',
          description: 'Sensitivity analysis has been completed successfully.'
        });
      }, 100);
    } catch (error) {
      setIsRunningAnalysis(false);
      toast({
        title: 'Analysis failed',
        description: 'An error occurred while running the sensitivity analysis.',
        variant: 'destructive'
      });
    }
  };

  // Format tornado data for the chart
  const formattedTornadoData = tornadoData?.map(item => ({
    variable: item.variable,
    negative: item.negativeImpact * 100,
    positive: item.positiveImpact * 100
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Sensitivity Analysis</h1>
      
      <div className="mb-6 flex justify-end">
        <Button 
          onClick={runAnalysis} 
          disabled={isRunningAnalysis}
          className="flex items-center gap-2"
        >
          {isRunningAnalysis ? 'Running Analysis...' : 'Run Analysis'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Tornado Analysis</CardTitle>
            <CardDescription>Impact of ±10% variation in key parameters on EBITDA</CardDescription>
          </CardHeader>
          <CardContent>
            {!tornadoData ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Run analysis to see results</p>
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
                    <XAxis type="number" label={{ value: 'Impact on EBITDA (%)', position: 'insideBottom', offset: -5 }} />
                    <YAxis type="category" dataKey="variable" />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Impact']} 
                      labelFormatter={(label) => `Variable: ${label}`}
                    />
                    <ReferenceLine x={0} stroke="#000" />
                    <Bar dataKey="negative" fill="#f87171" name="Negative Impact" />
                    <Bar dataKey="positive" fill="#4ade80" name="Positive Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monte Carlo Simulation</CardTitle>
            <CardDescription>1,000 runs with random variations in key parameters</CardDescription>
          </CardHeader>
          <CardContent>
            {!monteCarloResult ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Run analysis to see results</p>
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
                      <div className="text-sm font-medium text-muted-foreground">P5 (Pessimistic)</div>
                      <div className="font-bold">{formatCurrency(monteCarloResult.p5)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">P50 (Base)</div>
                      <div className="font-bold">{formatCurrency(monteCarloResult.p50)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground">P95 (Optimistic)</div>
                      <div className="font-bold">{formatCurrency(monteCarloResult.p95)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Final Year EBITDA - 90% Confidence Interval</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on 1,000 simulation runs with random variations in key parameters
                    </p>
                  </div>
                  
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Percentile</th>
                        <th className="text-right p-2">EBITDA</th>
                        <th className="text-right p-2">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">P5</td>
                        <td className="text-right p-2">{formatCurrency(monteCarloResult.p5)}</td>
                        <td className="text-right p-2">Worst case scenario (5%)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">P50</td>
                        <td className="text-right p-2">{formatCurrency(monteCarloResult.p50)}</td>
                        <td className="text-right p-2">Median case (50%)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">P95</td>
                        <td className="text-right p-2">{formatCurrency(monteCarloResult.p95)}</td>
                        <td className="text-right p-2">Best case scenario (95%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis Summary</CardTitle>
          <CardDescription>Key findings from sensitivity analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {!tornadoData || !monteCarloResult ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Run analysis to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Most Sensitive Parameters</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These parameters have the highest impact on your financial results
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {tornadoData.slice(0, 3).map((item, index) => (
                    <li key={index}>{item.variable} (±{Math.max(Math.abs(item.positiveImpact), Math.abs(item.negativeImpact)).toFixed(1)}%)</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">EBITDA Range</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  90% confidence interval from Monte Carlo simulation
                </p>
                <p>
                  With 90% certainty, the final year EBITDA will be between {formatCurrency(monteCarloResult.p5)} and {formatCurrency(monteCarloResult.p95)}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Focus on optimizing the top sensitive parameters to improve financial outcomes</li>
                  <li>Consider scenario planning for both pessimistic and optimistic cases</li>
                  <li>Revisit assumptions regularly to refine the forecast accuracy</li>
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
