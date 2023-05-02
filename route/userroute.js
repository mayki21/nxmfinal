const express=require("express")
const redis=require("../redis")
const Usermodel=require("../model/usermodel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userroute=express.Router()


userroute.post("/signup",async(req,res)=>{
    try 
    {
        const {name,email,password}=req.body
        const userpresent=await Usermodel.findOne({email})
        if(userpresent)
        {
            return res.send({msg:"already registered user try another email"})
        }
        bcrypt.hash(password,9,async(err,hash)=>{
            const usernew=new Usermodel({name,email,password:hash,city})
            await usernew.save()
            res.send({msg:"Registed"})

        })
        
    } 
    
    catch (error)
    {
        res.status(400).send({msg:error.message})
    }
   

})

userroute.post("/login",async(req,res)=>{
    try 
    {
        const {email,password}=req.body
        const user=await Usermodel.findOne({email})
        if(!user)
        {
            return res.send({msg:"user not found"})
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            {
                if(result)
                {
                    const token =jwt.sign({userID:user._id},process.env.secret,{expiresIn:"6h"})
                    res.status(200).send({msg:"login done"},token)
                }
                else
                {
                    res.status(400).send({msg:"wrong details entered check it"})
                }
            }
        })

        
    } 
    catch (error) {
        res.status(400).send({msg:error.message})
    }
})




userroute.get("/logout",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    redis.set(token,1,"EX",60*60)
    res.status(200).send({msg:"Logout done"})
})


module.exports=userroute