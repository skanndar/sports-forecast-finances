
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, Prescriber } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import InfoTooltip from '@/components/ui/info-tooltip';

interface ProductInputSummaryProps {
  products: Product[];
  prescribers: Prescriber[];
}

const ProductInputSummary = ({ products, prescribers }: ProductInputSummaryProps) => {
  const { t } = useTranslation();
  
  // Check if prescribers' share exceeds 100%
  const totalShare = prescribers.reduce((sum, p) => sum + p.share, 0);
  const shareExceeds = totalShare > 1;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('dashboard.inputSummary')}</CardTitle>
      </CardHeader>
      <CardContent>
        {shareExceeds && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-md p-3 mb-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              {t('dashboard.shareExceeds')}
            </p>
          </div>
        )}
        <Table>
          <TableCaption>{t('dashboard.inputSummaryCaption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('inputs.name')}</TableHead>
              <TableHead className="text-right">{t('inputs.units')}</TableHead>
              <TableHead className="text-right">{t('inputs.price')}</TableHead>
              <TableHead className="text-right">{t('inputs.occupancy')}</TableHead>
              <TableHead className="text-right">{t('inputs.variableCost')}</TableHead>
              <TableHead className="text-right">{t('inputs.minDays')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id || product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.units}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.pricingMode === 'daily' 
                    ? (product.pricePerDay || 0) 
                    : (product.pricePerMonth || 0)
                  )}
                  {product.pricingMode === 'daily' ? '/día' : '/mes'}
                </TableCell>
                <TableCell className="text-right">{formatPercentage(product.occupancy)}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.variableCost)}</TableCell>
                <TableCell className="text-right">{product.minDays}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6} className="font-bold bg-muted">
                {t('inputs.prescribers')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('inputs.name')}</TableCell>
              <TableCell colSpan={3} className="text-right">
                {t('inputs.share')} <InfoTooltip id="prescriber-share" />
              </TableCell>
              <TableCell colSpan={2} className="text-right">
                {t('inputs.commission')} <InfoTooltip id="prescriber-commission" />
              </TableCell>
            </TableRow>
            {prescribers.map((prescriber) => (
              <TableRow key={prescriber.id || prescriber.name}>
                <TableCell className="font-medium">{prescriber.name}</TableCell>
                <TableCell colSpan={3} className="text-right">{formatPercentage(prescriber.share)}</TableCell>
                <TableCell colSpan={2} className="text-right">{formatPercentage(prescriber.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ProductInputSummary;
