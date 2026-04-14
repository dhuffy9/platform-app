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

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS working");
        res.json({
            message: "Database connection works",
            rows: rows
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            message: "Database connection failed",
            type: "danger",
            error: error.message
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT uid, username, email, display_name, timestamp FROM users");
        res.json(rows);
    } catch (error) {
        console.error("Users query error:", error);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const { username, password, email, displayName } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
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
            message: "Failed to register user",
            type: "danger",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});