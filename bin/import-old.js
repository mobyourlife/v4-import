'use strict'

const api = require('mobv27-api/models')
const mongoose = require('mongoose')

const defaultConnection = 'mongodb://localhost:27017/mob-v3'

module.exports = ImportOld

function ImportOld (connection) {
  const database = connection || process.env.DATABASE || defaultConnection
  mongoose.connect(database)
}
