const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 8081

express()
    .use(express.static(path.join(__dirname, process.env.STATIC_DIR || 'dist')))
    .get('/user', (req, res) => {
        res.send({ok:true})
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))