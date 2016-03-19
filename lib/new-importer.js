'use strict'

// Load modules
const mongoose = require('mongoose')
const Site = require('mob-api/models/site')
const User = require('mob-api/models/user')

// Default database connection
const defaultConnection = 'mongodb://localhost:27017/mobyourlife'

// Export module's entry point
module.exports = Importer

/**
 * Export new data to the new database.
 * @param {String} [connection] MongoDB connection string.
 */
function Importer (connection) {
  const database = connection || process.env.NEW_DATABASE || defaultConnection

  /**
   * Save data to the new database.
   * @param  {Object} data Data to be exported.
   */
  this.saveData = (data) => {
    let promise = new Promise((resolve, reject) => {
      console.log('Connecting to', database)
      console.log('Users:', data.users.length)
      console.log('Sites:', data.sites.length)

      // Connect to the database
      let db = mongoose.createConnection(database, console.error)

      console.log('Users')

      // Export users
      let bulkUsers = db.model('User').collection.initializeUnorderedBulkOp({ useLegacyOps: true })
      for (var u of data.users) {
        bulkUsers.insert(u)
      }
      let promiseUsers = promiseBulk(bulkUsers)

      console.log('Sites')

      // Export sites
      let bulkSites = db.model('Site').collection.initializeUnorderedBulkOp({ useLegacyOps: true })
      for (var s of data.sites) {
        bulkSites.insert(s)
      }
      let promiseSites = promiseBulk(bulkSites)

      console.log('Promise')

      // Await for bulk inserts
      Promise.all([
        promiseUsers,
        promiseSites
      ]).then((results) => {
        // Disconnect from the database
        db.close()

        console.log(JSON.stringify(results, null, 2))
      })
    })
  }
}

/**
 * Promisify a bulk insert.
 * @param  {Object} bulk  Object ready to be bulk inserted.
 * @return {promise}      Promise to execute the bulk insert.
 */
function promiseBulk (bulk) {
  let promise = new Promise((resolve, reject) => {
    bulk.execute((err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })

  return promise
}
