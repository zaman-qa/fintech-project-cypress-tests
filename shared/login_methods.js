export default class LoginMethod {
  email_input = 'input[type=email]'
  password_input = 'input[type=password]'
  email = 'usman@concertfinance.com'
  password = 'Password1234$'
  login_btn = '#login-btn'
  sign_in_route = '/users/sign_in'
  dashboard_route = '/'
  new_password_route = '/users/password/new'
  forgot_password_id = '#forgot-password'
  back_to_login_id = '#back-to-login'

  login() {
    let util = new LoginMethod()
    cy.visit(util.dashboard_route)
    cy.get(util.email_input).type(util.email)
    cy.get(util.password_input).type(util.password, { sensitive: true })
    cy.get(util.login_btn).click()
    cy.get('.notice').contains('Signed in Successfully').should('exist')
    cy.wait(1000)
  }

  logout() {
    cy.get('.sign-out-link').click({ force: true })
    cy.url().should('include', '/users/sign_in')
  }
}
