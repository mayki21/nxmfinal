const mongoose=require("mongoose")

const uservisitschema=mongoose.Schema({
    userID:String,
    visitip:Array
})

const Uservisit=mongoose.model("visited",uservisitschema)

module.exports=Uservisit

