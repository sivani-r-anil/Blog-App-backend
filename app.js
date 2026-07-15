const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/user.js")

let app = express()
app.use(express.json())
app.use(cors())               //security purpose


mongoose.connect("mongodb://sivani_r_anil:siva123@ac-0k7dbum-shard-00-00.ojotgu3.mongodb.net:27017,ac-0k7dbum-shard-00-01.ojotgu3.mongodb.net:27017,ac-0k7dbum-shard-00-02.ojotgu3.mongodb.net:27017/blogdb?ssl=true&replicaSet=atlas-gxc29u-shard-0&authSource=admin&appName=Cluster0")

app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    console.log(input)


    //res.send(data)  //to test if output is coming or not


    //to check for duplicate email
    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {
                res.json({ "status": "Email already exists" })
            } else {
                let result = new userModel(input)
                result.save()
                res.json({ "status": "Success" })            //only one res is in an api
            }

        }
    ).catch()


})




app.listen(2000, () => {
    console.log("Server is running on port 2000")
})