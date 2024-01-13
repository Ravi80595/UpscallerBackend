const express = require('express')
const cors = require('cors')

const {connection } =require("./config/db")
const {UserRouter} = require('./routes/UserRoutes')
const {Projectrouter}= require('./routes/ProjectRoutes')
const {ContactRouter}= require('./routes/ContactRoutes')
const app = express()


app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.status(200).send({"msg":"welcome to Upscaller API"})
})

// app.use("/user",UserRouter)

app.use("/user",UserRouter)
app.use('/project',Projectrouter)
app.use('/contact',ContactRouter)


app.listen(2148,async()=>{
    try{
        await connection
        console.log("Connected to Database")
    }
    catch(err){
        console.log(err)
        console.log("connection failed")
    }
    console.log("Listning on Port 2148")
})
