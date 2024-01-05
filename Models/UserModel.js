const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name:String,
    brandName:String,
    email:String,
    password:String,
})

const UserModel = mongoose.model("User",userSchema)


module.exports={
    UserModel
}