'use strict'


const User = require('../../models/User')

class Handler {
  
  static requireAuth(req, res, next) {
    if (!req.auth.bearer) {
      return res.apiBadRequest("Bearer token not provided")
    }

    if (!req.auth.user) {
      return res.apiUnauthorized("Token expired!")
    }

    const tokenExpirationDate = new Date(new Date().getTime() + parseInt(process.env.TOKEN_EXPIRATION_IN_HOURS) * 60 * 60 * 1000)

    if (tokenExpirationDate < new Date()) {
      return res.apiUnauthorized("Token expired!")
    }

    next()
  }

  static async requiresAuthAndVerification(req, res, next) {
    Handler.requireAuth(req, res, function() {
      // TODO: add verification
      next()
    })
  }

  static async onlyOwnerAccess(req, res, next) {

    
    Handler.requireAuth(req, res, function() {
      
      // TODO: add admin access rule
      if (req.auth.user && req.auth.user.id !== parseInt(req.params.user_id)) {
        return res.apiForbidden()
      }

      next()
    })


  }

  static allowAdminAccess(req, res, next) {

  }
}

module.exports = Handler