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
    let domains = old.getDomains()

    // Group jobs
    let promises = []
    promises.push(fanpages)
    promises.push(domains)

    // Await for all promises
    Promise.all(promises).then((data) => {
      // Return a friendly object with everything
      resolve({
        fanpages: data[0],
        domains: data[1]
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
  console.log('Domains:', data.domains.length)
}

// Run the import process
fetchData().then(printData)
