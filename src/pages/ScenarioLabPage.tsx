
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { Copy, Save, Trash, Download, Plus } from "lucide-react";
import { Scenario } from '@/lib/types';

const ScenarioLabPage = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { 
    activeScenario,
    savedScenarios,
    compareScenarios,
    saveScenario,
    loadScenario,
    duplicateScenario,
    deleteScenario,
    addToCompare,
    removeFromCompare,
    clearCompare
  } = useAppStore();
  
  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please provide a name for your scenario.',
        variant: 'destructive'
      });
      return;
    }
    
    saveScenario(scenarioName);
    setScenarioName('');
    setDialogOpen(false);
    
    toast({
      title: 'Scenario saved',
      description: `${scenarioName} has been saved successfully.`
    });
  };
  
  const handleLoadScenario = (id: string) => {
    loadScenario(id);
    
    toast({
      title: 'Scenario loaded',
      description: 'The scenario has been loaded successfully.'
    });
  };
  
  const handleDuplicateScenario = (id: string) => {
    duplicateScenario(id);
    
    toast({
      title: 'Scenario duplicated',
      description: 'A copy of the scenario has been created.'
    });
  };
  
  const handleDeleteScenario = (id: string, name: string) => {
    deleteScenario(id);
    
    toast({
      title: 'Scenario deleted',
      description: `${name} has been deleted.`
    });
  };
  
  const handleToggleCompare = (id: string) => {
    if (compareScenarios.includes(id)) {
      removeFromCompare(id);
    } else if (compareScenarios.length < 3) {
      addToCompare(id);
    } else {
      toast({
        title: 'Comparison limit reached',
        description: 'You can compare up to 3 scenarios at once.',
        variant: 'destructive'
      });
    }
  };
  
  const getComparisonScenarios = (): Scenario[] => {
    return compareScenarios
      .map(id => savedScenarios.find(s => s.id === id))
      .filter(Boolean) as Scenario[];
  };
  
  const comparisonScenarios = getComparisonScenarios();
  
  const shareScenario = () => {
    // Base64 encode the settings and add to URL hash
    const encodedSettings = btoa(JSON.stringify(activeScenario.settings));
    const url = `${window.location.origin}${window.location.pathname}#${encodedSettings}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: 'Share link copied',
          description: 'The scenario share link has been copied to your clipboard.'
        });
      })
      .catch(() => {
        toast({
          title: 'Copy failed',
          description: 'Failed to copy the share link to clipboard.',
          variant: 'destructive'
        });
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Scenario Lab</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Save size={16} /> Save Current Scenario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Scenario</DialogTitle>
              <DialogDescription>
                Give your scenario a name to save it for future reference.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="scenario-name">Name</Label>
                <Input
                  id="scenario-name"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder={activeScenario.name || 'My Scenario'}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveScenario}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" onClick={shareScenario} className="flex items-center gap-2">
          <Copy size={16} /> Share Link
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Scenarios</CardTitle>
            <CardDescription>Your collection of financial scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedScenarios.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No saved scenarios yet.</p>
                <p className="text-sm text-muted-foreground">Save your current scenario to start comparing.</p>
              </div>
            ) : (
              savedScenarios.map((scenario) => (
                <Card key={scenario.id} className="mb-4">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleLoadScenario(scenario.id)}>
                          Load
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicateScenario(scenario.id)}>
                          Duplicate
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteScenario(scenario.id, scenario.name)}>
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="py-3 flex justify-between">
                    <div>
                      {scenario.results && (
                        <div className="text-sm text-muted-foreground">
                          IRR: {formatPercentage(scenario.results.irr)} | 
                          NPV: {formatCurrency(scenario.results.npv)}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant={compareScenarios.includes(scenario.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleCompare(scenario.id)}
                    >
                      {compareScenarios.includes(scenario.id) ? 'Selected' : 'Compare'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scenario Comparison</CardTitle>
              {compareScenarios.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompare}>
                  Clear
                </Button>
              )}
            </div>
            <CardDescription>Compare up to 3 scenarios side by side</CardDescription>
          </CardHeader>
          <CardContent>
            {comparisonScenarios.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No scenarios selected for comparison.</p>
                <p className="text-sm text-muted-foreground">Select 'Compare' on scenarios to include them here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Metric</th>
                      {comparisonScenarios.map(scenario => (
                        <th key={scenario.id} className="text-right p-2">{scenario.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">Revenue (Year 5)</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.yearlyResults && scenario.results.yearlyResults.length > 0
                            ? formatCurrency(scenario.results.yearlyResults[scenario.results.yearlyResults.length - 1].revenue)
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">EBITDA (Year 5)</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.yearlyResults && scenario.results.yearlyResults.length > 0
                            ? formatCurrency(scenario.results.yearlyResults[scenario.results.yearlyResults.length - 1].ebitda)
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">IRR</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.irr ? formatPercentage(scenario.results.irr) : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">NPV</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.npv ? formatCurrency(scenario.results.npv) : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">LTV/CAC</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.unitEconomics
                            ? (scenario.results.unitEconomics.ltv / scenario.results.unitEconomics.cac).toFixed(1) + 'x'
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Payback (months)</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.unitEconomics
                            ? formatNumber(scenario.results.unitEconomics.paybackMonths)
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">Break-even</td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.unitEconomics?.breakEvenYear !== undefined
                            ? `Year ${scenario.results.unitEconomics.breakEvenYear + 1}`
                            : 'Not in forecast'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioLabPage;
