'use strict'

// Load importer module
const Importer = require('../lib/importer')

/**
 * Fetch data from the legacy database.
 */
function fetchData () {
  let promise = new Promise((resolve, reject) => {
    // Initialise importer
    let old = new Importer()

    // Start jobs
    let users = old.getUsers()
    let fanpages = old.getFanpages()
    let domains = old.getDomains()
    let tickets = old.getTickets()

    // Group jobs
    let promises = []
    promises.push(users)
    promises.push(fanpages)
    promises.push(domains)
    promises.push(tickets)

    // Await for all promises
    Promise.all(promises).then((data) => {
      // Return a friendly object with everything
      resolve({
        users: data[0],
        fanpages: data[1],
        domains: data[2],
        tickets: data[3]
      })
    }, reject)
  })

  return promise
}

// Export data to the provided stream
module.exports = (stream) => {
  fetchData().then((data) => {
    let json = JSON.stringify(data)
    stream.write(json)
  })
}
