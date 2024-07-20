const Mongoose = require("mongoose")

const Userschema = Mongoose.Schema(
    {
        name: {
            type:String,
            required:true
        },
        phone : String,
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }
    }
)
var UserModel=Mongoose.model("Users",Userschema)
module.exports=UserModel