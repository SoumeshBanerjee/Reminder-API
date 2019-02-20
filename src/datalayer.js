const mysql = require('mysql')

class Datalayer {
    constructor(host, username, password, database) {
        this.host = host
        this.username = username
        this.password = password
        this.database = database
        this.connectionPool = null
        this._initlizeDB()
    }
    _initlizeDB() {
        this.connectionPool = new mysql.createPool({
            connectionLimit: process.env.DATALAYER_MAX_CONNECTION || 10,
            host: this.host,
            user: this.username,
            password: this.password,
            database: this.database,
            dateStrings: true
        })
    }
    static executeQuery(dataLayerInstance, config) {
        return new Promise((ok, err) => {
            if (true !== dataLayerInstance instanceof Datalayer) {
                err(new Error(`Expected an instance of datalayer got ${typeof dataLayerInstance}`))
            }
            if (!dataLayerInstance.connectionPool) {
                err(new Error(`Connection pool is empty, maybe a sql service error`))
            }
            dataLayerInstance.connectionPool.query(config.query || "", config.queryValue || [], function (error, results, fields) {
                if (error) {
                    err(new Error(`Error occured while executing the query ${error}`))
                }
                ok({
                    ok: true,
                    results: results
                })
            })
        })
    }
}

module.exports = {
    Datalayer
}