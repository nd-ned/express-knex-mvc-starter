require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const authMiddleware = require('./app/middlewares/auth/index')
const requestMiddleware = require('./app/middlewares/request')
const responseMiddleware = require('./app/middlewares/response')
const errorHandlerMiddleware = require('./app/middlewares/errorHandler')
const indexRouter = require('./app/routes/index')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(authMiddleware)
app.use(requestMiddleware)
app.use(responseMiddleware)

app.use('/', indexRouter)

app.use(errorHandlerMiddleware)

module.exports = app
