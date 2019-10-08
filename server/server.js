const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')

const server = express()

const actionsRouter = require('./actions/actionsRouter')
const projectRouter = require('../projects/projectRouter')

//middleware
server.use(express.json())
server.use('/actions', actionsRouter)
server.use('/projects', projectRouter)

server.use(logger('dev'))//does logging
server.use(helmet())///security headers

server.get('/', (req, res) => {
    res.status(200).json({ "007": "Golden Eye"});
})

module.exports = server
///express is actual server
