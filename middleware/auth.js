const jwt=require("jsonwebtoken")
const redis=require("../redis")
require("dotenv").config()
const authr= async (req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1]
    if(token)
    {
        const isblack=await redis.get(token)
        if(isblack)
        {
            return res.status(400).send({msg:"you have logout ,login pls"})
        }
        jwt.verify(token,process.env.secret,(err,decoded)=>{
            if(decoded)
            {
                req.body.userID=decoded.userID
                next()
            }
            else
            {
                return res.status(400).send({msg:"session expired"})
            }
        })
    }
    else
    {
        res.status(400).send({msg:"you have to login first"})
    }
}
module.exports=authr