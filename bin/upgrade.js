'use strict'

// Load modules
const getStdin = require('get-stdin')
const upgradeSchema = require('../lib/upgrade-schema')

/**
 * Upgrade legacy schema to the new schema.
 */
function upgrade () {
  getStdin()
  .then((str) => {
    let data = JSON.parse(str)
    return upgradeSchema(data)
  })
  .then((data) => {
    process.stdout.write(JSON.stringify(data))
  })
}

// Execute schema upgrade
upgrade()
