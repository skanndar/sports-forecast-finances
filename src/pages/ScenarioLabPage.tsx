
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/formatters';
import { Copy, Save, Trash, Download, Plus, Edit } from "lucide-react";
import { Scenario } from '@/lib/types';
import { loadScenarios, saveScenario, updateScenario, deleteScenario } from '@/lib/scenarioService';
import { supabase, isSupabaseConfigured, isLoggedIn } from '@/lib/supabase';
import InfoTooltip from '@/components/ui/info-tooltip';

const ScenarioLabPage = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { 
    activeScenario,
    savedScenarios,
    compareScenarios,
    updateSettings,
    saveScenario: storeSaveScenario,
    loadScenario: storeLoadScenario,
    duplicateScenario: storeDuplicateScenario,
    deleteScenario: storeDeleteScenario,
    addToCompare,
    removeFromCompare,
    clearCompare
  } = useAppStore();
  
  // Load scenarios on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSupabaseConfigured()) {
          const loggedIn = await isLoggedIn();
          setUserIsLoggedIn(loggedIn);
        }
        
        if (!dataLoaded) {
          const scenarios = await loadScenarios();
          // TODO: Update app state with loaded scenarios
          console.log('Loaded scenarios:', scenarios);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error initializing scenarios:', error);
      }
    };
    
    fetchData();
  }, [dataLoaded]);
  
  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast({
        title: t('common.error'),
        description: t('scenarioLab.nameRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Save to backend/localStorage via service
      const scenarioId = await saveScenario(scenarioName, activeScenario.settings);
      
      // Update local store
      storeSaveScenario(scenarioName);
      
      setScenarioName('');
      setDialogOpen(false);
      
      toast({
        title: t('common.success'),
        description: t('scenarioLab.scenarioSaved')
      });
      
      // Refresh data
      setDataLoaded(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  };
  
  const handleRenameScenario = async () => {
    if (!scenarioName.trim() || !editingScenarioId) {
      toast({
        title: t('common.error'),
        description: t('scenarioLab.nameRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const scenarioToUpdate = savedScenarios.find(s => s.id === editingScenarioId);
      
      if (scenarioToUpdate) {
        // Update in backend/localStorage
        await updateScenario(editingScenarioId, scenarioName, scenarioToUpdate.settings);
        
        // Update local store (by saving with same ID)
        storeSaveScenario(scenarioName);
      }
      
      setScenarioName('');
      setEditingScenarioId(null);
      setRenameDialogOpen(false);
      
      toast({
        title: t('common.success'),
        description: t('scenarioLab.scenarioRenamed')
      });
      
      // Refresh data
      setDataLoaded(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  };
  
  const handleLoadScenario = (id: string) => {
    storeLoadScenario(id);
    
    toast({
      title: t('common.success'),
      description: t('scenarioLab.scenarioLoaded')
    });
  };
  
  const handleDuplicateScenario = (id: string) => {
    storeDuplicateScenario(id);
    
    toast({
      title: t('common.success'),
      description: t('scenarioLab.scenarioDuplicated')
    });
  };
  
  const handleDeleteScenario = async (id: string, name: string) => {
    try {
      // Delete from backend/localStorage
      await deleteScenario(id);
      
      // Delete from local store
      storeDeleteScenario(id);
      
      toast({
        title: t('common.success'),
        description: t(`${name} ${t('scenarioLab.hasBeenDeleted')}`)
      });
      
      // Refresh data
      setDataLoaded(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: (error as Error).message,
        variant: 'destructive'
      });
    }
  };
  
  const openRenameDialog = (id: string, currentName: string) => {
    setEditingScenarioId(id);
    setScenarioName(currentName);
    setRenameDialogOpen(true);
  };
  
  const handleToggleCompare = (id: string) => {
    if (compareScenarios.includes(id)) {
      removeFromCompare(id);
    } else if (compareScenarios.length < 3) {
      addToCompare(id);
    } else {
      toast({
        title: t('scenarioLab.comparisonLimitReached'),
        description: t('scenarioLab.comparisonLimitDesc'),
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
          title: t('scenarioLab.shareLinkCopied'),
          description: t('scenarioLab.shareLinkDesc')
        });
      })
      .catch(() => {
        toast({
          title: t('scenarioLab.copyFailed'),
          description: t('scenarioLab.copyFailedDesc'),
          variant: 'destructive'
        });
      });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('scenarioLab.title')}</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Save size={16} /> {t('scenarioLab.saveCurrentBtn')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('scenarioLab.saveScenario')}</DialogTitle>
              <DialogDescription>
                {t('scenarioLab.saveScenarioDesc')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="scenario-name">{t('inputs.name')}</Label>
                <Input
                  id="scenario-name"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder={activeScenario.name || t('common.myScenario')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveScenario}>{t('common.save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('common.rename')}</DialogTitle>
              <DialogDescription>
                {t('scenarioLab.enterNewName')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="scenario-rename">{t('inputs.name')}</Label>
                <Input
                  id="scenario-rename"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder={t('common.newName')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleRenameScenario}>{t('common.rename')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" onClick={shareScenario} className="flex items-center gap-2">
          <Copy size={16} /> {t('scenarioLab.shareLink')}
        </Button>
        
        {!userIsLoggedIn && isSupabaseConfigured() && (
          <div className="w-full mt-1">
            <p className="text-sm text-amber-500">
              {t('scenarioLab.loginForCloud')}
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('scenarioLab.savedScenarios')}</CardTitle>
            <CardDescription>{t('scenarioLab.scenarioCollection')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedScenarios.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">{t('scenarioLab.noSavedScenarios')}</p>
                <p className="text-sm text-muted-foreground">{t('scenarioLab.saveCurrentScenario')}</p>
              </div>
            ) : (
              savedScenarios.map((scenario) => (
                <Card key={scenario.id} className="mb-4">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleLoadScenario(scenario.id)}>
                          {t('common.load')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openRenameDialog(scenario.id, scenario.name)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDuplicateScenario(scenario.id)}>
                          {t('common.duplicate')}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('common.confirmation')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('scenarioLab.deleteConfirmation', { name: scenario.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteScenario(scenario.id, scenario.name)}>
                                {t('common.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                      {compareScenarios.includes(scenario.id) ? t('common.selected') : t('common.compare')}
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
              <CardTitle>{t('scenarioLab.scenarioComparison')}</CardTitle>
              {compareScenarios.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompare}>
                  {t('scenarioLab.clear')}
                </Button>
              )}
            </div>
            <CardDescription>{t('scenarioLab.compareScenarios')}</CardDescription>
          </CardHeader>
          <CardContent>
            {comparisonScenarios.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">{t('scenarioLab.noScenariosSelected')}</p>
                <p className="text-sm text-muted-foreground">{t('scenarioLab.selectScenarios')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">{t('scenarioLab.metric')}</th>
                      {comparisonScenarios.map(scenario => (
                        <th key={scenario.id} className="text-right p-2">{scenario.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        {t('table.revenue')} ({t('common.year')} 5)
                        <InfoTooltip id="revenue" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.yearlyResults && scenario.results.yearlyResults.length > 0
                            ? formatCurrency(scenario.results.yearlyResults[scenario.results.yearlyResults.length - 1].revenue)
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        EBITDA ({t('common.year')} 5)
                        <InfoTooltip id="ebitda" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.yearlyResults && scenario.results.yearlyResults.length > 0
                            ? formatCurrency(scenario.results.yearlyResults[scenario.results.yearlyResults.length - 1].ebitda)
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        IRR
                        <InfoTooltip id="irr" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.irr ? formatPercentage(scenario.results.irr) : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        NPV
                        <InfoTooltip id="npv" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.npv ? formatCurrency(scenario.results.npv) : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        LTV/CAC
                        <InfoTooltip id="ltvCac" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.unitEconomics
                            ? (scenario.results.unitEconomics.ltv / scenario.results.unitEconomics.cac).toFixed(1) + 'x'
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        {t('kpis.cacPayback')}
                        <InfoTooltip id="payback" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.unitEconomics
                            ? formatNumber(scenario.results.unitEconomics.paybackMonths)
                            : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 flex items-center">
                        {t('kpis.breakeven')}
                        <InfoTooltip id="breakeven" />
                      </td>
                      {comparisonScenarios.map(scenario => (
                        <td key={scenario.id} className="text-right p-2">
                          {scenario.results?.unitEconomics?.breakEvenYear !== undefined
                            ? `${t('common.year')} ${scenario.results.unitEconomics.breakEvenYear + 1}`
                            : t('scenarioLab.notInForecast')}
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
