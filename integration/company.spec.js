import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Company', () => {
  let loginMethods = new loginMethod()
  let sharedData = new sharedContent()

  before(() => loginMethods.login())

  beforeEach(() => {
    new sharedContent().preserveCookies()
    cy.visit('/companies/new')
  })

  after(() => loginMethods.logout())

  it('Should create company successfully', () => {
    let sharedData = new sharedContent()

    cy.get('#company-name').type('company_' + sharedData.randomString(3))
    cy.get('#user_first_name').type('user_' + sharedData.randomString(4))
    cy.get('#user_last_name').type(sharedData.randomString(4))
    cy.get('#user_email').type(sharedData.randomString(6) + '@concertfinance.com')
    cy.get('#user_password').type('Password1234*')
    cy.get('#company-home-currency').select('GBP', { force: true })
    cy.get('#company_time_zone').select('(GMT+05:00) Islamabad', { force: true })
    cy.get('#company_terms_of_service').check()
    cy.get('#company-logo').attachFile('company_avatar.png')
    cy.get('#create-company-button').click()
    cy.get('[data-notify="message"]', { timeout: 6000 }).contains('Company created successfully')
  })

  sharedData.exceptionHandling()
})
