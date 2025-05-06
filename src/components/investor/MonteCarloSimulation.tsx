
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from '@/lib/formatters';

interface MonteCarloSimulationProps {
  monteCarloResult: {
    p5: number;
    p50: number;
    p95: number;
  } | null;
}

const MonteCarloSimulation = ({ monteCarloResult }: MonteCarloSimulationProps) => {
  const { t } = useTranslation();
  
  if (!monteCarloResult) return null;

  return (
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
  );
};

export default MonteCarloSimulation;
