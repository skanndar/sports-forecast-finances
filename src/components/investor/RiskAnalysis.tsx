
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatPercentage } from '@/lib/formatters';
import { TornadoItem } from '@/lib/types';

interface RiskAnalysisProps {
  tornadoData: TornadoItem[] | null;
}

const RiskAnalysis = ({ tornadoData }: RiskAnalysisProps) => {
  const { t } = useTranslation();

  return (
    <Card className="mt-6" id="risk-analysis-section">
      <CardHeader>
        <CardTitle>{t('investorPacket.riskAnalysisSummary')}</CardTitle>
        <CardDescription>{t('investorPacket.riskAnalysisDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.sensitiveVariables')}</h3>
            <p className="mb-3">{t('investorPacket.sensitiveVariablesDesc')}</p>
            
            {tornadoData && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('table.variable')}</TableHead>
                    <TableHead>{t('investorPacket.impactOnEbitda')}</TableHead>
                    <TableHead>{t('investorPacket.mitigationPriority')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tornadoData.slice(0, 3).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.variable}</TableCell>
                      <TableCell>
                        {formatPercentage(Math.max(Math.abs(item.negativeImpact), Math.abs(item.positiveImpact)))}
                      </TableCell>
                      <TableCell>
                        {index === 0 ? (
                          <span className="text-red-500 font-medium">{t('investorPacket.priorityHigh')}</span>
                        ) : index === 1 ? (
                          <span className="text-amber-500 font-medium">{t('investorPacket.priorityMedium')}</span>
                        ) : (
                          <span className="text-green-600 font-medium">{t('investorPacket.priorityLow')}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.recommendations')}</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('investorPacket.recommendation1')}</li>
              <li>{t('investorPacket.recommendation2')}</li>
              <li>{t('investorPacket.recommendation3')}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysis;
