'use strict'

// Load modules
const api = require('mobv27-api/models')
const mongoose = require('mongoose')

// Default legacy database connection
const defaultConnection = 'mongodb://localhost:27017/mob-v3'

// Export module's entry point
module.exports = Importer

/**
 * Import legacy data and output to a stream.
 * @param  {String} [connection]  MongoDB connection string.
 */
function Importer (connection) {
  const database = connection || process.env.DATABASE || defaultConnection

  /**
   * Fetch data from the legacy database.
   */
  this.fetchData = () => {
    let promise = new Promise((resolve, reject) => {
      // Connect to the database
      mongoose.connect(database)

      // Start jobs
      let users = getUsers()
      let fanpages = getFanpages()
      let domains = getDomains()
      let tickets = getTickets()

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
}

/**
 * Get Users list.
 */
function getUsers () {
  let promise = new Promise((resolve, reject) => {
    api.user.find((err, users) => {
      if (err) {
        reject(err)
      } else {
        resolve(users)
      }
    })
  })

  return promise
}

/**
 * Get registered fanpages list.
 */
function getFanpages () {
  let promise = new Promise((resolve, reject) => {
    api.fanpage.find((err, fanpages) => {
      if (err) {
        reject(err)
      } else {
        resolve(fanpages)
      }
    })
  })

  return promise
}

/**
 * Get domains list.
 */
function getDomains () {
  let promise = new Promise((resolve, reject) => {
    api.domain.find((err, domains) => {
      if (err) {
        reject(err)
      } else {
        resolve(domains)
      }
    })
  })

  return promise
}

/**
 * Get payment tickets list.
 */
function getTickets () {
  let promise = new Promise((resolve, reject) => {
    api.ticket.find({ 'payment': { $exists: true } }, (err, tickets) => {
      if (err) {
        reject(err)
      } else {
        resolve(tickets)
      }
    })
  })

  return promise
}
