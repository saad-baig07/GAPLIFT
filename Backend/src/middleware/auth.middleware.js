const jwt = require('jsonwebtoken')
const tokenBlacklistmodel=require("../models/blacklist.model")


async function authUser(req,res,next){
    const token = req.cookies.token
    //is token valid
    if(!token)
    {
        return res.status(401).json({
            message:"Token not provided"
        })
    }
    //is token blacklisted
    const isTokenBlacklisted= await tokenBlacklistmodel.findOne({token})
    if(isTokenBlacklisted)
    {
        return res.status(401).json({
            message:"Token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
    catch(err)
    {
        return res.status(401).json({
            message:"Invalid token provided"
        })
    }
}

module.exports={authUser}