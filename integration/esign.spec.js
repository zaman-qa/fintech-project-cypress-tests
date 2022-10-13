import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Esign', () => {
  let sharedData = new sharedContent()
  let loginMethods = new loginMethod()

  before(() => loginMethods.login())

  beforeEach(() => {
    sharedData.preserveCookies()
    cy.visit('/yousign')
  })

  after(() => loginMethods.logout())

  it('Yousign page is accessible or not', () => {
    cy.url().should('contains', '/yousign')
    cy.get('.app-main-heading').contains('Plan Documents').should('exist')
  })

  sharedData.exceptionHandling()

})
