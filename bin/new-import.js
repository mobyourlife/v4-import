'use strict'

// Load modules
const getStdin = require('get-stdin')
const NewImporter = require('../lib/new-importer')

/**
 * Import new data.
 */
function importData () {
  let newImport = new NewImporter()

  getStdin()
  .then((str) => {
    let data = JSON.parse(str)
    return newImport.saveData(data)
  })
  .then((results) => {
    process.stdout.write(JSON.stringify(data))
  })
}

// Execute data export
importData()
