
import html2pdf from 'html2pdf.js';

export const usePdfGenerator = () => {
  const generatePdf = async (elementId: string, filename: string) => {
    try {
      const element = document.getElementById(elementId);
      
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }
      
      // Ensure all content is expanded before generating the PDF
      const collapsibleContents = element.querySelectorAll('[data-state="closed"]');
      collapsibleContents.forEach((content) => {
        // @ts-ignore - Force set attribute to open state
        content.setAttribute('data-state', 'open');
      });
      
      // Expand all tooltips for printing
      const tooltips = element.querySelectorAll('[data-radix-tooltip-trigger]');
      tooltips.forEach((tooltip) => {
        // Make tooltips visible in print mode without requiring hover
        tooltip.setAttribute('data-print-visible', 'true');
      });

      // PDF generation options optimized to prevent content cutting
      const options = {
        filename: filename,
        margin: [15, 15, 15, 15], // 15mm margins on all sides
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: true,
          letterRendering: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait', // Portrait mode for better fit
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after'
        }
      };

      // Generate PDF
      await html2pdf()
        .from(element)
        .set(options)
        .save();
        
      return true;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  };

  return { generatePdf };
};
