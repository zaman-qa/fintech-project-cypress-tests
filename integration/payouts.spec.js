import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Payouts', () => {
  let sharedData = new sharedContent()
  let loginMethods = new loginMethod()

  before(() => loginMethods.login())

  beforeEach(() => {
    sharedData.preserveCookies()
    cy.visit('/payouts')
  })

  after(() => loginMethods.logout())

  context('Edit Payout', () => {
    it('Should access Payouts page', () => {
      cy.url().should('contain', '/payouts')
      cy.get('#payouts-index-page').contains('All Payouts').should('exist')
    })

    it('Should check if payout is editable', () => {
      cy.get('#all-payouts').first().click()
      cy.url().should('contain', '/payouts/1')
      cy.get('.fa-pencil-alt').should('not.have.class', 'disabled')
    })
  })

  context('Payouts Subtotal', () => {
    it('Should calculate same held amount as before "Show Payouts with Non Zero Held Balance" is checked', () => {
      cy.get('td.total_payout_held', { timeout: 5000 }).first().then(($total_payout_held) => {
        cy.url().should('contain', '/payouts', { timeout: 5000 })
        let heldAmount = $total_payout_held.text()

        cy.get('#nonzero-held-payouts').then(($nonZeroHeldPayouts) => {
          $nonZeroHeldPayouts.prop('checked', !($nonZeroHeldPayouts.prop('checked')))
        })

        cy.url().should('contain', '/payouts', { timeout: 5000 })
        expect(heldAmount).to.equal($total_payout_held.text())

        cy.get('#nonzero-held-payouts').then(($nonZeroHeldPayouts) => {
          $nonZeroHeldPayouts.prop('checked', !($nonZeroHeldPayouts.prop('checked')))
        })
      })
    })
  })

  sharedData.exceptionHandling()
})
