
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TornadoItem } from '@/lib/types';
import { formatPercentage } from '@/lib/formatters';
import { runTornadoAnalysis } from '@/lib/finance';
import { useAppStore } from '@/lib/store';

interface TornadoChartProps {
  className?: string;
  id?: string;
}

const TornadoChart = ({ className = "", id }: TornadoChartProps) => {
  const { t } = useTranslation();
  const { activeScenario } = useAppStore();
  
  // Calculate tornado analysis results
  const tornadoResults = runTornadoAnalysis(activeScenario.settings);
  
  // Maximum impact for consistent scale
  const maxImpact = Math.max(
    ...tornadoResults.flatMap(item => [
      Math.abs(item.negativeImpact),
      Math.abs(item.positiveImpact)
    ])
  );
  
  // Scale factor for visualization (max bar width)
  const maxBarWidth = 40; // percentage
  
  return (
    <Card className={`mt-6 ${className}`} id={id}>
      <CardHeader>
        <CardTitle>{t('sensitivity.tornadoChart')}</CardTitle>
        <CardDescription>{t('sensitivity.tornadoDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm pb-2">
            <div className="flex-1 font-medium">{t('sensitivity.variable')}</div>
            <div className="w-[45%] text-center">{t('sensitivity.negativeImpact')}</div>
            <div className="w-[45%] text-center">{t('sensitivity.positiveImpact')}</div>
          </div>
          
          {tornadoResults.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1 font-medium text-sm">{item.variable}</div>
              
              <div className="w-[45%] flex items-center justify-end">
                <div 
                  className="h-6 bg-red-500/80 rounded-l"
                  style={{ 
                    width: `${Math.abs(item.negativeImpact) / maxImpact * maxBarWidth}%`
                  }}
                />
                <span className="ml-2 text-sm">
                  {formatPercentage(item.negativeImpact)}
                </span>
              </div>
              
              <div className="w-[45%] flex items-center">
                <span className="mr-2 text-sm">
                  {formatPercentage(item.positiveImpact)}
                </span>
                <div 
                  className="h-6 bg-green-500/80 rounded-r"
                  style={{ 
                    width: `${Math.abs(item.positiveImpact) / maxImpact * maxBarWidth}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TornadoChart;
