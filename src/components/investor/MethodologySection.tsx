
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings } from '@/lib/types';
import InfoTooltip from "@/components/ui/info-tooltip";

interface MethodologySectionProps {
  settings: Settings;
  className?: string;
  id?: string;
}

const MethodologySection = ({ settings, className = "", id }: MethodologySectionProps) => {
  const { t } = useTranslation();

  return (
    <Card className={`mt-6 ${className}`} id={id}>
      <CardHeader>
        <CardTitle>{t('investorPacket.methodology')}</CardTitle>
        <CardDescription>{t('investorPacket.methodologyDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.revenueCalculation')}</h3>
            <p className="mb-2">{t('investorPacket.revenueFormula')}</p>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.revenueDailyFormula')}
              {'\n'}
              {t('investorPacket.revenueMonthlyFormula')}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.costsCalculation')}</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.productCostsFormula')}
              {'\n'}
              {t('investorPacket.prescriberCostsFormula')}
              {'\n'}
              {t('investorPacket.directorCostsFormula')}
              {'\n'}
              {t('investorPacket.structuralCostsFormula')}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.profitabilityCalculation')}</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto">
              {t('investorPacket.grossMarginFormula')}
              {'\n'}
              {t('investorPacket.ebitdaFormula')}
              {'\n'}
              {t('investorPacket.cashFlowFormula')}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.financialMetricsCalculation')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.metric')}</TableHead>
                  <TableHead>{t('investorPacket.formula')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{t('kpis.irr')}</TableCell>
                  <TableCell>{t('investorPacket.irrFormula')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('kpis.npv')}</TableCell>
                  <TableCell>{t('investorPacket.npvFormula')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('investorPacket.cac')}</TableCell>
                  <TableCell>{t('investorPacket.cacFormula')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('investorPacket.ltv')}</TableCell>
                  <TableCell>{t('investorPacket.ltvFormula')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{t('investorPacket.paybackPeriod')}</TableCell>
                  <TableCell>{t('investorPacket.paybackFormula')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">{t('investorPacket.retention')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.metric')}</TableHead>
                  <TableHead>{t('table.value')}</TableHead>
                  <TableHead>{t('investorPacket.impact')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('inputs.churn')}
                    <InfoTooltip id="churn" />
                  </TableCell>
                  <TableCell>{(settings.churn * 100).toFixed(1)}%</TableCell>
                  <TableCell>{t('investorPacket.churnImpact')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {t('inputs.rentalsPerCustomer')}
                    <InfoTooltip id="rentals-per-customer" />
                  </TableCell>
                  <TableCell>{settings.rentalsPerCustomer}</TableCell>
                  <TableCell>{t('investorPacket.rentalsImpact')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
