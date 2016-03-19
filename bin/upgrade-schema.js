'use strict'

// Load modules
const getStdin = require('get-stdin')
const upgrade = require('../lib/upgrade')

/**
 * Upgrade legacy schema to the new schema.
 */
function upgradeSchema () {
  getStdin()
  .then((str) => {
    let data = JSON.parse(str)
    return upgrade(data)
  })
  .then((data) => {
    process.stdout.write(JSON.stringify(data))
  })
}

// Execute schema upgrade
upgradeSchema()
