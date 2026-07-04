const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenblacklistmodel=require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register user via username , email, password
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "PLEASE PROVIDE ALL USERNAME, EMAIL and PASSWORD"
        })
    }

    const isUserExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserExist) {
        if (isUserExist.username === username) {
            return res.status(400).json({
                message: "ACCOUNT ALREADY EXIST WITH THIS USERNAME"
            })
        }

        return res.status(400).json({
            message: "ACCOUNT ALREADY EXIST WITH THIS EMAIL"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "USER REGISTERED SUCCESSFULLY",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name authLoginController
 * @description to login user
 * @access public
 */
async function userLoginController(req, res) {
    console.log("🔥 LOGIN CONTROLLER HIT");

    return res.status(200).json({
        success: true,
        message: "Login controller reached"
    });
}
/**
 * @name logoutusercontroller
 * @description remove token from cookie and add token in blacklist
 * @access public
 */
async function logoutusercontroller(req,res){
    const token = req.cookies.token
    if(token){
        await tokenblacklistmodel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"USER LOGGED OUT SUCESSFULLY"
    })
}

/**
 * @name get-me
 * @description get the current login user details
 * @access private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user detail fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports = {
    registerUserController,
    userLoginController,
    logoutusercontroller,
    getMeController
}
