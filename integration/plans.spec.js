import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

let sharedData = new sharedContent()
let loginMethods = new loginMethod()
let randomString = sharedData.randomString(2)
let planName = 'Cypress Test ' + sharedData.randomString(2)
let startDate = new sharedContent().startDate()
let endDate = new sharedContent().endDate()
let currentDate = new sharedContent().currentDate()
let payeeStartDate = '02/01/' + new Date().getFullYear()
let payeeEndDate = '11/30/' + new Date().getFullYear()
let releaseEndDate = '01/31/' + (new Date().getFullYear() + 1)
let cloneStartDate = '03/01/' + new Date().getFullYear()
let cloneEndDate = '03/31/' + new Date().getFullYear()

describe('Plans', () => {
  before(() => loginMethods.login())

  beforeEach(() => sharedData.preserveCookies())

  after(() => loginMethods.logout())

  it('Should create some payees successfully before creating plan', () => {
    sharedData.createPayees(3)
  })

  it('Should visit plans page', () => {
    cy.visit('/plans').url().should('contains', '/plans')
  })

  context('Plan Creation', () => {
    it('Should validate Plan start date that can not be greater than plan end date', () => {
      cy.get('#add-new-plan-btn').should('be.visible').click()
      cy.get('#start-date-picker').type(endDate, { force: true }).should('have.value', endDate)
      cy.get('#end-date-picker').type(startDate + `{enter}`, { force: true }).should('have.value', endDate)
    })

    it('Should validate plan end date that can not be lesser than plan start date', () => {
      cy.get('#end-date-picker').clear({ force: true }).type(startDate, { force: true }).should('have.value', startDate)
      cy.get('#start-date-picker').clear({ force: true }).type(endDate + `{enter}`, { force: true }).should('have.value', currentDate)
    })

    it('Should go to previous step on clicking Previous button in plan creation', () => {
      cy.get('#plan-name').type(planName).should('have.value', planName)
      cy.get('#plan-name-validation-icon > i').should('have.class', 'fa-check')
      cy.get('#start-date-picker').clear({ force: true }).type(startDate, { force: true }).should('have.value', startDate)
      cy.get('#end-date-picker').clear({ force: true }).type(endDate, { force: true }).should('have.value', endDate)
      cy.get('.next-button').contains('Next').should('be.visible').click()
      cy.get('.prev-button').should('be.visible').click()
      cy.get('.prev-button').should('have.class', 'disabled')
    })

    it('Should select two payees for plan creation', () => {
      cy.get('.next-button').contains('Next').should('be.visible').click()
      cy.get('#select-payee-0').click({ force: true })
      cy.get('#select-payee-1').click({ force: true })
    })

    it('Should unselect second payee for plan', () => {
      cy.get('#select-payee-1').click({ force: true })
    })

    it('Should change plan start and end date for specific payee', () => {
      cy.get('#plan-effective-date-0').clear({ force: true }).type(payeeStartDate, { force: true }).should('have.value', payeeStartDate)
      cy.get('#plan-end-date-0').clear({ force: true }).type(payeeEndDate, { force: true }).should('have.value', payeeEndDate)
    })

    it('Should add release end date for specific payee', () => {
      cy.get('#plan-release-end-date-0').type(releaseEndDate + `{enter}`, { force: true }).should('have.value', releaseEndDate)
    })

    it('Should create a plan successfully with Save button', () => {
      cy.get('#plan-submit-button').should('be.visible').click()
      cy.get('[data-notify="message"]').should('contain', 'Plan Created Successfully!')
    })

    it('Should create a plan and should jump to component creation page', () => {
      cy.visit('/plans/new').url().should('contains', '/plans/new')
      cy.get('#plan-name').type('Cypress Test ' + randomString).should('have.value', 'Cypress Test ' + randomString)
      cy.get('#plan-name-validation-icon > i').should('have.class', 'fa-check')
      cy.get('#start-date-picker').type(startDate, { force: true }).should('have.value', startDate)
      cy.get('#end-date-picker').type(endDate, { force: true }).should('have.value', endDate)
      cy.get('.next-button').contains('Next').should('be.visible').click()
      cy.get('#select-payee-0').click({ force: true })
      cy.get('#create-plan-and-component-button').should('be.visible').click()
      cy.get('[data-notify="message"]').should('contain', 'Plan Created Successfully!')
      cy.url().should('contain', '/components/new')
    })

    it('Should not create plan with existing plan name', () => {
      cy.visit('/plans/new').url().should('contains', '/plans/new')
      cy.get('#plan-name').type('Cypress Test ')
      cy.wait(500)
      cy.get('#plan-name').type(randomString).should('have.value', 'Cypress Test ' + randomString)
      cy.get('#plan-name-validation-icon > i').should('have.class', 'fa-times')
      cy.get('#start-date-picker').type(startDate, { force: true }).should('have.value', startDate)
      cy.get('#end-date-picker').type(endDate + `{enter}`, { force: true }).should('have.value', endDate)
      cy.get('.next-button').contains('Next').should('be.visible').click()
      cy.get('[data-notify="title"]').should('contain', 'Failed')
    })
  })

  context('Plan display', () => {
    before(() => {
      cy.visit('/plans').url().should('contains', '/plans')
    })

    it('Should search newly created plan', () => {
      cy.get('#plan-search-datatable').should('be.visible').type(planName).should('have.value', planName)
      cy.get('[data-deleted="false"] > .plan-data').first().should('have.text', planName)
      cy.get('#plan-search-datatable').clear()
    })

    it('Should display all plans in Tile format', () => {
      cy.get('#tile-button').click()
      cy.get('#tile-button').should('have.class', 'selected-button')
    })

    it('Should display all plans in List format', () => {
      cy.get('#table-button').click()
      cy.get('#table-button').should('have.class', 'selected-button')
    })
  })

  context('Edit statement Template page', () => {
    it('Should visit to edit statement template page', () => {
      cy.get('[data-deleted="false"]:first > .exclude-column > .fa-ellipsis-v').click()
      cy.get('.dropdown-item').contains('Edit Statement Template').click({ force: true })
      cy.url().should('contain', 'statement_templates/bulk_edit')
    })
  })

  context('Plan Close and re-open', () => {
    before(() => {
      cy.visit('/plans').url().should('contains', '/plans')
      cy.get('[data-deleted="false"] > .plan-data').first().invoke('text').as('planName')
    })

    it('Should close plan successfully', () => {
      cy.get('[data-deleted="false"] > .exclude-column > .fas').first().click()
      cy.get('[data-deleted="false"] > .exclude-column > .dropdown-menu > #close-plan').first().click()
      cy.get('#close-plan-modal').should('be.visible')
      cy.get('#close-plan-button').should('exist').click()
      cy.get('[data-notify="message"]').should('contain', 'Plan Closed Successfully!')
    })

    it('Should display recently closed plan', function () {
      cy.wait(3000)
      cy.get('.custom-control-label', { timeout: 5000 }).should('be.visible').click()
      cy.get('[data-deleted="false"] > .plan-data', { timeout: 2000 }).should('contain', this.planName)
    })

    it('Should re-open recently closed plan', () => {
      cy.get('[data-deleted="false"] > .exclude-column > .fas').first().click()
      cy.get('[data-deleted="false"] > .exclude-column > .dropdown-menu > #is-plan-open').first().click()
      cy.get('[data-notify="message"]').should('contain', 'Plan Re-opened Successfully!')
    })

    it('Should check download button not disabled', () => {
      cy.visit('/plans').url().should('contains', '/plans')
      cy.get('[data-deleted="false"] > .exclude-column > .fas').first().click()
      cy.get('[data-deleted="false"] > .exclude-column > .dropdown-menu > #close-plan').first().click()
      cy.get('#close-plan-modal').should('be.visible')
      cy.get('#close-plan-button').should('exist').click()
      cy.get('[data-notify="message"]').should('contain', 'Plan Closed Successfully!')
      cy.visit('/plans').url().should('contains', '/plans')
      cy.get('.custom-control-label').should('be.visible').click()
      cy.wait(3000)
      cy.get('#plan-index-table').first().click()
      cy.wait(3000)
      cy.get('#download-payees-btn').not('have.class', 'disabled')
    })
  })

  context('Plan Cloning', () => {
    before(() => {
      cy.visit('/plans').url().should('contains', '/plans')
      cy.get('[data-deleted="false"] > .plan-data').first().invoke('text').as('planName')
      cy.get('[data-deleted="false"] > #plan-start-date').first().invoke('text').as('planStartDate')
      cy.get('[data-deleted="false"] > #plan-end-date').first().invoke('text').as('planEndDate')
    })

    it('Should open Clone plan Modal successfully', () => {
      cy.get('[data-deleted="false"] > .exclude-column > .fas').first().click()
      cy.get('[data-deleted="false"] > .exclude-column > .dropdown-menu > #clone-actual-plan').first().click()
      cy.get('#clone-plan-modal').should('exist').should('have.class', 'show')
    })

    it('Should validate Clone plan name that can not be same as the actual plan', function () {
      cy.get('#plan-name').should('have.value', this.planName)
      cy.get('#clone-plan-name-validation-icon > i').should('have.class', 'fa-times')
    })

    it('Should match Clone Plan Start date with Actual plan start date', function () {
      cy.get('#clone-start-date').should('have.value', this.planStartDate)
    })

    it('Should match Clone Plan End date with Actual plan end date', function () {
      cy.get('#clone-end-date').should('have.value', this.planEndDate)
    })

    it('Should not allow to create a clone plan if the plan name is not unique', () => {
      cy.get('#submit-clone-plan').should('have.attr', 'disabled')
    })

    it('Should add new clone plan name ', function () {
      cy.wait(500)
      cy.get('#plan-name').type(' - cloned').should('have.value', this.planName + ' - cloned')
      cy.get('#clone-plan-name-validation-icon > i').should('have.class', 'fa-check')
      cy.get('#submit-clone-plan').should('not.have.attr', 'disabled')
    })

    it('Plan end date can be changed for clone plan', function () {
      cy.get('#clone-end-date').clear({ force: true }).type(cloneEndDate + `{enter}`, { force: true }).should('have.value', cloneEndDate)
    })

    it('Plan start date can be changed for clone plan', function () {
      cy.get('#clone-start-date').clear({ force: true }).type(cloneStartDate + `{enter}`, { force: true }).should('have.value', cloneStartDate)
    })

    it('Should create a clone plan successfully', () => {
      cy.intercept('GET', '/plans').as('clonePlan')
      cy.get('#submit-clone-plan').should('be.visible').click()
      cy.wait('@clonePlan')
        .its('response')
        .then((response) => {
          expect(response.statusCode).to.eq(200)
      })
    })
  })

  context('Edit Document Template', () => {
    before(() => {
      cy.visit('/plans').url().should('contains', '/plans')
      cy.get('[data-deleted="false"]:first > .exclude-column > .fa-ellipsis-v').click()
      cy.get('[data-deleted="false"] > .exclude-column > .dropdown-menu > #edit-document-template').first().click()
      cy.get('#unselected-0 > .column-name').invoke('text').as('columnName')
      cy.get('#unselected-1 > .column-name').invoke('text').as('secondColumnName')
      cy.url().should('contain', 'doc_template')
    })

    it('Should have Payee and Plan name by default selected in columns', () => {
      cy.get('#selected-columns-list > #selected-0').should('not.have.class', 'fa-times').find('.column-name').should('contain.text', 'Payee Name')
      cy.get('#selected-columns-list > #selected-1').should('not.have.class', 'fa-times').find('.column-name').should('contain.text', 'Plan Name')
    })

    it('Should search column in unselected columns', function () {
      cy.get('#unselected-columns-search > .form-control').type(this.columnName).should('have.value', this.columnName)
      cy.get('#unselected-columns-list').find('.column-name').first().should('have.text', this.columnName)
      cy.get('#unselected-columns-search > .form-control').clear()
    })

    it('Should select column for plan and remove that column from Unselected Column List', function () {
      cy.get('#unselected-columns-list').find('.fa-check').first().click()
      cy.get('#unselected-columns-list').should('not.contain', this.columnName)
      cy.get('#selected-columns-list').should('contain', this.columnName)
    })

    it('Should update plan document template successfully', () => {
      cy.get('#update-document-template').should('be.visible').click()
      cy.get('[data-notify="message"]').should('contain', 'Template Updated Successfully!')
      cy.url().should('contain', 'doc_template')
    })

    it('Should search column in selected columns', function () {
      cy.get('#selected-columns-search > .form-control').type(this.columnName).should('have.value', this.columnName)
      cy.get('#selected-columns-list').find('.column-name').eq(2).should('have.text', this.columnName)
      cy.get('#selected-columns-search > .form-control').clear()
    })

    it('Should unselect column for plan and remove that column from Selected Column List', function () {
      cy.get('#selected-columns-list').find('.fa-times').first().click()
      cy.get('#selected-columns-list').should('not.contain', this.columnName)
      cy.get('#unselected-columns-list').should('contain', this.columnName)
    })

    it('Should update fields to default', () => {
      cy.url().then(url => {
        let planID = url.split('/').splice(-2)[0]

        cy.intercept('GET', `plans/${planID}/doc_template`).as('updateFieldsToDefault')
        cy.get('#default-fields-button').should('be.visible').click()
        cy.wait('@updateFieldsToDefault')
          .its('response')
          .then((response) => {
            expect(response.statusCode).to.eq(200)
        })
      })
    })
  })

  context('Plan Deletion', () => {
    before(() => {
      cy.visit('/plans').url().should('contains', '/plans')
      cy.get('[data-deleted="false"] > .plan-data').first().invoke('text').as('planName')
      cy.get('[data-deleted="false"]').first().invoke('attr', 'data-id').as('planID')
    })

    it('Should delete a plan successfully', function () {
      cy.get('[data-deleted="false"] > .exclude-column > .fas').first().click()
      cy.get('[data-deleted="false"] > .exclude-column > .dropdown-menu > .delete-plan').first().click()
      cy.get(`[data-deleted="true"][data-id="${ this.planID }"]`, { timeout: 10000 }).should('exist')
    })
  })

  sharedData.exceptionHandling()
})
