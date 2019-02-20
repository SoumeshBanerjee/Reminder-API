const cookieParser = require('cookie-parser')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const { Datalayer } = require("../datalayer")
const { User } = require("../Controller/user")
const { Reminder } = require("../Controller/reminder")

const SingeltonDatalayer = new Datalayer(
    process.env.DATALAYER_HOST,
    process.env.DATALAYER_USERNAME,
    process.env.DATALAYER_PASSWORD,
    process.env.DATALAYER_DATABASE
)

class Routes {
    constructor(expressApp) {
        this.app = expressApp
    }
    static getSessionCookie(req) {
        return req.cookies[process.env.SESSION_COOKIE_NAME || 'USER_AUTH_TOKEN']
    }
    static isAuthenticated(req) {
        if (Routes.getSessionCookie(req)) {
            return true
        }
        return false
    }
    static needsAuthorization(req, res, next) {
        if (Routes.isAuthenticated(req)) {
            return next();
        }
        Routes.sendErrorResponse(res, 401, `You are unauthorised to make the request`)
    }
    static sendErrorResponse(respHandler, HTTPErrorCode, message) {
        console.log(JSON.stringify({
            HTTPErrorCode: HTTPErrorCode,
            message: message
        }))
        respHandler.status(HTTPErrorCode)
        respHandler.send({
            ok: false,
            error: message
        })
    }
    listen(port, callback) {
        this.app.listen(port, callback)
    }
    registerAllRoutes() {
        this._registerMiddleware()
        this._registerAllUserHandlers()
        this._registerAllReminderHandlers()
        this._registerStaticRoute()
    }
    _registerStaticRoute() {
        this.app
            .use('/', express.static(path.join(path.dirname(require.main.filename), process.env.STATIC_DIR || 'dist')))
            .get('/:token', (req, res) => {
                console.log('redirecting')
                res.redirect('/')
            })
    }
    _registerMiddleware() {
        this.app
            .use(cookieParser())
            .use(bodyParser.json())
    }
    _registerAllUserHandlers() {
        this.app
            .get('/user', Routes.needsAuthorization, async (req, resp) => {
                try {
                    let r = await User.get(SingeltonDatalayer, Routes.getSessionCookie(req))
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to fetch user ${error}`)
                }
            })
            .post('/user', async (req, resp) => {
                try {
                    if (Routes.isAuthenticated(req)) {
                        Routes.sendErrorResponse(resp, 400, `Alreay a active session exists, use /user endpoint to get user info`)
                    }
                    if (!req.body.name || !req.body.token) {
                        Routes.sendErrorResponse(resp, 400, `both name and token is required`)
                    }
                    let r = await User.create(SingeltonDatalayer, req.body.name, req.body.token)
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to create user, may already same token user exists ${error}`)
                }
            })
    }
    _registerAllReminderHandlers() {
        this.app
            .get('/reminders', Routes.needsAuthorization, async (req, resp) => {
                try {
                    let r = await Reminder.getAll(SingeltonDatalayer, Routes.getSessionCookie(req))
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to fetch all the reminders ${error}`)
                }
            })
            .post('/reminders', Routes.needsAuthorization, async (req, resp) => {
                try {
                    if (!req.body.description || !req.body.due) {
                        Routes.sendErrorResponse(resp, 400, `all the fields description and due is required`)
                    }
                    let r = await Reminder.create(SingeltonDatalayer, Routes.getSessionCookie(req), req.body.description, req.body.due)
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to create reminder, maybe the user not registered properly ${error}`)
                }
            })
            .patch('/reminders/done/:id', Routes.needsAuthorization, async (req, resp) => {
                try {
                    if (!req.params.id) {
                        Routes.sendErrorResponse(resp, 400, `To mark a reminder done, id is mandatory`)
                    }
                    let r = await Reminder.done(SingeltonDatalayer, req.params.id, Routes.getSessionCookie(req))
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to mark reminder done ${error}`)
                }
            })
            .patch('/reminders/undone/:id', Routes.needsAuthorization, async (req, resp) => {
                try {
                    if (!req.params.id) {
                        Routes.sendErrorResponse(resp, 400, `To mark a reminder undone, id is mandatory`)
                    }
                    let r = await Reminder.undone(SingeltonDatalayer, req.params.id, Routes.getSessionCookie(req))
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to mark reminder undone ${error}`)
                }
            })
            .delete('/reminders/:id', Routes.needsAuthorization, async (req, resp) => {
                try {
                    if (!req.params.id) {
                        Routes.sendErrorResponse(resp, 400, `To delete a reminder, id is mandatory`)
                    }
                    let r = await Reminder.delete(SingeltonDatalayer, req.params.id, Routes.getSessionCookie(req))
                    resp.send(r)
                } catch (error) {
                    Routes.sendErrorResponse(resp, 500, `Failed to delete reminder ${error}`)
                }
            })
    }
}

module.exports = {
    Routes
}