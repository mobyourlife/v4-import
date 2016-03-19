'use strict'

// Load modules
const Importer = require('../lib/importer')
const upgrade = require('../lib/upgrade')

/**
 * Upgrade data from the legacy schema to the new schema.
 */
function migrateData () {
  let legacy = new Importer()

  legacy.fetchData()
  .then(upgrade)
  .then((data) => {
    process.stdout.write(JSON.stringify(data))
  })
}

// Execute data migration
migrateData()
