'use strict'

const express = require('express')
const router = express.Router()
const AuthHandler = require('../middlewares/auth/Handler')
const UserController = require('../controllers/UserController')

router.get('/', [AuthHandler.requiresAuthAndVerification , UserController.getAll])

module.exports = router
