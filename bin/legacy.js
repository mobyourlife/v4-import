'use strict'

// Load modules
const Legacy = require('../lib/legacy')

/**
 * Export legacy data.
 */
function exportLegacy () {
  let legacy = new Legacy()

  legacy.fetchData()
  .then((data) => {
    process.stdout.write(JSON.stringify(data))
  })
}

// Execute data export
exportLegacy()
