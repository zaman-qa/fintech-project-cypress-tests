export default class Main {
  randomString(length_of_word) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    for (let index = 0; index < length_of_word; index++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }

  startDate() {
    return '01/01/' + new Date().getFullYear()
  }

  endDate() {
    return '12/31/' + new Date().getFullYear()
  }

  currentDate() {
    let currentDate = new Date()
    let month =  currentDate.getMonth() + 1
    month = month < 10 ? '0' + month : month
    let day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
    let year = new Date().getFullYear()
    return month + '/' + day + '/' + year
  }

  preserveCookies() {
    cy.getCookies().then(cookies => {
      const namesOfCookies = cookies.map(c => c.name)
      Cypress.Cookies.preserveOnce(...namesOfCookies)
    })
  }

  goToPlans(planName) {
    cy.visit('/plans')
    cy.get('td').contains(planName).last().click()
  }

  goToUsers() {
    cy.visit('/users')
  }

  goToDataTables() {
    cy.visit('/data')
  }

  createPayees(number_of_payees) {
    let count = 0
    while (count++ < number_of_payees) {
      cy.visit('users/new')
      cy.get('#first-name').type('NewPayee')
      cy.get('#last-name').type(this.randomString(3))
      cy.get('#user_email').type('test_' + this.randomString(4) + '@email.com')
      cy.get('#user_employee_id').type(this.randomString(3))
      cy.get('#user_entity').select('1')
      cy.get('#user_currency_id').select('3')
      cy.get('#user_role_id').select('Payee')
      cy.get('#submit-user').click({ force: true })
      cy.get('[data-notify="message"]', { timeout: 3000 }).contains('User successfully added to the company!').should('exist')
    }
  }

  exceptionHandling() {
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      return false
    })
  }
}
