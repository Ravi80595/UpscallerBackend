const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserRouter = express.Router()
const {authenticate} = require("../Middelwares/authenticate")

const { UserModel } = require("../Models/UserModel")



UserRouter.post("/signup",async(req,res)=>{
    const {name,email,password,brandName}= req.body
    const userPresent = await UserModel.findOne({email})
    if(userPresent){
        res.status(201).send({"msg":"User Already Exists"})
    }
try{
    bcrypt.hash(password,4,async function(err,hash){
        const user = new UserModel({email,password:hash,name,brandName})
        await user.save()
        res.send({"msg":"Signup Successfull"})
    })
}
catch(err){
    console.log(err)
    res.send(400).send({"err":"Something went wrong"})
}
})



UserRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await UserModel.find({email})
        if(user.length>0){
            const hashed_password = user[0].password
            bcrypt.compare(password,hashed_password,function(err,result){
                if(result){
                    const token= jwt.sign({"userID":user[0]._id},'ravi')
                    res.status(200).send({"msg":"Login Success","token":token})
                }else{
                    res.status(400).send({"msg":"Login Failed"})
                }
            })
        }else{
            res.status(400).send({"msg":"Login Failed"})
        }
    }
    catch(err){
        console.log(err)
        res.send(400).send({"err":"Something went wrong"})
    }
})


UserRouter.get("/userProfile", authenticate, async (req, res) => {
    const userId = req.body.userID
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ "msg": "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ "err": "Internal Server Error" });
    }
});


UserRouter.get("/allUsers", async (req, res) => {
    try {
        const allUsers = await UserModel.find({})
        res.status(200).send({"msg": "All Users", "data": allUsers});
    } catch (err) {
        console.log(err);
        res.status(400).send({"err": "Something went wrong"});
    }
});



module.exports={
    UserRouter
}