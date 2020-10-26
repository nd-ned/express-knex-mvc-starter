'use strict'


const Base = require('./Base')
const Token = require('./Token')

class User extends Base {
    constructor() {
        super('users')

        this.columns = ['id', 'name', 'username', 'email', 'created_at', 'updated_at']
    }

    async withTokens(id) {
        const user = await this.findById(id)
        user.tokens = await Token.findAll({user_id: user.id})

        return user
    }

    async getByBearer(access_token) {
        const token = await Token.findOne({access_token})
        
        if (!token) return null

        const user = await this.findById(token.user_id)

        user.token = token

        return user
    }
}

module.exports = new User()