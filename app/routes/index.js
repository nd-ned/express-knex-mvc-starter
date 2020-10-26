'use strict'

const express = require('express')
const usersRouter = require('./users')
const authRouter = require('./auth')
const router = express.Router()
const apiRouter = express.Router()


apiRouter.use('/users', usersRouter)
apiRouter.use('/auth', authRouter)

router.use('/api', apiRouter)


module.exports = router