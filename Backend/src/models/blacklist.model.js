const mongoose = require('mongoose')

const blackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blacklist"]
    }
},{
timestamps:true})

const tokenBlacklistmodel = mongoose.model("blacklistToken",blackListSchema)

module.exports=tokenBlacklistmodel

