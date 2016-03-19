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
    let tickets = old.getTickets()

    // Group jobs
    let promises = []
    promises.push(fanpages)
    promises.push(domains)
    promises.push(tickets)

    // Await for all promises
    Promise.all(promises).then((data) => {
      // Return a friendly object with everything
      resolve({
        fanpages: data[0],
        domains: data[1],
        tickets: data[2]
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
  console.log('Tickets:', data.tickets.length)
}

// Run the import process
fetchData().then(printData)
