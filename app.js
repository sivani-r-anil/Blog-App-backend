const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/user.js")
const postModel = require("./models/posts.js")

let app = express()
app.use(express.json())
app.use(cors())               //security purpose


mongoose.connect("mongodb://sivani_r_anil:siva123@ac-0k7dbum-shard-00-00.ojotgu3.mongodb.net:27017,ac-0k7dbum-shard-00-01.ojotgu3.mongodb.net:27017,ac-0k7dbum-shard-00-02.ojotgu3.mongodb.net:27017/blogdb?ssl=true&replicaSet=atlas-gxc29u-shard-0&authSource=admin&appName=Cluster0")



//signUp api
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



//signIn api
app.post("/signin", async (req, res) => {

    let input = req.body
    let result = userModel.find({ email: req.body.email }).then(

        (items) => {
            if (items.length > 0) {
                const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {

                    jwt.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" }, (err, token) => {
                        if (err) {
                            res.json({ "status": "error", "error": err })
                        }
                        else {
                            res.json({ "status": "Success", "token": token, "user": items[0]._id })           //token is generated and sent to the user.token is used to verify the user and to check if the user is logged in or not. it is used for security purpose.
                        }

                    })
                }
                else {
                    res.json({ "status": "invalid password" })
                }
            }
            else {
                res.json({ "status": "invalid email" })
            }
        }

    ).catch()

})


//create a post
app.post("/create", async (req, res) => {

    let input = req.body
    let token = req.headers.token        //token is sent in the header of the request. it is used to verify the user and to check if the user is logged in or not. it is used for security purpose.
    jwt.verify(token, "blogApp", async (err, decoded) => {

        if (decoded && decoded.email) {
            let result = new postModel(input)
            await result.save()
            res.json({ "status": "Success" })
        }
        else {
            res.json({ "status": "Invalid authentication" })
        }

    })

})


//view all posts
app.post("/viewall", async (req, res) => {

    let token = req.headers.token        //token is sent in the header of the request. it is used to verify the user and to check if the user is logged in or not. it is used for security purpose.
    jwt.verify(token, "blogApp", async (err, decoded) => {

        if (decoded && decoded.email) {
            postModel.find().then(

                (items) => {
                    res.json(items)
                }

            ).catch(

                (error) => {
                    res.json({ "status": "error" })
                }

            )
        }
        else {
            res.json({ "status": "Invalid authentication" })
        }

    })
})



    app.listen(2000, () => {
        console.log("Server is running on port 2000")
    })