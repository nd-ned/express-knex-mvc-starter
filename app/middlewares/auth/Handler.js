'use strict'

const User = require('../../models/User')



class Handler {
  
  static requireAuth(req, res, next) {
    console.log("require auth", new Date(req.auth.user.token.updated_at).getTime())
    if (!req.auth.bearer) {
      return res.apiBadRequest("Bearer token not provided")
    }

    if (!req.auth.user) {
      return res.apiUnauthorized("Token expired!")
    }

    const tokenExpirationDate = new Date(new Date().getTime() + parseInt(process.env.TOKEN_EXPIRATION_IN_HOURS) * 60 * 60 * 1000)


    console.log(tokenExpirationDate)
    if (tokenExpirationDate < new Date()) {
      return res.apiUnauthorized("Token expired!")
    }

    next()
  }

  static async requiresAuthAndVerification(req, res, next) {
    await requireAuth(req, res, next)

    // TODO: add verification
    
    next()
  }

  static onlyOwnerAccess(req, res, next) {

  }

  static allowAdminAccess(req, res, next) {

  }
}

module.exports = Handler