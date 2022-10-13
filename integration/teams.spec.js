import loginMethod from '../shared/login_methods.js'
import sharedContent from '../shared/shared_content.js'

describe('Teams', () => {
  let sharedData = new sharedContent()
  let loginMethods = new loginMethod()

  before(() => loginMethods.login())

  beforeEach(() => {
    sharedData.preserveCookies()
    cy.visit('/teams')
  })

  after(() => loginMethods.logout())


  it('Should create new Payees successfully before creating team', () => {
    sharedData.createPayees(3)
  })

  it('Should create team successfully', () => {
    let teamName = 'NewTeam' + sharedData.randomString(3)

    cy.get('.app-main-heading').should('contain', 'Teams')
    cy.get('#btn-create-team').click()
    cy.get('#team-name').type(teamName)
    cy.get('input[type="submit"]').click()
    cy.url().should('contains', 'teams')
    cy.get('.card-body').should('contain', teamName)
  })

  it('Should create team and add members successfully', () => {
    let teamName = 'NewTeam' + sharedData.randomString(3)

    cy.get('.app-main-heading').should('contain', 'Teams')
    cy.get('#btn-create-team').click()
    cy.get('#team-name').type(teamName)
    cy.get('input[type="submit"]').click()
    cy.url().should('contains', 'teams')
    cy.get('.card-body').should('contain', teamName)

    cy.get('tr').last().find('.add-member-to-team-btn').click()
    cy.get('.users_row').find('input[type=checkbox]').first().click()
    cy.get('.users_row').find('input[type=checkbox]').eq(1).click()
    cy.get('.users_row').find('input[type=checkbox]').eq(2).click()
    cy.get('#create-team-member-submit-button').click()
    cy.get('[data-notify="message"]').contains('Team Member Added Successfully!')
    cy.get('.team-member-details').should('have.length', 3)
  })

  it('Should delete a team member from a team successfully', () => {
    let numberOfMembers = 0
    let memberName = ""

    cy.get('.team-details').last().find('.edit-team-btn').click()

    cy.get('#team-members-show-table').then(($teamData) => {
      memberName = $teamData.find('tbody').find('.team-member-details').last().find('.team-member-name').text()
      cy.get('.team-member-details').contains(memberName).should('exist')
    })

    cy.get('#team-members-show-table').then(($teamData) => {
      numberOfMembers = $teamData.find('tbody').find('.team-member-details').length
    })

    cy.get('.team-member-details').last().find('.remove-team-member').click()
    cy.get('[data-notify="message"]').contains('Team Member Removed Successfully!')

    cy.get('#team-members-show-table').then(($teamData) => {
      expect(parseInt($teamData.find('tbody').find('.team-member-details').length)).to.equal(numberOfMembers - 1)
    })

    cy.get('#team-members-show-table').then(($teamData) => {
      cy.get('.team-member-details').contains(memberName).should('not.exist')
    })
  })

  it('Should delete a team successfully', () => {
    let numberOfTeams = 0
    let teamName = ''

    cy.get('#team-details-table').then(($teamData) => {
      numberOfTeams = $teamData.find('tbody').find('.team-details').length
    })

    cy.get('#team-details-table').then(($teamData) => {
      teamName = $teamData.find('tbody').find('.team-details').last().find('.team-name').text()
      cy.get('.team-details').contains(teamName).should('exist')
    })

    cy.get('.team-details').last().find('.remove-team').click()
    cy.get('[data-notify="message"]').contains('Team Deleted Successfully!').should('exist')

    cy.get('#team-details-table').then(($teamData) => {
      expect(parseInt($teamData.find('tbody').find('.team-details').length)).to.equal(numberOfTeams - 1)
    })

    cy.get('#team-details-table').then(($teamData) => {
      cy.get('.team-details').contains(teamName).should('not.exist')
    })
  })

  Cypress.on('uncaught:exception', (err) => {
    return false
  })
})
