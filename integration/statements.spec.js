import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Statements', () => {
  let sharedData = new sharedContent()
  let loginMethods = new loginMethod()

  let planName = 'Cypress Test ' + sharedData.randomString(2)
  let startDate = sharedData.startDate()
  let endDate = sharedData.endDate()

  before(() => loginMethods.login())

  beforeEach(() => sharedData.preserveCookies())

  after(() => loginMethods.logout())


  it('Should create new Payees successfully before processing statements', () => {
    sharedData.createPayees(3)
  })

  it('Should create a plan successfully for statements', () => {
    cy.visit('/plans/new')
    cy.get('#plan-name').type(planName)
    cy.get('#start-date-picker').type(startDate, { force: true })
    cy.get('#end-date-picker').type(endDate, { force: true })
    cy.get('.next-button').contains('Next').click()
    cy.get('#select-payee-1').click({ force: true })
    cy.get('#plan-submit-button').click()
  })


  it('Downloading statement in success case', () => {
    cy.visit('/statements')
    cy.wait(500)
    cy.get('#download-button').click()
    cy.url().should('contains', '/downloads')
    cy.get('#download-count').invoke('text').then((previousDownloadCount) => {
      cy.visit('/statements')
      cy.get('#inactive-plans-check').click()
      cy.get('.ss-values').first().click()
      cy.get('.ss-option').eq(0).click({ force: true })
      cy.get('#custom-select').select('Custom')
      cy.get('#start-date').type(startDate + '{enter}', { force: true }).should('have.value', startDate)
      cy.get('#end-date').clear({ force: true }).type(endDate + '{enter}', { force: true }).should('have.value', endDate)
      cy.get('.ss-multi-selected > .ss-values').last().click()
      cy.get('.ss-content').last().click()
      cy.get('#download-statements-link').click()
      cy.url().should('contains', '/statements')
      cy.get('#download-button').click()
      cy.url().should('contains', '/downloads')

      cy.get('#download-count', { timeout: 3000 }).invoke('text').then((newDownloadCount) => {
        expect(previousDownloadCount).to.equal(newDownloadCount)
      })
    })
  })

  it('Verifies input fields/filters are working fine', () => {
    cy.visit('/statements')
    cy.get('#inactive-plans-check').click()
    cy.get('.plan-multiselect').last().click()
      .get('.ss-list > .ss-option').first().click()
    cy.get('.ss-value-delete').last().click()
    cy.get('#custom-select').select('Custom')
    cy.get('#start-date').type(startDate + '{enter}', { force: true }).should('have.value', startDate)
    cy.get('#end-date').clear({ force: true }).type(endDate + '{enter}', { force: true }).should('have.value', endDate)
    cy.get('.payees-multiselect').last().click()
      .get('.ss-option').last().click()
    cy.get('.ss-value-delete').last().click()
  })

  it('Accessibility of Search box filters', () => {
    cy.visit('/statements')
    cy.get('.ss-values').first().click()
    cy.get('input[type="search"]').first().type('a').should('have.value', 'a')
    cy.get('.ss-option').eq(0).click()
    cy.get('.ss-multi-selected > .ss-values').last().click()
    cy.get('input[type="search"]').last().type('g').should('have.value', 'g')
  })

  it('Should validate Custom Date when end-date is less than start-date', () => {
    cy.visit('/statements')
    cy.get('#custom-select').select('Custom')
    cy.get('#start-date').type(endDate + '{enter}', { force: true }).should('have.value', endDate)
    cy.get('#end-date').clear({ force: true }).type(startDate + '{enter}', { force: true }).should('have.value', startDate)
    cy.get('#start-date').should('have.value', startDate)
  })

  it('Should View Statement for single payee in a single plan', () => {
    cy.visit('/statements')
    cy.get('#inactive-plans-check').click({ force: true })
    cy.get('.plan-multiselect').last().click()
      .get('.ss-list > .ss-option').first().click()
    cy.get('.payees-multiselect').last().click()
      .get('.ss-option').last().click()
    cy.get('#view-statements-link').should('be.visible').click()
    cy.url().should('include', '/statements/view')
  })

  sharedData.exceptionHandling()
})
