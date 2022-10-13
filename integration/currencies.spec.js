import moment from 'moment'
import loginMethods from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Currencies', () => {
  before(() => {
    new loginMethods().login()
  })

  beforeEach(() => {
    new sharedContent().preserveCookies()
  })

  after(() => {
    new loginMethods().logout()
  })

  let startDate = moment().format('MM/DD/YYYY')
  let forexStartDate = moment().add(1, 'days').format('MM/DD/YYYY')
  let forexEndDate = moment().add(2, 'days').format('MM/DD/YYYY')
  let forexRate = 4.55
  let updatedForexRate = 5.77
  let currencyCode = 'ABC'

  describe('Add Currency', () => {
    it('Should visit Currencies', () => {
      cy.get('.icon-settings').click()
      cy.get('#currencies').click()
      cy.url().should('contains', '/currencies')
    })

    it('Should open Add Currency modal', () => {
      cy.get('#add-currency').should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
    })

    it('Should validate Currency Code input field Validations for Currency', () => {
      cy.get('.modal-dialog').should('be.visible')
      cy.get('#currency-code').type(currencyCode, { force: true }).should('have.value', currencyCode)
      currencyCodeInput().type('aabbcc1122', { force: true }).should('have.value', 'AAB')
      currencyCodeInput().type('abc', { force: true }).should('have.value', 'ABC')
      currencyCodeInput().should('have.value', '')
      cy.get('#forex-rate-start-date').clear({ force: true }).type(`${forexStartDate}{enter}`, { force: true }).should('have.value', forexStartDate)
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
    })

    it('Should validate Currency Rate input field Validations for Currency', () => {
      cy.get('.modal-dialog').should('be.visible')
      cy.get('#forex-rate').type(`${forexRate}{enter}`).should('have.value', forexRate)
      forexRateInput().type('-45.4', { force: true }).should('have.value', '45.4')
      forexRateInput().type('45.4ed', { force: true }).should('have.value', '45.4')
      forexRateInput().type('abcDEF', { force: true }).should('have.value', '')
      forexRateInput().type('ABC1', { force: true }).should('have.value', '1')
      forexRateInput().type('0...00', { force: true }).should('have.value', '0')
      cy.get('#currency-code').invoke('val', '').should('have.value', '')
      cy.get('#forex-rate-start-date').clear({ force: true }).type(`${forexStartDate}{enter}`, { force: true }).should('have.value', forexStartDate)
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
    })

    it('Should validate Currency Start date input field Validations for Currency', () => {
      cy.get('.modal-dialog').should('be.visible')
      cy.get('.forex-rate-date-picker').type(`${startDate}{enter}`, { force: true }).should('have.value', startDate)
      cy.get('.forex-rate-date-picker').clear({ force: true })
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
    })

    it('Should add currency successfully', () => {
      cy.get('.modal-dialog').should('be.visible')
      cy.get('#currency-code').invoke('val', '').type(currencyCode, { force: true }).should('have.value', currencyCode)
      cy.get('#forex-rate').invoke('val', '').type(forexRate, { force: true }).should('have.value', forexRate)
      cy.get('.forex-rate-date-picker').invoke('val', '').type(`${startDate}{enter}`, { force: true }).should('have.value', startDate)
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('[data-notify="message"]').contains('Currency added successfully')
      cy.url().should('contains', '/currencies')
    })

    it('Should not add currency that is already added', () => {
      cy.get('#add-currency').should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
      cy.get('#currency-code').type(currencyCode, { force: true }).should('have.value', currencyCode)
      cy.get('#forex-rate').invoke('val', '').type(updatedForexRate, { force: true }).should('have.value', updatedForexRate)
      cy.get('.forex-rate-date-picker').type(`${startDate}{enter}`, { force: true }).should('have.value', startDate)
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('[data-notify="message"]').contains('Failure, Currency exists already')
      cy.url().should('contains', '/currencies')
    })

    it('Should match currency id with id in URL on managing a currency', () => {
      cy.get('.manage-btn').first().should('be.visible').invoke('attr', 'href').then(href => {
        let currencyId = href.split('/')[2]
        cy.visit(href).url().should('contains', currencyId)
      })
    })
  })

  describe('Add Forex Rate', () => {
    it('Should open modal for Add New FX Rate', () => {
      cy.visit('/currencies').url().should('contains', '/currencies')
      cy.get('#manage-currency-btn').first().should('be.visible').click()
      cy.get('#add-new-fx-rate-btn').should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
    })

    it('Should Add New FX Rates', () => {
      cy.get('.modal-dialog').should('be.visible')
      cy.get('#forex-rate').invoke('val', '').type(forexRate, { force: true }).should('have.value', forexRate)
      cy.get('#forex-rate-start-date').clear({ force: true }).type(`${forexStartDate}{enter}`, { force: true }).should('have.value', forexStartDate)
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('.modal-dialog').should('not.be.visible')
      cy.get('[data-notify="message"]').contains('Forex Rate Added Successfully!')
    })

    it('Should not Add New FX Rate when the start date already exists', () => {
      cy.get('#add-new-fx-rate-btn').should('be.visible').click()
      cy.get('#forex-rate').type(forexRate, { force: true }).should('have.value', forexRate)
      cy.get('#forex-rate-start-date').type(startDate, { force: true }).should('have.value', startDate)
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('[data-notify="message"]').should('contain', 'Start Date exists already!')
    })

    it('Should validate FX rate input fields', () => {
      cy.get('#add-new-fx-rate-btn').should('be.visible').click()
      cy.get('.modal-dialog').should('be.visible')
      cy.get('#forex-rate').type(forexRate, { force: true }).should('have.value', forexRate)
      forexRateInput().type('-45.4', { force: true }).should('have.value', '45.4')
      forexRateInput().type('45.4ed', { force: true }).should('have.value', '45.4')
      forexRateInput().type('abcDEF', { force: true }).should('have.value', '')
      forexRateInput().type('ABC1', { force: true }).should('have.value', '1')
      forexRateInput().type('0...00', { force: true }).should('have.value', '0.00')
      forexRateInput().should('have.value', '')
    })

    it('Should validate FX Start Date input fields', () => {
      cy.get('#forex-rate-start-date').type(`${forexEndDate}{enter}`, { force: true }).should('have.value', forexEndDate)
      cy.get('#forex-rate-start-date').clear({ force: true })
      cy.get(`input[type='submit']`).should('be.visible').click()
      cy.get('#close-modal').should('be.visible').click()
      cy.get('.modal-dialog').should('not.be.visible')
    })
  })

  describe('Update Forex Rate', () => {
    it('Should update FX Rate', () => {
      cy.get('.edit-forex-rate').last().should('be.visible').click()
      cy.get('.forex-rate-input').last().invoke('val', '').type(updatedForexRate, { force: true }).should('have.value', updatedForexRate)
      cy.get('.edit-forex-rate-tick-mark').last().should('be.visible').click()
      cy.get('[data-notify="message"]').contains('Forex Rate Updated Successfully!')
    })

    it('Should update FX End Date', () => {
      cy.wait(500)
      cy.get('.edit-forex-rate').last().should('be.visible').click()
      cy.get('.forex-end-date-input').last().should('be.visible').invoke('val', '').type(`${forexEndDate}{enter}`, { force: true }).should('have.value', forexEndDate)
      cy.get('.edit-forex-rate-tick-mark').last().should('be.visible').click()
      cy.get('[data-notify="message"]').contains('Forex Rate Updated Successfully!')
    })

     it('Should validate FX rate input field while editing', () => {
      cy.wait(500)
      cy.get('.edit-forex-rate').last().should('be.visible').click({ force: true })
      cy.get('.forex-rate-input').last().invoke('val', '').should('have.value', '')
      cy.get('.edit-forex-rate-tick-mark').last().should('be.visible').click({ force: true })
      cy.get('[data-notify="message"]').contains('Exchange Rate Field Required!')
    })
  })

  describe('Download and upload Forex Rates', () => {
    it('Should visit manual FX Rate', () => {
      cy.visit('/currencies').url().should('contains', '/currencies')
      cy.get('#add-manual-fx-rate-btn').should('be.visible').click()
      cy.url().should('contain', 'currencies/upload_file')
    })

    it('Should Download manual FX Rate', () => {
      cy.get('#download-template-btn').should('be.visible').click()
    })

    it('Should accept file in .xlsx format to import multiple FX Rates', () => {
      cy.fixture('Linked Table.xlsx').then(fileContent => {
        cy.get(`input[type='file']`).attachFile({
          fileContent: fileContent.toString(),
          fileName: 'Linked Table.xlsx',
          mimeType: 'xlsx'
        })
      })
      cy.get('.custom-file-input').should('contain.value', 'Linked Table.xlsx')
      cy.get('.upload-button').should('not.have.attr', 'disabled')
    })

    it('Should accept file in .csv format to import multiple FX Rates', () => {
      cy.fixture('csv_file.csv').then(fileContent => {
        cy.get(`input[type='file']`).attachFile({
          fileContent: fileContent.toString(),
          fileName: 'csv_file.csv',
          mimeType: 'csv',
        })
      })
      cy.get('.custom-file-input').should('contain.value', 'csv_file.csv')
      cy.get('.upload-button').should('not.have.attr', 'disabled')
    })
  })

  function currencyCodeInput() {
    return cy.get('#currency-code').invoke('val', '')
  }

  function forexRateInput() {
    return cy.get('#forex-rate').invoke('val', '')
  }

  Cypress.on('uncaught:exception', (_err, _runnable) => {
    return false
  })
})
