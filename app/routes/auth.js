'use strict'

const express = require('express')

const router = express.Router()
const AuthController = require('../controllers/http/api/AuthController')

router.post('/check/email', AuthController.checkEmail)
router.post('/check/username', AuthController.checkUsername)
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

module.exports = router
