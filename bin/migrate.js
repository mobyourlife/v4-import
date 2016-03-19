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
    console.log('Migration Results:')
    console.log('- Users:', data.users.length)
    console.log('- Websites:', data.sites.length)
  })
}

// Execute data migration
migrateData()
