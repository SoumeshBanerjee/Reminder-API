const { Datalayer } = require("../datalayer")

class Reminder {
    static async create(connectionPool, owner, description, due) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `INSERT INTO reminders (owner, description, due) VALUES (?, ?, ?)`,
            queryValue: [owner, description, due]
        })
        if (!resp.ok) {
            throw new Error(`Error saving record from SQL ${resp}`)
        }
        return resp
    }
    static async getAll(connectionPool, token) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `SELECT * FROM reminders WHERE owner = ?`,
            queryValue: [token]
        })
        if (!resp.ok) {
            throw new Error(`Error fetching record from SQL ${resp}`)
        }
        return resp
    }
    static async done() {

    }
    static async delete() {

    }
    static async undone() {

    }
}


module.exports = {
    Reminder
}