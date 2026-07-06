const { Router } = require('express')
const authController=require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

const authRouter=Router()
/**
 * @routes POST /api/auth/register
 * @description user can register here
 * @access public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @routes POST /api/auth/login
 * @description user can login form here
 * @access public
 */
authRouter.post("/login", (req, res, next) => {
    console.log("🔥 LOGIN ROUTE HIT");
    console.log("shubham test inside post login")
    next();
}, authController.userLoginController);
/**
 * @routes GET /api/auth/logout
 * @description remove token from cookies and add token into blacklist
 * @access public
 */
authRouter.get("/logout",authController.logoutusercontroller)

/**
 * @routes GET /api/auth/get-me
 * @description it will give details of current login user
 * @access private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=authRouter; 