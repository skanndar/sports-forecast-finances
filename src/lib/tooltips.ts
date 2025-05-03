
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
  "prescriber-share": "Porcentaje de ingresos totales atribuidos a este prescriptor.",
  "prescriber-commission": "Porcentaje de ingresos pagados al prescriptor. Puede ser 0%.",
  
  // Director commission tooltip
  "director-commission": "Porcentaje sobre la facturación total que cobra el Director.",
  
  // Investment tooltip
  "initial-investment": "Inversión inicial necesaria para arrancar el negocio (capex, stock de máquinas, licencias...). Se descuenta en el año 0 para el cálculo de IRR y NPV.",
  
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
  
  // Detailed table tooltips
  "total-revenue": "Suma de ingresos de todos los productos.",
  "product-costs": "Costes variables asociados directamente con el alquiler de productos.",
  "prescriber-commissions": "Comisiones pagadas a prescriptores (% sobre su parte de ingresos atribuidos).",
  "director-costs": "Comisión pagada al Director (% sobre la facturación total).",
  "total-variable-costs": "Suma de todos los costes variables (productos, comisiones prescriptores, comisión director).",
  "gross-margin": "Ingresos - Costes Variables. Representa el margen después de costes directos.",
  "structural-costs": "Costes fijos y de estructura (empleados, infraestructura, web, etc.).",
  "ebitda-detail": "Beneficio antes de intereses, impuestos, depreciaciones y amortizaciones.",
  "capex": "Inversión inicial (capex) necesaria para comenzar el negocio.",
  "operating-cash-flow": "Flujo operativo generado por el negocio (simplificado como EBITDA en este modelo).",
  "net-cash-flow": "Flujo de caja después de considerar la inversión inicial y otras inversiones.",
  "cumulative-cash-flow": "Suma acumulada de los flujos de caja netos hasta cada año.",
  
  // PDF generation
  "financial_detail": "Proyecciones financieras detalladas",
  "sensitivity": "Análisis de sensibilidad",
  "download_investor_packet": "Descargar paquete inversor (PDF)",
  
  // Additional tooltips for new features
  "revenue": "Ingresos totales generados por todos los productos.",
  "ebitda": "Beneficio antes de intereses, impuestos, depreciaciones y amortizaciones."
};
