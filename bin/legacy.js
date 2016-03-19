'use strict'

// Load modules
const LegacyExporter = require('../lib/legacy-exporter')

/**
 * Export legacy data.
 */
function exportLegacy () {
  let legacy = new LegacyExporter()

  legacy.fetchData()
  .then((data) => {
    process.stdout.write(JSON.stringify(data))
  })
}

// Execute data export
exportLegacy()
