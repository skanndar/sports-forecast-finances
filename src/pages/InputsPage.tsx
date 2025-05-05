import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/ui/info-tooltip";
import { Plus, Trash } from "lucide-react";
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

const InputsPage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['products']);
  const { activeScenario, updateProductField, updatePrescriberField, updateSettings, addProduct, removeProduct, addPrescriber, removePrescriber } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { settings } = activeScenario;
  
  // Calculate total prescriber share to check if it exceeds 100%
  const totalShare = settings.prescribers.reduce((sum, p) => sum + p.share, 0);
  const shareExceeds = totalShare > 1;
  
  const handleAddProduct = () => {
    if (settings.products.length >= 5) {
      toast({
        title: t('common.maximumLimitReached'),
        description: t('inputs.maxProductsReached'),
        variant: 'destructive'
      });
      return;
    }
    addProduct();
    toast({
      title: t('inputs.productAdded'),
      description: t('inputs.productAddedDesc')
    });
  };
  
  const handleAddPrescriber = () => {
    if (settings.prescribers.length >= 5) {
      toast({
        title: t('common.maximumLimitReached'),
        description: t('inputs.maxPrescribersReached'),
        variant: 'destructive'
      });
      return;
    }
    addPrescriber();
    toast({
      title: t('inputs.prescriberAdded'),
      description: t('inputs.prescriberAddedDesc')
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('inputs.title')}</h1>
      
      {shareExceeds && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-md p-3 mb-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            {t('inputs.shareExceedsWarning')}
          </p>
        </div>
      )}
      
      <Accordion
        type="multiple"
        defaultValue={['products']}
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-4"
      >
        <AccordionItem value="products" className="border rounded-lg">
          <AccordionTrigger className="px-4">{t('inputs.products')}</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid gap-4">
              {settings.products.map((product, index) => (
                <Card key={product.id || index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        <Input 
                          value={product.name} 
                          onChange={(e) => updateProductField(index, 'name', e.target.value)}
                          className="font-bold text-lg border-none h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder={t('inputs.productName')}
                        />
                      </CardTitle>
                      
                      {settings.products.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeProduct(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`product-units-${index}`}>{t('inputs.units')}</Label>
                          <InfoTooltip id="product-units" />
                        </div>
                        <Input 
                          id={`product-units-${index}`}
                          type="number"
                          min={1}
                          value={product.units} 
                          onChange={(e) => updateProductField(index, 'units', Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`product-pricing-mode-${index}`}>{t('inputs.pricingMode')}</Label>
                          <InfoTooltip id="product-pricing-mode" />
                        </div>
                        <Select 
                          value={product.pricingMode} 
                          onValueChange={(value) => updateProductField(index, 'pricingMode', value)}
                        >
                          <SelectTrigger id={`product-pricing-mode-${index}`}>
                            <SelectValue placeholder={t('inputs.selectPricingMode')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">{t('inputs.daily')}</SelectItem>
                            <SelectItem value="monthly">{t('inputs.monthly')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {product.pricingMode === 'daily' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`product-price-per-day-${index}`}>{t('inputs.pricePerDay')}</Label>
                            <InfoTooltip id="product-price-per-day" />
                          </div>
                          <Input 
                            id={`product-price-per-day-${index}`}
                            type="number"
                            min={0}
                            step={0.01}
                            value={product.pricePerDay || 0} 
                            onChange={(e) => updateProductField(index, 'pricePerDay', Number(e.target.value))}
                          />
                        </div>
                      )}
                      
                      {product.pricingMode === 'monthly' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`product-price-per-month-${index}`}>{t('inputs.pricePerMonth')}</Label>
                            <InfoTooltip id="product-price-per-month" />
                          </div>
                          <Input 
                            id={`product-price-per-month-${index}`}
                            type="number"
                            min={0}
                            step={0.01}
                            value={product.pricePerMonth || 0} 
                            onChange={(e) => updateProductField(index, 'pricePerMonth', Number(e.target.value))}
                          />
                        </div>
                      )}
                      
                      {/* Only show minDays field if pricing mode is daily */}
                      {product.pricingMode === 'daily' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`product-min-days-${index}`}>{t('inputs.minDays')}</Label>
                            <InfoTooltip id="product-min-days" />
                          </div>
                          <Input 
                            id={`product-min-days-${index}`}
                            type="number"
                            min={1}
                            value={product.minDays} 
                            onChange={(e) => updateProductField(index, 'minDays', Number(e.target.value))}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`product-variable-cost-${index}`}>{t('inputs.variableCost')}</Label>
                          <InfoTooltip id="product-variable-cost" />
                        </div>
                        <Input 
                          id={`product-variable-cost-${index}`}
                          type="number"
                          min={0}
                          step={0.01}
                          value={product.variableCost} 
                          onChange={(e) => updateProductField(index, 'variableCost', Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`product-occupancy-${index}`}>{t('inputs.occupancy')}</Label>
                            <InfoTooltip id="product-occupancy" />
                          </div>
                          <span className="text-sm">{formatPercentage(product.occupancy)}</span>
                        </div>
                        <Slider
                          id={`product-occupancy-${index}`}
                          min={0}
                          max={1}
                          step={0.01}
                          value={[product.occupancy]}
                          onValueChange={([value]) => updateProductField(index, 'occupancy', value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                onClick={handleAddProduct} 
                className="flex items-center gap-2"
                disabled={settings.products.length >= 10}
              >
                <Plus size={16} /> {t('inputs.addProduct')}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="prescribers" className="border rounded-lg">
          <AccordionTrigger className="px-4">{t('inputs.prescribers')}</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid gap-4">
              {settings.prescribers.map((prescriber, index) => (
                <Card key={prescriber.id || index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        <Input 
                          value={prescriber.name} 
                          onChange={(e) => updatePrescriberField(index, 'name', e.target.value)}
                          className="font-bold text-lg border-none h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder={t('inputs.prescriberName')}
                        />
                      </CardTitle>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removePrescriber(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`prescriber-share-${index}`}>{t('inputs.share')}</Label>
                          <InfoTooltip id="prescriber-share" />
                        </div>
                        <span className="text-sm">{formatPercentage(prescriber.share)}</span>
                      </div>
                      <Slider
                        id={`prescriber-share-${index}`}
                        min={0}
                        max={1}
                        step={0.01}
                        value={[prescriber.share]}
                        onValueChange={([value]) => updatePrescriberField(index, 'share', value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`prescriber-commission-${index}`}>{t('inputs.commission')}</Label>
                          <InfoTooltip id="prescriber-commission" />
                        </div>
                        <span className="text-sm">{formatPercentage(prescriber.commission)}</span>
                      </div>
                      <Slider
                        id={`prescriber-commission-${index}`}
                        min={0}
                        max={1}
                        step={0.01}
                        value={[prescriber.commission]}
                        onValueChange={([value]) => updatePrescriberField(index, 'commission', value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                onClick={handleAddPrescriber} 
                className="flex items-center gap-2"
                disabled={settings.prescribers.length >= 10}
              >
                <Plus size={16} /> {t('inputs.addPrescriber')}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="structural" className="border rounded-lg">
          <AccordionTrigger className="px-4">{t('inputs.structural')}</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="employees">{t('inputs.employees')}</Label>
                  <InfoTooltip id="employees" />
                </div>
                <Input 
                  id="employees"
                  type="number"
                  min={0}
                  value={settings.employees} 
                  onChange={(e) => updateSettings({ employees: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="salary">{t('inputs.salary')}</Label>
                  <InfoTooltip id="salary" />
                </div>
                <Input 
                  id="salary"
                  type="number"
                  min={0}
                  step={1000}
                  value={settings.salary} 
                  onChange={(e) => updateSettings({ salary: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="infra-cost">{t('inputs.infraCost')}</Label>
                  <InfoTooltip id="infra-cost" />
                </div>
                <Input 
                  id="infra-cost"
                  type="number"
                  min={0}
                  step={1000}
                  value={settings.infraCost} 
                  onChange={(e) => updateSettings({ infraCost: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="web-maint">{t('inputs.webMaint')}</Label>
                  <InfoTooltip id="web-maint" />
                </div>
                <Input 
                  id="web-maint"
                  type="number"
                  min={0}
                  step={1000}
                  value={settings.webMaint} 
                  onChange={(e) => updateSettings({ webMaint: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="director-commission">{t('inputs.directorCommission')}</Label>
                    <InfoTooltip id="director-commission" />
                  </div>
                  <span className="text-sm">{formatPercentage(settings.directorCommission)}</span>
                </div>
                <Slider
                  id="director-commission"
                  min={0}
                  max={0.3}
                  step={0.01}
                  value={[settings.directorCommission]}
                  onValueChange={([value]) => updateSettings({ directorCommission: value })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="marketing" className="border rounded-lg">
          <AccordionTrigger className="px-4">{t('inputs.marketing')}</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="marketing-spend">{t('inputs.marketingSpend')}</Label>
                  <InfoTooltip id="marketing-spend" />
                </div>
                <Input 
                  id="marketing-spend"
                  type="number"
                  min={0}
                  step={1000}
                  value={settings.marketingSpend} 
                  onChange={(e) => updateSettings({ marketingSpend: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="new-customers">{t('inputs.newCustomers')}</Label>
                  <InfoTooltip id="new-customers" />
                </div>
                <Input 
                  id="new-customers"
                  type="number"
                  min={0}
                  value={settings.newCustomers} 
                  onChange={(e) => updateSettings({ newCustomers: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="rentals-per-customer">{t('inputs.rentalsPerCustomer')}</Label>
                  <InfoTooltip id="rentals-per-customer" />
                </div>
                <Input 
                  id="rentals-per-customer"
                  type="number"
                  min={0}
                  step={0.1}
                  value={settings.rentalsPerCustomer} 
                  onChange={(e) => updateSettings({ rentalsPerCustomer: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="churn">{t('inputs.churn')}</Label>
                    <InfoTooltip id="churn" />
                  </div>
                  <span className="text-sm">{formatPercentage(settings.churn)}</span>
                </div>
                <Slider
                  id="churn"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.churn]}
                  onValueChange={([value]) => updateSettings({ churn: value })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="globals" className="border rounded-lg">
          <AccordionTrigger className="px-4">{t('inputs.globals')}</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="growth">{t('inputs.growth')}</Label>
                    <InfoTooltip id="growth" />
                  </div>
                  <span className="text-sm">{formatPercentage(settings.growth)}</span>
                </div>
                <Slider
                  id="growth"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[settings.growth]}
                  onValueChange={([value]) => updateSettings({ growth: value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="inflation">{t('inputs.inflation')}</Label>
                    <InfoTooltip id="inflation" />
                  </div>
                  <span className="text-sm">{formatPercentage(settings.inflation)}</span>
                </div>
                <Slider
                  id="inflation"
                  min={0}
                  max={0.1}
                  step={0.005}
                  value={[settings.inflation]}
                  onValueChange={([value]) => updateSettings({ inflation: value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="forecast-years">{t('inputs.forecastYears')}</Label>
                  <InfoTooltip id="forecast-years" />
                </div>
                <Select 
                  value={String(settings.forecastYears)} 
                  onValueChange={(value) => updateSettings({ forecastYears: Number(value) })}
                >
                  <SelectTrigger id="forecast-years">
                    <SelectValue placeholder={t('inputs.forecastYears')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 {t('common.yearForecast')}</SelectItem>
                    <SelectItem value="4">4 {t('common.yearForecast')}</SelectItem>
                    <SelectItem value="5">5 {t('common.yearForecast')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="discount-rate">{t('inputs.discountRate')}</Label>
                    <InfoTooltip id="discount-rate" />
                  </div>
                  <span className="text-sm">{formatPercentage(settings.discountRate)}</span>
                </div>
                <Slider
                  id="discount-rate"
                  min={0.01}
                  max={0.3}
                  step={0.01}
                  value={[settings.discountRate]}
                  onValueChange={([value]) => updateSettings({ discountRate: value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="initial-investment">{t('inputs.initialInvestment')}</Label>
                  <InfoTooltip id="initial-investment" />
                </div>
                <Input 
                  id="initial-investment"
                  type="number"
                  min={0}
                  step={1000}
                  value={settings.initialInvestment} 
                  onChange={(e) => updateSettings({ initialInvestment: Number(e.target.value) })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InputsPage;
