const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();

//app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get("/", (req, res) => {
    res.send("API is running");
});


app.post("/api/register", async (req, res) => {
    try {
        const { username, password, email, displayName } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
                type: "danger"
            });
        }

        const hashedPassword = await require("bcrypt").hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users (username, password, email, display_name) VALUES (?, ?, ?, ?)",
            [username, hashedPassword, email || null, displayName || null]
        );

        res.json({
            message: "Your account has been created successfully. You can now log in.",
            type: "success",
            userId: result.insertId
        });
    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Failed to register user (database)",
            type: "danger",
            error: error.message
        });
    }
});

app.post("/api/check-availability", async (req, res) => {
    console.log("/api/check-availability")
    const { field, value} = req.body;

    // ?? for column name
    const [result] = await db.query("SELECT 1 FROM users WHERE ?? = ? LIMIT 1", [ field , value])
    console.log(result)

    res.json({ taken: result.length > 0, field})
})


const bcrypt = require("bcrypt");

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const cleanUsername = username ? username.trim() : "";

        if (!cleanUsername || !password) {
            return res.status(400).json({
                type: "danger",
                message: "Username and password are required"
            });
        }

        const [result] = await db.query(
            "SELECT uid, username, password, email, display_name FROM users WHERE username = ? LIMIT 1",
            [cleanUsername]
        );

        if (result.length === 0) {
            return res.status(401).json({
                type: "danger",
                message: "Invalid username or password"
            });
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                type: "danger",
                message: "Invalid username or password"
            });
        }

        res.json({
            type: "success",
            message: "Login successful",
            user: {
                uid: user.uid,
                username: user.username,
                email: user.email,
                displayName: user.display_name
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            type: "danger",
            message: "Failed to login"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});