import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltips } from '@/lib/tooltips';

interface InfoTooltipProps {
  id: string;
  className?: string;
  size?: number;
}

const InfoTooltip = ({ id, className, size = 14 }: InfoTooltipProps) => {
  const { t } = useTranslation();
  
  // Get tooltip content from tooltips file or i18n
  const getTooltipContent = () => {
    // First check if the tooltip is in the tooltips object
    if (tooltips[id]) {
      return tooltips[id];
    }
    
    // Otherwise, try to get it from i18n
    const i18nKey = `tooltips.${id}`;
    const translated = t(i18nKey);
    
    // Return the translation only if it's not the same as the key
    // (which would indicate a missing translation)
    if (translated !== i18nKey) {
      return translated;
    }
    
    // Fallback
    return '';
  };
  
  const tooltipContent = getTooltipContent();
  
  if (!tooltipContent) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info 
            size={size} 
            className={`text-muted-foreground cursor-help inline-block ml-1 ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
