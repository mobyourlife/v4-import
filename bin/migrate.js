'use strict'

// Load modules
const Importer = require('../lib/importer')
const migrate = require('../lib/migrate')

/**
 * Migrate data from the legacy schema to the new schema.
 */
function migrateData () {
  let legacy = new Importer()
  legacy.fetchData().then(migrate)
}

// Execute data migration
migrateData()
