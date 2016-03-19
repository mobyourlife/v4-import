'use strict'

// Load modules
const Importer = require('../lib/importer')

/**
 * Migrate data from the legacy schema to the new schema.
 */
function migrateData () {
  let legacy = new Importer()
  legacy.fetchData().then(console.log)
}

// Execute data migration
migrateData()
