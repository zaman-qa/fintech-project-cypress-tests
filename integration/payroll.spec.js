import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Payroll', () => {
  let sharedData = new sharedContent()
  let planName = 'Payroll Test' + sharedData.randomString(2)
  let startDate = sharedData.startDate()
  let endDate = sharedData.endDate()

  before(() => new loginMethod().login())

  beforeEach(() => {
    new sharedContent().preserveCookies()
    cy.visit('/payroll')
  })

  context('Payroll', () => {
    it('Should create users for plan creation', () => {
      sharedData.createPayees(3)
    })

    it('Should create a plan successfully', () => {
      cy.visit('/plans/new')
      cy.get('#plan-name').type(planName)
      cy.get('#start-date-picker').type(startDate, { force: true })
      cy.get('#end-date-picker').type(endDate, { force: true })
      cy.get('.next-button').contains('Next').click()
      cy.get('#select-payee-1').click({ force: true })
      cy.get('#plan-submit-button').click()
    })

    it('Should Load payroll data successfully', () => {
      cy.get('#payroll-table tbody').children('tr').then(($row) => {
        expect($row.length).to.greaterThan(0)
      })
    })
  })
})
