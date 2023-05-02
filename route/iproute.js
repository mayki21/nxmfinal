const axios=require("axios")
const express=require("express")
const redis=require("../redis")
const uservisit=require("../model/uservisitmodel")
const Uservisit = require("../model/uservisitmodel")
const iprout=express.Router()

iprout.get("/detail",async(req,res)=>{
    const ip=req.query.ip
    const data=await redis.get(ip)
    if(data)
    {
        console.log("from redis")
        return res.status(200).send(data)
    }
    else
    {
        const result=await axios.get(`https://ipapi.co/${ip}/json/`)
        const fdata=result.data
        redis.set(ip,JSON.stringify(fdata),"EX",6*60*60)
        console.log("axios")
        // await uservisit.findOneAndUpdate({userID:req.userID},{userID:req.userID,$push:{visitip:ip}},{new:true,upsert:true})
        res.status(200).send(fdata)
    }
})

iprout.get("/visitip",async(req,res)=>{
    const visitip=await uservisit.findOne({userID:req.userID})
    res.status(200).send(visitip)
})