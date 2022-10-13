import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Sidebar', () => {
  let loginMethods = new loginMethod()
  let sharedData = new sharedContent()
  let currentDate = new sharedContent().currentDate()

  before(() => loginMethods.login())

  beforeEach(() => {
    sharedData.preserveCookies()
    cy.visit('/')
  })

  after(() => loginMethods.logout())

  context('Database', () => {
    it('should create feature flag', () => {
      let insertQuery = `INSERT INTO feature_flags (display_name, flag_name, sub_domain, created_at, updated_at)
                         VALUES ('Inquiries', 'inquiries', 'public', '${currentDate}', '${currentDate}')`

      cy.task('DATABASE', {
        dbConfig: Cypress.env('DB'),
        sql: insertQuery
      })
    })
  })

  context('Inquiries notifications', () => {
    before(() => {
      cy.visit('/feature_flags', { timeout: 5000 }).url().should('contains', '/feature_flags')
      cy.get('select.tenant-select').find('option[value="concertfinance"]').then(($tenantSelectBox) => {
        $tenantSelectBox.prop('selected', true)
        $tenantSelectBox.parent().trigger('change')
      })
      cy.get('#inquiries', { timeout: 5000 }).then(($inquiries) => { $inquiries.prop('checked', true) })
      cy.get('button.update-flag-data').should('be.visible').click()
      cy.visit('/')
    })

    it('Should open Chat Room page', () => {
      cy.get('#inquiries-li').should('be.visible').click()
      cy.url().should('contain', '/inquiries')
    })
  })

  sharedData.exceptionHandling()
})
