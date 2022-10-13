import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Users', () => {
  let sharedData = new sharedContent()
  let loginMethods = new loginMethod()
  let startDate = sharedData.startDate()
  let endDate = sharedData.endDate()

  before(() => loginMethods.login())

  beforeEach(() => {
    sharedData.preserveCookies()
    cy.visit('/users')
  })

  after(() => loginMethods.logout())

  it('Users page is accessible or not', () => {
    cy.url().should('contains', '/users')
    cy.get('.app-main-heading').contains('Users').should('exist')
  })

  it('Should create new Payee successfully', () => {
    sharedData.createPayees(1)
  })

  it('Should create new Admin successfully', () => {
    cy.get('#add-user-btn').click()
    cy.get('#first-name').type('NewAdmin')
    cy.get('#last-name').type(sharedData.randomString(3))
    cy.get('#user_email').type('test_' + sharedData.randomString(4) + '@email.com')
    cy.get('#user_employee_id').type(sharedData.randomString(3))
    cy.get('#user_entity').select('1')
    cy.get('#user_currency_id').select('3')
    cy.get('#user_role_id').select('Admin')
    cy.get('#submit-user').click()
    cy.get('[data-notify="message"]').contains('User successfully added to the company!').should('exist')
  })

  it('Should create new Auditor successfully', () => {
    cy.get('#add-user-btn').click()
    cy.get('#first-name').type('NewAuditor')
    cy.get('#last-name').type(sharedData.randomString(3))
    cy.get('#user_email').type('test_' + sharedData.randomString(4) + '@email.com')
    cy.get('#user_employee_id').type(sharedData.randomString(3))
    cy.get('#user_entity').select('1')
    cy.get('#user_currency_id').select('3')
    cy.get('#user_role_id').select('Auditor')
    cy.get('#submit-user').click()
    cy.get('[data-notify="message"]').contains('User successfully added to the company!').should('exist')
  })

  it('Should create user only when first and last name are atleast two characters long', () => {
    cy.get('#add-user-btn').click()
    cy.get('#first-name').type('n')
    cy.get('#last-name').type('a')
    cy.get('#user_email').type('test_email' + '@email.com')
    cy.get('#user_employee_id').type('ID-123')
    cy.get('#user_entity').select('1')
    cy.get('#user_currency_id').select('3')
    cy.get('#user_role_id').select('Admin')
    cy.get('#submit-user').click()
    cy.wait(2000)
    cy.url().should('contains', 'users/new')
  })

  it('Last Name must not be empty', () => {
    cy.get('#add-user-btn').click()
    cy.get('#first-name').type('n')
    cy.get('#user_email').type('test_email' + '@email.com')
    cy.get('#user_employee_id').type('123')
    cy.get('#user_entity').select('1')
    cy.get('#user_currency_id').select('3')
    cy.get('#user_role_id').select('Admin')
    cy.get('#last-name').required = false
    cy.get('#submit-user').click()
    cy.wait(2000)
    cy.url().should('contains', 'users/new')
  })

  it('Should create users through file upload', () => {
    cy.visit('/users')
    cy.get('#import-users-btn').click()
    cy.get('#file').attachFile('users data file.xlsx')
    cy.get('.upload-button').click()
    cy.get('.alert-success').contains('Successfully Created').should('exist')
  })

  it('Should not upload file when empty file is given', () => {
    cy.get('#import-users-btn').click()
    cy.get('#file').attachFile('empty users data file.xlsx')
    cy.get('.upload-button').click()
    cy.get('[data-notify="message"]').contains('File is empty')
  })

  it('Should show user statistics correctly on user index page', () => {
    cy.get('#users-index').then(($user_data) => {
      let table_data = $user_data.find('tbody')
      let total_users = table_data.find('.user-name').length
      let activeAdmin = 0
      let inactiveAdmin = 0
      let activePayee = 0
      let inactivePayee = 0
      let activeAuditor = 0
      let inactiveAuditor = 0
      for (let i = 0; i < total_users; i++) {
        if (table_data.find('.role')[i].innerText === 'Admin') {
          if (table_data.find('.status')[i].innerText === 'Active') activeAdmin++
          else inactiveAdmin++
        }
        else if (table_data.find('.role')[i].innerText === 'Payee') {
          if (table_data.find('.status')[i].innerText === 'Active') activePayee++
          else inactivePayee++
        }
        else {
          if (table_data.find('.status')[i].innerText === 'Active') activeAuditor++
          else inactiveAuditor++
        }
      }

      const ExpectedCount = [total_users, activeAdmin, activeAuditor, activePayee, inactiveAdmin, inactiveAuditor, inactivePayee]

      cy.get('.statistics-table').then(($counted_details) => {
        for (let i = 0; i < 7; i++) {
          expect(parseInt($counted_details.find('td')[i].innerText)).to.equal(ExpectedCount[i])
        }
      })
    })
  })

  sharedData.exceptionHandling()
})
