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

interface TornadoChartProps {
  data: TornadoItem[];
  className?: string;
  id?: string;
  standalone?: boolean;
}

const TornadoChart = ({ data, className = "", id, standalone = false }: TornadoChartProps) => {
  const { t } = useTranslation();
  
  // Maximum impact for consistent scale
  const maxImpact = Math.max(
    ...data.flatMap(item => [
      Math.abs(item.negativeImpact),
      Math.abs(item.positiveImpact)
    ])
  );
  
  // Scale factor for visualization (max bar width)
  const maxBarWidth = 40; // percentage
  
  const chartContent = (
    <div className="space-y-3">
      <div className="flex items-center text-sm pb-2">
        <div className="flex-1 font-medium">{t('sensitivity.variable')}</div>
        <div className="w-[45%] text-center">{t('sensitivity.negativeImpact')}</div>
        <div className="w-[45%] text-center">{t('sensitivity.positiveImpact')}</div>
      </div>
      
      {data.map((item, index) => (
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
  );
  
  // If standalone is false, just return the chart content without the card
  if (!standalone) {
    return chartContent;
  }
  
  // Otherwise wrap it in a card
  return (
    <Card className={`mt-6 ${className}`} id={id}>
      <CardHeader>
        <CardTitle>{t('sensitivity.tornadoChart')}</CardTitle>
        <CardDescription>{t('sensitivity.tornadoDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartContent}
      </CardContent>
    </Card>
  );
};

export default TornadoChart;
