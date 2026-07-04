const mongoose = require("mongoose");

//mongoose.set("bufferCommands", false);

mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("❌ MongoDB Disconnected");
});

async function connectToDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database:", mongoose.connection.db.databaseName);
    console.log("Ready State:", mongoose.connection.readyState);
}

module.exports = connectToDB;