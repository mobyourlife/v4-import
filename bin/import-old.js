'use strict'

// Initialise import module
const Importer = require('../lib/importer')
const old = new Importer()

/**
 * Fetch data from the legacy database.
 */
function fetchData () {
  let promise = new Promise((resolve, reject) => {
    // Start jobs
    let fanpages = old.getFanpages()

    // Group jobs
    let promises = []
    promises.push(fanpages)

    // Await for all promises
    Promise.all(promises).then((data) => {
      // Return a friendly object with everything
      resolve({
        fanpages: data[0]
      })
    }, reject)
  })

  return promise
}

/**
 * Print data in console for debugging purposes.
 * @param  {Object} data Imported data.
 */
function printData (data) {
  console.log('=== COMMENCING IMPORT PROCESS ===')
  console.log('Fanpages:', data.fanpages.length)
}

// Run the import process
fetchData().then(printData)
