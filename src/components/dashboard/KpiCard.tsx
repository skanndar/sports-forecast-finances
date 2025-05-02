
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  tooltip?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  statusColor?: "green" | "amber" | "red" | "default";
  className?: string;
  formatter?: (value: string | number) => string;
}

const KpiCard = ({
  title,
  value,
  description,
  tooltip,
  trend,
  statusColor = "default",
  className,
  formatter = (val) => String(val),
}: KpiCardProps) => {
  const getStatusColorClass = () => {
    switch (statusColor) {
      case "green":
        return "border-l-4 border-l-success";
      case "amber":
        return "border-l-4 border-l-warning";
      case "red":
        return "border-l-4 border-l-danger";
      default:
        return "";
    }
  };

  return (
    <Card className={cn("overflow-hidden", getStatusColorClass(), className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            {title}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={14} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
          {trend && (
            <div className={`text-xs font-medium ${trend.isPositive ? "text-success" : "text-danger"}`}>
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value).toFixed(1)}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">{formatter(value)}</div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
