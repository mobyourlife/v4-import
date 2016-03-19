'use strict'

// Load modules
const api = require('mobv27-api/models')
const mongoose = require('mongoose')

// Default legacy database connection
const defaultConnection = 'mongodb://localhost:27017/mob-v3'

// Exported module
module.exports = Importer

/**
 * The Importer module will fetch all relevant information from the legacy database.
 * @param {String} [connection] MongoDB connection string.
 */
function Importer (connection) {
  const database = connection || process.env.DATABASE || defaultConnection
  mongoose.connect(database)

  // Exported methods
  this.getFanpages = GetFanpages
}

/**
 * Get all registered fanpages.
 */
function GetFanpages () {
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
