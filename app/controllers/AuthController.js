'use strict'

const User = require('../models/User')
const Token = require('../models/Token')
const AuthService = require('../services/AuthService')
const Validator = require('../services/Validator')

const _enforceUniqueToken = async (type, string) => {
    if (await Token.findOne({[type]: string})) {
        return _enforceUniqueToken(type, AuthService.generateToken_E())
    }

    return string
}

class AuthController {
    static async checkEmail(req, res, next) {
        try {
            const email = req.body.email

            if (!email) {
                return res.apiBadRequest("Missing mandatory paramer email")
            }

            if (await User.findOne({email})) {
                return res.apiConflict(`Email ${email} already taken!`)
            }

            return res.apiAccepted("Email currently available!")
        } catch (e) {
            next(e)
        }
    }

    static async checkUsername(req, res, next) {
        try {
            const username = req.body.username

            if (!username) {
                return res.apiBadRequest("Missing mandatory parameter username")
            }

            if (Validator.invalidateUsername(username)) {
                return res.apiUnprocessableEntity("Invalid username! It must validate [a-z0-9]{4-20}")
            }
            
            if (await User.findOne({username})) {
                return res.apiConflict(`Username ${username} already taken!`)
            }

            return res.apiAccepted("Username currently available!")
        } catch (e) {
            next(e)
        }
    }

    static async register(req, res, next) {
        try {
            const failed = Validator.checkRequiredFields(['name', 'email', 'username', 'password'])

            if (failed) {
                return res.apiBadRequest("Missing mandatory paramers: " + failed.join(','))
            }

            const { name, email, username, password } = req.body

            if (Validator.invalidateUsername(username)) {
                return res.apiUnprocessableEntity("Invalid username! It must validate [a-z0-9]{4-20}")
            }

            if (await User.findOne({email})) {
                return res.apiConflict(`Email address ${email} already taken!`)
            } else if (await User.findOne({username})) {
                return res.apiConflict(`Username ${username} already taken!`)
            }

            const user = await User.create({
                name,
                email,
                username,
                password_hash: await AuthService.generateHash(password)
            })

            res.apiCreated('User created successfully', user)
        } catch(e) {
            next(e)
        }
    }

    static async login(req, res, next) {
        
        try {
            const {username, email, password} = req.body
            let user = null
    
            if (!password) {
                return res.apiBadRequest("Missing mandatory parameter password")
            }
    
            if (username) {
                user = await User.findOne({username})

                if (!user) {
                    return res.apiNotFound("Bad username / wrong password")
                }


            } else if (email) {
                user = await User.findOne({username})

                if (!user) {
                    return res.apiNotFound("Bad email / wrong password")
                }

            } else {
                return res.apiBadRequest("To login, you must provide username or email")
            }

            user.token = {
                device: req.headers['user-agent'],
                access_token: await _enforceUniqueToken('access_token', AuthService.generateToken_E()),
                refresh_token: await _enforceUniqueToken('refresh_token', AuthService.generateToken_E()),
                user_id: user.id,
                expires_in: 86400 // 24h
            }

            await Token.create(user.token)

            return res.apiOK("Login successful!", user)
        } catch (e) {
            next(e)
        }
        
    }
}

module.exports = AuthController