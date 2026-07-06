const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenblacklistmodel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description register user via username , email, password
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "PLEASE PROVIDE ALL USERNAME, EMAIL and PASSWORD"
        });
    }

    const isUserExist = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserExist) {
        if (isUserExist.username === username) {
            return res.status(400).json({
                message: "ACCOUNT ALREADY EXIST WITH THIS USERNAME"
            });
        }

        return res.status(400).json({
            message: "ACCOUNT ALREADY EXIST WITH THIS EMAIL"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "500d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        message: "USER REGISTERED SUCCESSFULLY",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name authLoginController
 * @description Login User
 * @access Public
 */
async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "USER LOGIN SUCCESSFULLY",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name logoutUserController
 * @description Logout User
 */
async function logoutusercontroller(req, res) {
    const token = req.cookies.token;

    if (token) {
        await tokenblacklistmodel.create({ token });
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        message: "USER LOGGED OUT SUCCESSFULLY"
    });
}

/**
 * @name getMeController
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {
    registerUserController,
    userLoginController,
    logoutusercontroller,
    getMeController
};