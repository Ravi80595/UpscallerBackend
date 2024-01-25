const express = require('express')
const cors = require('cors')

const {connection } =require("./config/db")
const {UserRouter} = require('./routes/UserRoutes')
const {Projectrouter}= require('./routes/ProjectRoutes')
const {ContactRouter}= require('./routes/ContactRoutes')
const { TeamRouter } = require('./routes/TeamRoutes')
const { GoalRouter } = require('./routes/GoalRoutes')
const { Ticketrouter } = require('./routes/TicketRoutes')
const {PaymentRouter} = require('./routes/PaymentRoutes')


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
app.use('/team',TeamRouter)
app.use('/goal',GoalRouter)
app.use('/ticket',Ticketrouter)
app.use('/payment',PaymentRouter)

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
