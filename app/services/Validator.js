'use strict'

class Validator {
    static checkRequiredFields = fields => {
        if (!Array.isArray(fields)) {
            throw new Error("Internal Server Error::: Parameter fields is not of type array!")
        }

        var failed = []

        fields.forEach(field => {
            if (!req.body[field]) {
                failed.push(field)
            }
        })

        return failed.length ? failed : null
    }

    static invalidateUsername = username => {
        if (username.lenght > 20) return null
        return username.match(/^[a-z1-9]{4,20}$/)
    }

    static invalidateEmail = email => {
        return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
    }
}

module.exports = Validator