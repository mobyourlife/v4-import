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
      mongoose.connect(database, console.error)

      console.log('Users')

      // Import users
      for (var u of data.users) {
        User.update({ email: u.email }, u, { upsert: true }, (err, result) => {
          if (err) {
            return reject(err)
          }
        })
      }

      console.log('Sites')

      // Import sites
      for (var s of data.sites) {
        Site.update({ name: s.name }, s, { upsert: true }, (err, result) => {
          if (err) {
            return reject(err)
          }
        })
      }

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
