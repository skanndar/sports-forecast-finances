
import { useState } from 'react';
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
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Info, Plus, Trash } from "lucide-react";
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { tooltips } from '@/lib/tooltips';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Product } from '@/lib/types';

const InputsPage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['products']);
  const { activeScenario, updateProductField, updatePrescriberField, updateSettings, addProduct, removeProduct, addPrescriber, removePrescriber } = useAppStore();
  const { toast } = useToast();
  const { settings } = activeScenario;
  
  const handleAddProduct = () => {
    if (settings.products.length >= 5) {
      toast({
        title: 'Maximum limit reached',
        description: 'You can add up to 5 products.',
        variant: 'destructive'
      });
      return;
    }
    addProduct();
    toast({
      title: 'Product added',
      description: 'A new product has been added to your scenario.'
    });
  };
  
  const handleAddPrescriber = () => {
    if (settings.prescribers.length >= 5) {
      toast({
        title: 'Maximum limit reached',
        description: 'You can add up to 5 prescribers.',
        variant: 'destructive'
      });
      return;
    }
    addPrescriber();
    toast({
      title: 'Prescriber added',
      description: 'A new prescriber has been added to your scenario.'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Financial Inputs</h1>
      
      <Accordion
        type="multiple"
        defaultValue={['products']}
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-4"
      >
        <AccordionItem value="products" className="border rounded-lg">
          <AccordionTrigger className="px-4">Products</AccordionTrigger>
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
                          placeholder="Product Name"
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
                          <Label htmlFor={`product-units-${index}`}>Units</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>{tooltips["product-units"]}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                          <Label htmlFor={`product-pricing-mode-${index}`}>Pricing Mode</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>{tooltips["product-pricing-mode"]}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select 
                          value={product.pricingMode} 
                          onValueChange={(value) => updateProductField(index, 'pricingMode', value)}
                        >
                          <SelectTrigger id={`product-pricing-mode-${index}`}>
                            <SelectValue placeholder="Select pricing mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {product.pricingMode === 'daily' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`product-price-per-day-${index}`}>Price Per Day</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={14} className="text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>{tooltips["product-price-per-day"]}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                            <Label htmlFor={`product-price-per-month-${index}`}>Price Per Month</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={14} className="text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>{tooltips["product-price-per-month"]}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`product-min-days-${index}`}>Minimum Days</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>{tooltips["product-min-days"]}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input 
                          id={`product-min-days-${index}`}
                          type="number"
                          min={1}
                          value={product.minDays} 
                          onChange={(e) => updateProductField(index, 'minDays', Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`product-variable-cost-${index}`}>Variable Cost</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>{tooltips["product-variable-cost"]}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                            <Label htmlFor={`product-occupancy-${index}`}>Occupancy</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={14} className="text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>{tooltips["product-occupancy"]}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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
                disabled={settings.products.length >= 5}
              >
                <Plus size={16} /> Add Product
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="prescribers" className="border rounded-lg">
          <AccordionTrigger className="px-4">Prescribers</AccordionTrigger>
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
                          placeholder="Prescriber Name"
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
                          <Label htmlFor={`prescriber-commission-${index}`}>Commission</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info size={14} className="text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>{tooltips["prescriber-commission"]}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                disabled={settings.prescribers.length >= 5}
              >
                <Plus size={16} /> Add Prescriber
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="structural" className="border rounded-lg">
          <AccordionTrigger className="px-4">Structural Costs</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="employees">Employees</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["employees"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Label htmlFor="salary">Salary (per employee)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["salary"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Label htmlFor="infra-cost">Infrastructure Cost (yearly)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["infra-cost"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Label htmlFor="web-maint">Web/App Maintenance (yearly)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["web-maint"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="marketing" className="border rounded-lg">
          <AccordionTrigger className="px-4">Marketing & Retention</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="marketing-spend">Marketing Spend (yearly)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["marketing-spend"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Label htmlFor="new-customers">New Customers (yearly)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["new-customers"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  <Label htmlFor="rentals-per-customer">Rentals Per Customer</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["rentals-per-customer"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                    <Label htmlFor="churn">Churn Rate</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>{tooltips["churn"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
          <AccordionTrigger className="px-4">Global Settings</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="growth">Growth Rate</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>{tooltips["growth"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm">{formatPercentage(settings.growth)}</span>
                </div>
                <Slider
                  id="growth"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={[settings.growth]}
                  onValueChange={([value]) => updateSettings({ growth: value })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="inflation">Inflation Rate</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>{tooltips["inflation"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                  <Label htmlFor="forecast-years">Forecast Years</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>{tooltips["forecast-years"]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select 
                  value={String(settings.forecastYears)} 
                  onValueChange={(value) => updateSettings({ forecastYears: Number(value) })}
                >
                  <SelectTrigger id="forecast-years">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="4">4 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="discount-rate">Discount Rate (WACC)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>{tooltips["discount-rate"]}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InputsPage;
