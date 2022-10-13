import loginMethods from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Login', () => {
  let util
  let sharedData = new sharedContent()

  before(() => util = new loginMethods())

  beforeEach(() => cy.visit('/'))

  it('Shouldn\'t Log in with invalid credentials', () => {
    cy.get('#user_email').type('wrong_email@concertfinance.com')
    cy.get('#user_password').type('worng_Password1234$')
    cy.get('#login-btn').click()
    cy.get('.alert').contains('Invalid Email or password.').should('exist')
    cy.url().should('include', '/users/sign_in')
  })

  it('Shouldn\'t allow login when admin enters invalid username and valid password', () => {
    cy.get('#user_email').type('wrong_email@concertfinance.com')
    cy.get('#user_password').type('Password1234$')
    cy.get('#login-btn').click()
    cy.get('.alert').contains('Invalid Email or password.').should('exist')
    cy.url().should('include', '/users/sign_in')
  })

  it('Shouldn\'t allow login when user enters valid username and invalid password', () => {
    cy.get('#user_email').type('usman@concertfinance.com')
    cy.get('#user_password').type('wrong_password123')
    cy.get('#login-btn').click()
    cy.get('.alert').contains('Invalid Email or password.').should('exist')
    cy.url().should('include', '/users/sign_in')
  })

  it('Should check remember me checkbox', () => {
    cy.get('#user_remember_me').check().should('be.checked')
  })

  it('Should check back to login functionality', () => {
    cy.get('#forgot-password').click()
    cy.url().should('include', '/users/password/new')
    cy.get('#back-to-login').click()
    cy.url().should('include', '/users/sign_in')
  })

  it('Should Log in with valid credentials', () => {
    util.login()
  })

  sharedData.exceptionHandling()
})
