
describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show the product input summary table', () => {
    // Wait for the page to load and data to be calculated
    cy.wait(2000);
    
    // Check if summary table exists
    cy.contains('Input Summary').should('be.visible');
    cy.contains('Summary of products and prescribers configuration').should('be.visible');
    
    // Check table headers
    cy.contains('Name').should('be.visible');
    cy.contains('Units').should('be.visible');
    cy.contains('Price').should('be.visible');
    cy.contains('Occupancy').should('be.visible');
    cy.contains('Variable Cost').should('be.visible');
    cy.contains('Min Days').should('be.visible');
    
    // Check prescribers section
    cy.contains('Prescribers').should('be.visible');
    cy.contains('Revenue Share').should('be.visible');
    cy.contains('Commission').should('be.visible');
  });

  it('should translate UI when language is changed', () => {
    // First check the default language (Spanish)
    cy.contains('Dashboard Financiero').should('be.visible');
    cy.contains('Flujo de Caja').should('be.visible');
    
    // Change language to English using the language selector
    cy.get('[data-testid="language-selector"]').click();
    cy.contains('English').click();
    
    // Check that UI is translated to English
    cy.contains('Financial Dashboard').should('be.visible');
    cy.contains('Cash Flow').should('be.visible');
    
    // Change back to Spanish
    cy.get('[data-testid="language-selector"]').click();
    cy.contains('Español').click();
    
    // Check that UI is translated back to Spanish
    cy.contains('Dashboard Financiero').should('be.visible');
    cy.contains('Flujo de Caja').should('be.visible');
  });
});
