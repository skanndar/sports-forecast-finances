
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { runMonteCarloSimulation, runTornadoAnalysis } from '@/lib/finance';
import { Settings } from '@/lib/types';

interface SensitivityAnalysisProps {
  settings: Settings | undefined;
  setMonteCarloResult: React.Dispatch<React.SetStateAction<any>>;
  setTornadoData: React.Dispatch<React.SetStateAction<any>>;
}

const SensitivityAnalysis = ({ settings, setMonteCarloResult, setTornadoData }: SensitivityAnalysisProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (settings) {
      runAnalysis();
    }
  }, [settings]);
  
  const runAnalysis = () => {
    if (!settings) return;
    
    try {
      const mcResult = runMonteCarloSimulation(settings);
      setMonteCarloResult(mcResult);
      
      const tdResult = runTornadoAnalysis(settings);
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
  
  return null; // This is a logic-only component, no UI
};

export default SensitivityAnalysis;
