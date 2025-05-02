
import { TooltipContent } from './types';

export const tooltips: TooltipContent = {
  // KPI tooltips
  "irr": "Tasa Interna de Retorno; compara con WACC para decidir si crea valor.",
  "npv": "Valor Presente Neto descontando los flujos con la tasa WACC.",
  "discountRate": "Coste Medio Ponderado de Capital (WACC); usado para VAN y como referencia de TIR.",
  "ltvCac": "LTV/CAC > 3 indica un buen modelo de negocio.",
  "cac": "Coste de Adquisición de Cliente = marketing / nuevos clientes.",
  "ltv": "Valor del Ciclo de Vida del Cliente = ingresos por cliente a lo largo de su vida.",
  "payback": "Tiempo para recuperar el CAC. Ideal < 12 meses.",
  "breakeven": "Punto donde los ingresos igualan a los costes totales.",
  
  // Product tooltips
  "product-units": "Número de máquinas disponibles para alquiler.",
  "product-pricing-mode": "Elige 'diario' para precio por día o 'mensual' para precio por mes.",
  "product-price-per-day": "Tarifa de alquiler (IVA excl.). Ejemplo: €5 /día.",
  "product-price-per-month": "Tarifa de alquiler (IVA excl.). Ejemplo: €1.000 /mes.",
  "product-min-days": "Duración mínima de alquiler. Por defecto 15 días. Ajustar para equipos más grandes si es necesario.",
  "product-variable-cost": "Coste directo por alquiler: consumibles, envío, limpieza, etc.",
  "product-occupancy": "Porcentaje medio de tiempo que la máquina está alquilada (0-100%).",
  
  // Prescriber tooltips
  "prescriber-commission": "Porcentaje de ingresos pagados al prescriptor. Puede ser 0%.",
  
  // Structural tooltips
  "employees": "Personal a tiempo completo en nómina.",
  "salary": "Coste anual total por empleado (salario bruto + impuestos).",
  "infra-cost": "Costes anuales de infraestructura: almacén, oficina, seguros.",
  "web-maint": "Coste anual para mantener la plataforma web/app.",
  
  // Marketing tooltips
  "marketing-spend": "Presupuesto anual de marketing y ventas (anuncios, eventos, etc.).",
  "new-customers": "Nuevos clientes estimados cada año.",
  "rentals-per-customer": "Total de alquileres que se espera que haga un cliente durante su vida útil.",
  "churn": "Porcentaje de clientes que dejan de alquilar cada año (menor = mejor retención).",
  
  // Global tooltips
  "growth": "Tasa de crecimiento anual aplicada a la demanda (unidades alquiladas).",
  "inflation": "Aumento anual aplicado a los costes (salarios, costes variables, etc.).",
  "forecast-years": "Horizonte de proyección en años (3-5).",
  "discount-rate": "Coste Medio Ponderado de Capital. Usado para descontar flujos en cálculos de VAN/TIR."
};
