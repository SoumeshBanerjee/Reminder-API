const { Datalayer } = require("../datalayer")

class User {
    static async create(connectionPool, name, token) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `INSERT INTO users (name, token) VALUES (?, ?)`,
            queryValue: [name, token]
        })
        if (!resp.ok) {
            throw new Error(`Error saving record from SQL ${resp}`)
        }
        return resp
    }
    static async get(connectionPool, token) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `SELECT * FROM users WHERE token = ?`,
            queryValue: [token]
        })
        if (!resp.ok) {
            throw new Error(`Error fetching record from SQL ${resp}`)
        }
        return resp
    }
}

module.exports = {
    User
}