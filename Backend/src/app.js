const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(
    cors({
        origin: "gaplift.vercel.app",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.originalUrl);
    next();
});

app.use((req, res, next) => {
    if (
        req.path.startsWith("/api") &&
        mongoose.connection.readyState !== 1
    ) {
        return res.status(503).json({
            message:
                "Database not connected. Check MongoDB URI, Atlas Network Access and Internet."
        });
    }

    next();
});

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;