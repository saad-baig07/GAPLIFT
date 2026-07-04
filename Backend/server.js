require("dotenv").config();

console.log("========== SERVER STARTING ==========");

const app = require("./src/app");
const connectToDB = require("./src/config/database");

async function startServer() {
    try {
        // Connect first
        await connectToDB();

        // Now test the database
        const User = require("./src/models/user.model");

        const count = await User.countDocuments();
        console.log("✅ Users Count:", count);
        const firstUser = await User.findOne({});
console.log("First User:", firstUser);

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log(`Server is running on port ${PORT}`);
            console.log("--------------------------------");
        });

    } catch (err) {
        console.error("Failed to start server");
        console.error(err);
        process.exit(1);
    }
}

startServer();