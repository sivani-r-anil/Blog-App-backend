const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let app = express()

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(2000, () => {
    console.log("Server is running on port 2000")
})