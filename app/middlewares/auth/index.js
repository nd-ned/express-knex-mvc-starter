'use strict'

const User = require('../../models/User')

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization')

    let bearer = null,
        user = null

    if (authHeader) {
        bearer = authHeader.replace("Bearer ","")
    }

    if (bearer) {
        user = await User.getByBearer(bearer)
    }
    
    req.auth = {
        bearer,
        user
    }

    next()
}