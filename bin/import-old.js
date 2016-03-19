'use strict'

// Load modules
const api = require('mobv27-api/models')
const mongoose = require('mongoose')

// Connect to the database
const defaultConnection = 'mongodb://localhost:27017/mob-v3'
const database = process.env.DATABASE || defaultConnection
mongoose.connect(database)
