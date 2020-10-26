'use strict'

const crypto = require('crypto')
const bcrypt = require('bcrypt')

class AuthService {

    static async generateHash(string) {
        return await bcrypt.hash(string, 10)
    }

    static async verifyHash(string, hash) {
        return await bcrypt.compare(string, hash)
    }

    static generateToken_E() {
        return crypto.randomBytes(Math.floor(Math.random() * 20) + 100).toString('base64')
    }
}

module.exports = AuthService