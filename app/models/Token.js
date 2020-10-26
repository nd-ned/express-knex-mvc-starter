'use strict'


const Base = require('./Base')
const User = require('./User')

class Token extends Base {
    constructor() {
        super('tokens')
    }
}

module.exports = new Token()