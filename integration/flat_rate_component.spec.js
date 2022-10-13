import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Creating Flat Rate Component', () => {
  let sharedData = new sharedContent
  let loginMethods = new loginMethod()
  let componentNameAddFilters = 'FR-AddFilters-' + sharedData.randomString(2)
  let mainTable = 'Main Table ' + sharedData.randomString(2)
  let linkedTable = 'Linked Table' + sharedData.randomString(2)
  let planName = 'Cypress Test ' + sharedData.randomString(2)
  let startDate = sharedData.startDate()
  let endDate = sharedData.endDate()

  before(() => loginMethods.login())

  beforeEach(() => sharedData.preserveCookies())

  after(() => loginMethods.logout())

  it('Should create users for plan creation', () => {
    sharedData.createPayees(3)
  })

  it('Should create a plan successfully for component creation', () => {
    cy.visit('/plans/new')
    cy.get('#plan-name').type(planName)
    cy.get('#start-date-picker').type(startDate, { force: true })
    cy.get('#end-date-picker').type(endDate, { force: true })
    cy.get('.next-button').contains('Next').click()
    cy.get('#select-payee-1').click({ force: true })
    cy.get('#plan-submit-button').click()
  })

  it('Should create Two Linked DataTables successfully to be used in the component', () => {
    sharedData.goToDataTables()
    cy.get('#create-table-btn').click()
    cy.url().should('include', '/data/new')
    cy.get('#custom-table-name').type(mainTable)
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
    cy.get('input[value="Close Date"]').parent().parent().find('.column-type').select('Date')
    cy.get('input[value="User Id"]').parent().parent().find('.column-type').select('Reference')
    cy.get('.btn').contains('Next').click()
    cy.get('.btn').contains('Next').click()
    cy.get('.finish-btn').click()
    cy.intercept('/data_object/*').as('expectedUrl')
    cy.wait('@expectedUrl', { timeout: 10000 })
    cy.get('.htCore').first().find('tr').eq(2, { timeout: 10000 }).should('be.visible')

    cy.get('#hot-container').then(($table) => {
      expect(parseInt($table.find('.htCore').first().find('tr').length)).to.greaterThan(1)
    })

    cy.visit('/data/new')
    cy.get('#custom-table-name').type(linkedTable)
    cy.get('#custom-table-description').type('description')
    cy.get('#custom_table_content_type').select('Bookings')
    cy.get('#excel-radio').click({ force: true })
    cy.get('input').contains('Create Table').click()
    cy.get('.dropzone_custom', { timeout: 10000 }).attachFile('Linked Table.xlsx', { subjectType: 'drag-n-drop' })
    cy.get('.btn-excel-upload').click()
    cy.get('.sw-btn-next').click()
    cy.get('.data-table-field-settings').first().find('.activity-field').check()
    cy.get('.data-table-field-settings').first().find('.primary_radio').should('not.be.checked')
    cy.get('.data-table-field-settings').first().find('.icon-Key').click()
    cy.get('.data-table-field-settings').first().find('.primary_radio').should('be.checked')
    cy.get('input[value="Effective Date"]').parent().parent().find('.column-type').select('Date')
    cy.get('input[value="Start Date"]').parent().parent().find('.column-type').select('Date')
    cy.get('input[value="End Date"]').parent().parent().find('.column-type').select('Date')

    cy.get('.btn').contains('Next').click()
    cy.get('.btn').contains('Next').click()
    cy.get('.finish-btn').click()
    cy.intercept('/data_object/*').as('expectedUrl')
    cy.wait('@expectedUrl', { timeout: 3000 })
    cy.get('.htCore').first().find('tr').eq(2, { timeout: 10000 }).should('be.visible')

    cy.get('#hot-container').then(($table) => {
      expect(parseInt($table.find('.htCore').first().find('tr').length)).to.greaterThan(1, { timeout: 250000 })
    })

    cy.visit('/data')
    let tableBox = cy.get('.box').contains(mainTable)

    tableBox.parent().parent().find('a').contains('Link/Unlink Table').click()
    cy.wait(2000)
    cy.url().should('include', '/datatable_links', { timeout: 5000 })

    cy.get('a').contains('Create New Data Table Link').should('be.visible').click()

    cy.get('#datatable_link_link_to_table_id').select(linkedTable)
    cy.get('#datatable_link_custom_table_column_id').select('Opp ID')
    cy.get('#datatable_link_link_to_table_column_id').select('Id')
    cy.get('#datatable_link_matching_type').select('approximate match')
    cy.get('input[type=submit]').click()
    cy.get('[data-notify="message"]').contains('Successfully')
  })

  describe('With Additional Filters', () => {
    it('Create when condition is "equal to"', () => {
      createComponentWithAdditionalFilters('is equal to')
    })

    it('Update to condition "not equal to"', () => {
      createComponentWithAdditionalFilters('is not equal to')
    })

    it('Update to condition "less than"', () => {
      createComponentWithAdditionalFilters('is less than')
    })

    it('Update to condition "less than or equal to"', () => {
      createComponentWithAdditionalFilters('is less than or equal to')
    })

    it('Update to condition "greater than"', () => {
      createComponentWithAdditionalFilters('is greater than')
    })

    it('Update to condition "greater than or equal to"', () => {
      createComponentWithAdditionalFilters('is greater than or equal to')
    })

    it('Update to condition "is blank?"', () => {
      createComponentWithAdditionalFilters('is blank')
    })

    it('Update to condition "not blank"', () => {
      createComponentWithAdditionalFilters('is not blank')
    })
  })

  describe('With Release Methodology: Full Release, based on date', () => {
    let releaseMethodology = 'Full release, based on a date'
    let componentNameReleaseMethod = getComponentName(releaseMethodology)

    it('Create when Pay-Period Method is Standard', () => {
      createComponentWithReleaseMethodology('Standard', releaseMethodology, componentNameReleaseMethod)
    })
    it('Update to Pay-Period Method is Split Month', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod)
    })
  })

  describe('With Release Methodology: Full Release, based on condition', () => {
    let releaseMethodology = 'Full release, based on a condition'
    let componentNameReleaseMethod = getComponentName(releaseMethodology)

    it('Create when Pay-Period Method is Standard and condition is "equal to"', () => {
      createComponentWithReleaseMethodology('Standard', releaseMethodology, componentNameReleaseMethod, 'is equal to')
    })

    it('Update Condition to "not equal to" and Pay-Period Method to Split Month', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod, 'is not equal to')
    })

    it('Update Condition to "contains"', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod, 'contains')
    })

    it('Update Condition to "does not contain"', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod, 'does not contain')
    })

    it('Update Condition to "is blank"', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod, 'is blank')
    })

    it('Update Condition to "is not blank"', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod, 'is not blank')
    })
  })


  describe('With Release Methodology: Proportional release, based on date', () => {
    let releaseMethodology = 'Proportional release, based on a date'
    let componentNameReleaseMethod = getComponentName(releaseMethodology)

    it('Create when Pay-Period Method is Standard', () => {
      createComponentWithReleaseMethodology('Standard', releaseMethodology, componentNameReleaseMethod)
    })
    it('Update to Pay-Period Method: Split Month', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod)
    })
  })

  describe('With Release Methodology: Proportional release, based on frequency', () => {
    let releaseMethodology = 'Proportional release, based on a frequency'
    let componentNameReleaseMethod = getComponentName(releaseMethodology)

    it('Create when Pay-Period Method is Standard', () => {
      createComponentWithReleaseMethodology('Standard', releaseMethodology, componentNameReleaseMethod)
    })
    it('Update to Pay-Period Method: Split Month', () => {
      createComponentWithReleaseMethodology('Split Month', releaseMethodology, componentNameReleaseMethod)
    })
  })

  function createComponentWithAdditionalFilters(operator) {
    sharedData.goToPlans(planName)
    if (operator === 'is equal to') {
      cy.get('#add-component-btn', { timeout: 10000 }).should('be.visible').click()
      cy.get('#component-steps', { timeout: 30000 }).should('be.visible')

      cy.get('.active').contains('Step 1').then(() => {
        cy.get('#component-name').type(componentNameAddFilters).should('have.value', componentNameAddFilters)
        cy.get('.fa-check').should('be.visible')
        cy.get('.custom-radio').contains('FLAT RATE').click()
        cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
      })

      cy.get('#form-step-1', { timeout: 10000 }).should('be.visible').then(($step2) => {
        $step2.find('.ss-single-selected')[0].click()
        cy.get('.ss-option').contains(mainTable).click()

        cy.get('.placeholder').contains('Select Owner').click({ force: true })
        cy.get('.ss-option').contains('the payee').click()

        cy.get('.placeholder').contains('Select Field', { timeout: 10000 }).should('be.visible').click({ force: true })

        cy.get('.ss-option').contains('User Id').should('exist')
        cy.get('.ss-option').contains('Opp Owner').click()

        cy.get('#additional-filter').check({ force: true })
        cy.get('.credit-rules-condition-fields').last().click()
        cy.get('.ss-open').find('.ss-option').contains('Amount').click()

        cy.get('.credit-rules-condition-operators').last().click()
        cy.get('.ss-open').find('.ss-option').contains(operator).click()

        if (operator != ('is blank') && operator != ('is not blank'))
          cy.get('.filter-condition-value').last().type('123')

        cy.get('.placeholder').contains('Select Credit Earned Date').click()
        cy.get('.ss-open').find('.ss-option').contains('Close Date').click()
        cy.get('.placeholder').contains('Select Stage Field').click()
        cy.get('.ss-open').find('.ss-option').contains("I don't have a stage field").click()
        cy.get('#component-next-button', { timeout: 5000 }).click()
      })

      cy.get('#payout-metrics-basis').select('Amount', { force: true })

      cy.get('.payout-release-percentage').last().type('100')

      cy.get('#components').then(($components) => {
        cy.get('select.payout-release-data-source').last().select(linkedTable, { force: true })
        cy.wait(1000)
        let selectedDataSource = $components.find('.payout-release-data-source').find(':selected').text()

        if (selectedDataSource.includes('Select Data Source')) {
          cy.get('select.payout-release-data-source').last().select(linkedTable, { force: true })
        }

        cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
        cy.wait(1000)
        let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

        if (selectedDataField.includes('Select Field')) {
          cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
        }
      })

      cy.get('#default-quota-check').check({ force: true })
      cy.get('#default_payout_rate').clear().type('5')
    }
    else {
      cy.get('td').contains(componentNameAddFilters).click()
      cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
      cy.get('select.credit-rules-condition-operators').last().select(operator, { force: true })

      if (operator != ('is blank') && operator != ('is not blank'))
        cy.get('.filter-condition-value').last().clear().type('123')

      cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
      cy.get('#components').then(($components) => {
        let selectedDataSource = $components.find('.payout-release-data-source').find(':selected').text()

        if (selectedDataSource.includes('Select Data Source...')) {
          cy.get('select.payout-release-data-source').last().select(linkedTable, { force: true })
          cy.get('select.release-data-fields').last().select('Effective Date', { force: true })

          let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

          if (selectedDataField.includes('Select Field...')) {
            cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
          }
        }
      })
    }

    cy.get('#component-next-button', { timeout: 5000 }).click()
    cy.wait(5000)

    cy.get('#components').then(($components) => {
      if ($components.find('#quota-main-div', { timeout: 250000 }).length > 0) {
        cy.get('#component-finish-button').click()
        cy.get('#plan-components-table', { timeout: 10000 }).should('be.visible').contains(`${componentNameAddFilters}`).should('exist')
      }
      else {
        cy.get('#component-prev-button').click({ force: true })
        cy.wait(1000)
        cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
        cy.wait(5000)
        cy.get('#quota-main-div', { timeout: 20000 })
        cy.get('#component-finish-button').click()
        cy.get('#plan-components-table', { timeout: 10000 }).should('be.visible').contains(`${componentNameAddFilters}`).should('exist')
      }
    })
  }

  function createComponentWithReleaseMethodology(payPeriodMethod, releaseMethodology, componentName, conditionalOperator) {
    sharedData.goToPlans(planName)
    if (payPeriodMethod === 'Standard') {
      cy.get('#add-component-btn', { timeout: 10000 }).should('be.visible').click()
      cy.get('#component-steps', { timeout: 30000 }).should('be.visible')

      cy.get('.active').contains('Step 1').then(() => {
        cy.get('#component-name').type(componentName).should('have.value', componentName)
        cy.get('.fa-check').should('be.visible')
        cy.get('.custom-radio').contains('FLAT RATE').click()
        cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
      })

      cy.get('#form-step-1', { timeout: 10000 }).should('be.visible').then(($step2) => {
        $step2.find('.ss-single-selected')[0].click()
        cy.get('.ss-option').contains(mainTable).click()

        cy.get('.placeholder').contains('Select Owner').click({ force: true })
        cy.get('.ss-option').contains('the payee').click()

        cy.get('.placeholder').contains('Select Field', { timeout: 10000 }).should('be.visible').click({ force: true })

        cy.get('.placeholder').contains('Select Field').click({ force: true })
        cy.get('.ss-option').contains('Opp Owner').click()

        cy.get('.placeholder').contains('Select Credit Earned Date').click()
        cy.get('.ss-open').find('.ss-option').contains('Close Date').click()

        cy.get('.placeholder').contains('Select Stage Field').click()
        cy.get('.ss-open').find('.ss-option').contains("I don't have a stage field").click()
        cy.get('#component-next-button', { timeout: 5000 }).click()
      })

      cy.get('#payout-metrics-basis').select('Amount', { force: true })

      cy.get('.payout-release-percentage').last().type('100')

      cy.get('.pay-period-method').last().click()
      cy.get('.ss-open').find('.ss-option').contains(payPeriodMethod).click({ force: true })

      cy.get('.payout-release-methodology').last().click()
      cy.get('.ss-open').find('.ss-option').contains(releaseMethodology).click()

      cy.get('#components').then(($components) => {
        cy.get('select.payout-release-data-source').last().select(linkedTable, { force: true })
        cy.wait(1000)
        let selectedDataSource = $components.find('.payout-release-data-source').find(':selected').text()

        if (selectedDataSource.includes('Select Data Source')) {
          cy.get('select.payout-release-data-source').last().select(linkedTable, { force: true })
        }
      })

      if (releaseMethodology === 'Full release, based on a condition') {
        cy.get('select.release-data-fields').last().select('Opp ID', { force: true })
        cy.get('#components').then(($components) => {
          let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

          if (selectedDataField.includes('Select Field')) {
            cy.get('select.release-data-fields').last().select('Opp ID', { force: true })
          }
        })
        cy.get('select.payout-release-condition-operators').select(conditionalOperator, { force: true })

        if (conditionalOperator != ('is blank') && conditionalOperator != ('is not blank'))
          cy.get('.payout-release-value').last().type(sharedData.randomString(3))
      }
      else if (releaseMethodology === 'Full release, based on a date') {
        cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
        cy.get('#components').then(($components) => {
          cy.wait(1000)
          let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

          if (selectedDataField.includes('Select Field')) {
            cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
          }
        })
      }
      else if (releaseMethodology === 'Proportional release, based on a date') {
        cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
        cy.get('#components').then(($components) => {
          let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

          if (selectedDataField.includes('Select Field')) {
            cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
          }
        })

        cy.get('select.payout-release-numerator').last().select('Unit Price', { force: true })
        cy.get('#components').then(($components) => {
          let selectedDataField = $components.find('.payout-release-numerator').find(':selected').text()

          if (selectedDataField.includes('Select Field')) {
            cy.get('select.release-data-fields').last().select('Unit Price', { force: true })
          }
        })

        cy.get('select.payout-release-denominator').last().select('Amount', { force: true })
        cy.get('#components').then(($components) => {
          let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

          if (selectedDataField.includes('Select Field')) {
            cy.get('select.release-data-fields').last().select('Amount', { force: true })
          }
        })
      }
      else if (releaseMethodology === 'Proportional release, based on a frequency') {
        cy.get('select.payout-release-start-field').last().select('Effective Date', { force: true })
        cy.get('#components').then(($components) => {
          let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

          if (selectedDataField.includes('Select Field')) {
            cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
          }
        })

        cy.get('select.payout-frequency-field').last().select('Stage', { force: true })
      }

      cy.get('#default-quota-check').check({ force: true })
      cy.get('#default_payout_rate').clear().type('5')
    }
    else {
      cy.get('td').contains(componentName).click()
      cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
      cy.wait(1000)
      cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()

      cy.get('.pay-period-method').last().click()
      cy.get('.ss-open').find('.ss-option').contains(payPeriodMethod).click({ force: true })

      if (releaseMethodology === 'Full release, based on a condition' && conditionalOperator !== 'is equal to') {
        cy.get('select.payout-release-condition-operators').select(conditionalOperator, { force: true })

        if (conditionalOperator != ('is blank') && conditionalOperator != ('is not blank'))
          cy.get('.payout-release-value').last().type(sharedData.randomString(3))
      }
    }

    cy.get('#component-next-button', { timeout: 5000 }).click()
    cy.wait(5000)

    cy.get('#components').then(($components) => {
      if ($components.find('#quota-main-div', { timeout: 250000 }).length > 0) {
        cy.get('#component-finish-button').click()
        cy.get('#plan-components-table', { timeout: 10000 }).should('be.visible').contains(`${componentName}`).should('exist')
      }
      else {
        cy.get('#component-prev-button').click({ force: true })
        cy.wait(2000)
        cy.get('#components').then(($components) => {
          let selectedDataSource = $components.find('.payout-release-data-source').find(':selected').text()

          if (selectedDataSource.includes('Select Data Source...')) {
            cy.get('select.payout-release-data-source').last().select(linkedTable, { force: true })
            cy.get('select.release-data-fields').last().select('Effective Date', { force: true })

            let selectedDataField = $components.find('.release-data-fields').find(':selected').text()

            if (selectedDataField.includes('Select Field...')) {
              cy.get('select.release-data-fields').last().select('Effective Date', { force: true })
            }
          }
        })
        cy.get('#component-next-button', { timeout: 5000 }).should('be.visible').click()
        cy.wait(5000)
        cy.get('#quota-main-div', { timeout: 20000 })
        cy.get('#component-finish-button').click()
        cy.get('#plan-components-table', { timeout: 10000 }).should('be.visible').contains(`${componentName}`).should('exist')
      }
    })
  }

  function getComponentName(releaseMethodology) {
    let componentName = ""
    if (releaseMethodology === 'Full release, based on a condition')
      componentName = 'FR-FR-condition-' + sharedData.randomString(2);
    else if (releaseMethodology === 'Full release, based on a date')
      componentName = 'FR-FR-date-' + sharedData.randomString(2);
    else if (releaseMethodology === 'Proportional release, based on a date')
      componentName = 'FR-PR-date-' + sharedData.randomString(2);
    else if (releaseMethodology === 'Proportional release, based on a frequency')
      componentName = 'FR-PR-frequency-' + sharedData.randomString(2);

    return componentName
  }

  sharedData.exceptionHandling()
})
