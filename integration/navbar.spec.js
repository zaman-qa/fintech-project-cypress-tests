import loginMethods from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Navbar', () => {
  before(() => new loginMethods().login())

  beforeEach(() => {
    new sharedContent().preserveCookies()
    cy.visit('/dashboard')
  })

  it('Should open Dashboard', () => {
    cy.get('#navbar-logo').should('exist').click()
    cy.url().should('contain', '/dashboard')
  })

  it('Should open Downloads page', () => {
    cy.get('#download-button').should('contain', 'Downloads').click()
    cy.url().should('contain', '/downloads')
  })

  it('Should open Notification Panel', () => {
    cy.get('#notification-button').should('be.visible').click()
    cy.get('#clear-all-notifications').should('be.visible').click()
    cy.get('#notification-button').should('be.visible').click()
    cy.get('#notification-dropdown').contains('No Notifications Yet!')
  })

  it('Should open Notification page', () => {
    cy.get('#notification-button').should('be.visible').click()
    cy.get('#view-details').should('contain', 'View Details').click()
    cy.url().should('contain', '/notifications')
  })


  it('Should open full screen', () => {
    cy.get('#fullScreenButton').should('be.visible').click({ force: true })
  })

  it('Should Sign Out Successfully', () => {
    cy.get('.sign-out-link').click({ force: true })
    cy.url().should('include', '/users/sign_in')
  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  })
})
