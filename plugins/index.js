/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const pg = require('pg')
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  on('task', {
    DATABASE ({ dbConfig, sql, values }) {
      const pool = new pg.Pool(dbConfig)

      try {
        return pool.query(sql, values)
      } catch (e) {
        cy.log(e)
      }
    }
  })

  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  return config
}
