const Mongoose = require('mongoose')

const postSchema=Mongoose.Schema(
    {

        userId :{
            type: Mongoose.Schema.Types.ObjectId,
            ref:"users"
        },

        Message:String,

        PostedDate:{
            type:Date,
            default:Date.now
        }
    }

    
)

var postModel=Mongoose.model("posts",postSchema)
module.exports=postModel