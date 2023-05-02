const express=require("express")
require("dotenv").config()


const connection=require("./connections/db")
const userroute = require("./route/userroute")
const iproute=require("./route/iproute")
const authr = require("./middleware/auth")
const app=express()
app.use(express.json())


app.use("/user",userroute)
app.use(authr)
app.use("/ip",iproute)





app.listen(process.env.port,async()=>{
    await connection
    console.log("connected")
})