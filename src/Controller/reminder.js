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
            query: `SELECT id, description, due, completed FROM reminders WHERE owner = ?`,
            queryValue: [token]
        })
        if (!resp.ok) {
            throw new Error(`Error fetching record from SQL ${resp}`)
        }
        return resp
    }
    static async _updateCompletedValue(connectionPool, id, owner, completeValue) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `UPDATE reminders set completed = ${completeValue} WHERE id = ? AND owner = ?`,
            queryValue: [id, owner]
        })
        if (!resp.ok) {
            throw new Error(`Error fetching record from SQL ${resp}`)
        }
        return resp
    }
    static async update(connectionPool, owner, id, description, due) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `UPDATE reminders set description = ?, due = ? WHERE id = ? AND owner = ?`,
            queryValue: [description, due, id, owner]
        })
        if (!resp.ok) {
            throw new Error(`Error fetching record from SQL ${resp}`)
        }
        return resp
    }
    static async delete(connectionPool, id, owner) {
        let resp = await Datalayer.executeQuery(connectionPool, {
            query: `DELETE from reminders WHERE id = ? AND owner = ?`,
            queryValue: [id, owner]
        })
        if (!resp.ok) {
            throw new Error(`Error fetching record from SQL ${resp}`)
        }
        return resp
    }
    static done(connectionPool, id, owner) {
        return Reminder._updateCompletedValue(connectionPool, id, owner, 1)
    }
    static async undone(connectionPool, id, owner) {
        return Reminder._updateCompletedValue(connectionPool, id, owner, 0)
    }
}


module.exports = {
    Reminder
}