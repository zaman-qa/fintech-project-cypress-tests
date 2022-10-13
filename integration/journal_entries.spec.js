import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Journal Entries', () => {
  let loginMethods = new loginMethod()
  let sharedData = new sharedContent()

  before(() => loginMethods.login())

  beforeEach(() => new sharedContent().preserveCookies())

  after(() => loginMethods.logout())

  let startDate = new sharedContent().startDate()
  let endDate = new sharedContent().endDate()

  it('Should visit Journal entries page', () => {
    visit_general_entries()
  })

  it('Should not allow to Download record if date range is not given', () => {
    visit_general_entries()
    cy.get('#download-journals-btn').should('be.visible').click()
    cy.get('[data-notify="title"]').contains('Failed')
  })

  it('Should Download record for a specific plan and specific component in a date range', () => {
    visit_general_entries()
    cy.get('#journal-start-date').clear({ force: true }).type(startDate + `{enter}`, { force: true }).should('have.value', startDate)
    cy.get('#journal-end-date').clear({ force: true }).type(endDate + `{enter}`, { force: true }).should('have.value', endDate)
    cy.get('#download-journals-btn').should('be.visible').click()
    cy.get('[data-notify="title"]').contains('Success')
  })

  it('Verifies that all filters are working well', () => {
    visit_general_entries()
    cy.get('#journal-plan-select > option').last().then(plan =>
      cy.get('#journal-plan-select').select(plan.val(), { force: true })
    )
    cy.wait(1000)
    cy.get('#journal-component-select > option').last().then(component =>
      cy.get('#journal-component-select').select(component.val())
    )
    cy.get('#journal-start-date').clear({ force: true }).type(startDate + `{enter}`, { force: true }).should('have.value', startDate)
    cy.get('#journal-end-date').clear({ force: true }).type(endDate + `{enter}`, { force: true }).should('have.value', endDate)
    cy.get('#journal-summary-data_wrapper').should('be.visible')
  })

  sharedData.exceptionHandling()
})

function visit_general_entries() {
  cy.wait(1000)
  cy.get('.icon-reports').click()
  cy.get('#general-entries').click()
  cy.url().should('contain', '/journals')
  cy.wait(1000)
}
