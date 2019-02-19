require('dotenv').config();
const express = require('express')
const { Routes } = require("./src/Router/routes")

const router = new Routes(express())
router.registerAllRoutes()
router.listen(process.env.PORT || 8081, () => console.log(`Listening on ${process.env.PORT || 8081}`))
