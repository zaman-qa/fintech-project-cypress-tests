import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Excel Data Tables', () => {
  let sharedData = new sharedContent()
  let loginMethods = new loginMethod()
  let tableName = 'excel_table_' + sharedData.randomString(3)

  before(() => loginMethods.login())

  beforeEach(() => {
    sharedData.preserveCookies()
    cy.visit('/data')
  })

  after(() => loginMethods.logout())

  const archiveTable = (isArchived) => {
    cy.visit('/data')

    if (isArchived) { cy.get('.custom-control-label').click() }

    cy.get('#search-table').type(tableName)
    cy.get('.table-details:visible').then(($table) => {
      $table.find('i[data-toggle="dropdown"]').last().click()
      $table.find('#add-to-archive').click()
    })
    cy.get('[data-notify="message"]').contains(`Data Table ${isArchived ? 'Un-' : ''}Archived Successfully!`).should('exist')
  }

  it('Table name should have length of maximum 25', () => {
    cy.get('#create-table-btn').click()
    cy.url().should('include', '/data/new')
    cy.get('#custom-table-name').then(table => {
      const maxlength = table.prop('maxlength')
      expect(maxlength).equal(25)
    })
  })

  it('Should redirect to import page successfully', () => {
    cy.get('#create-table-btn').click()
    cy.url().should('include', '/data/new')

    cy.get('#custom-table-name').type('excel_table_' + sharedData.randomString(3))
    cy.get('#custom-table-description').type('description_' + sharedData.randomString(2))
    cy.get('#custom_table_content_type').select('Bookings')
    cy.get('#excel-radio').click({ force: true })
    cy.get('input').contains('Create Table').click()
    cy.url().should('include', 'excel_upload?content_type', { timeout: 3000 })
  })

  it('Should create excel table successfully', () => {
    cy.get('#create-table-btn').click()
    cy.url().should('include', '/data/new')
    cy.get('#custom-table-name').type(tableName)
    cy.get('#custom-table-description').type('description_' + sharedData.randomString(2))
    cy.get('#custom_table_content_type').select('Bookings')
    cy.get('#excel-radio').click({ force: true })
    cy.get('input').contains('Create Table').click()
    cy.get('.dropzone_custom', { timeout: 10000 }).attachFile('Main Table.xlsx', { subjectType: 'drag-n-drop' })
    cy.get('.btn-excel-upload').click()
    cy.get('.btn').contains('Next').click()
    cy.get('.data-table-field-settings').first().find('.activity-field').check()
    cy.get('.data-table-field-settings').first().find('.primary_radio').should('not.be.checked')
    cy.get('.data-table-field-settings').first().find('.icon-Key').click()
    cy.get('.data-table-field-settings').first().find('.primary_radio').should('be.checked')
    cy.get('.btn').contains('Next').click()
    cy.get('.btn').contains('Next').click()
    cy.get('.finish-btn').click()
    cy.intercept('/data_object/*').as('expectedUrl')
    cy.wait('@expectedUrl', { timeout: 10000 })
    cy.get('.htCore').first().find('tr').eq(2, { timeout: 10000 }).should('be.visible')

    cy.get('#hot-container').then(($table) => {
      expect(parseInt($table.find('.htCore').first().find('tr').length)).to.greaterThan(1)
    })
  })

  it('Should delete a field from excel table successfully', () => {
    let numberOfFields = 0

    cy.get('i[data-toggle="dropdown"].fas.fa-ellipsis-v').last().click()
    cy.get('.table-action-btn').last().click()

    cy.get('.data-table').then(($table) => {
      numberOfFields = $table.find('.custom-field-details').length
    })

    cy.get('.custom-field-details').last().then(($field) => {
      let apiName = $field.find('.api-name').text()
      cy.log(apiName)
      cy.get('.api-name').contains(apiName).should('exist')

      cy.get('.field-actions').last().then(($actions) => {
        if ($actions.find('a').hasClass('disabled'))
          cy.log('FIELD CAN\'T BE DELETED, AS PER REQUIREMENT')
        else {
          cy.get('.remove-field-btn').last().click()
          cy.get('[data-notify="message"]').contains('Column Deleted Successfully!')
          cy.get('.field-name').contains(apiName).should('not.exist')

          cy.get('.data-table').then(($table) => {
            expect(parseInt($table.find('.custom-field-details').length)).to.equal(numberOfFields - 1)
          })
        }
      })
    })
  })

  it('should archive the table successfully', () => {
    archiveTable(false)
  })

  it('should unarchive the table successfully', () => {
    archiveTable(true)
  })

  it('Should delete excel table successfully', () => {
    let tableTitle = cy.get('.box-title').contains(tableName)
    tableTitle.should('exist')
    tableTitle.parents().eq(1).find('i[data-toggle="dropdown"]').last().click()
    tableTitle.parents().eq(1).find('.table-action-btn').click()

    cy.get('#remove-table-btn').click()
    cy.get('.box-title').contains(tableName).should('not.exist', { timeout: 10000 })
  })

  sharedData.exceptionHandling()
})
