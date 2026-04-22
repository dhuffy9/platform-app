const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const session = require('express-session');

dotenv.config();

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: function(req) {
      var match = req.url.match(/^\/([^/]+)/);
      return {
        path: match ? '/' + match[1] : '/',
        httpOnly: true,
        secure: req.secure || false,
        maxAge: 60000
      }
    }
  }))

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
            "SELECT uid, username, password FROM users WHERE username = ? LIMIT 1",
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

        req.session.user = {
            uid: user.uid,
            username: cleanUsername
        }

        res.json({
            type: "success",
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            type: "danger",
            message: "Failed to login"
        });
    }
});

app.get("/api/user", async (req, res) => {
    if(!req.session.user){
        return res.status(401).json({
            type: "danger",
            message: "Please log in first"
        });
    }

    const username = req.session.user.username;

    const [result] = await db.query(
        "SELECT uid, username, email, display_name FROM users WHERE username = ? LIMIT 1",
        [username]
    )

    console.log(result)
 
    res.json({
        user: result[0]
    })
});


app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);

            return res.status(500).json({
                type: "danger",
                message: "Failed to logout"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            type: "success",
            message: "Logout successful"
        });
    });
});

app.put("/api/user", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                type: "danger",
                message: "Please log in first"
            });
        }

        const { email, displayName } = req.body;

        const cleanEmail = email ? email.trim() : "";
        const cleanDisplayName = displayName ? displayName.trim() : "";

        if (!cleanEmail) {
            return res.status(400).json({
                type: "danger",
                message: "Email is required"
            });
        }

        const [emailCheck] = await db.query(
            "SELECT uid FROM users WHERE email = ? AND uid != ? LIMIT 1",
            [cleanEmail, req.session.user.uid]
        );

        if (emailCheck.length > 0) {
            return res.status(400).json({
                type: "danger",
                message: "Email is already being used"
            });
        }

        await db.query(
            "UPDATE users SET email = ?, display_name = ? WHERE uid = ?",
            [cleanEmail, cleanDisplayName || null, req.session.user.uid]
        );

        const [result] = await db.query(
            "SELECT uid, username, email, display_name FROM users WHERE uid = ? LIMIT 1",
            [req.session.user.uid]
        );

        res.json({
            type: "success",
            message: "Account updated successfully",
            user: result[0]
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            type: "danger",
            message: "Failed to update account"
        });
    }
});

app.post("/api/posts", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                type: "danger",
                message: "Please log in first"
            });
        }

        const { title, body } = req.body;

        const cleanTitle = title ? title.trim() : "";
        const cleanBody = body ? body.trim() : "";

        if (!cleanTitle || !cleanBody) {
            return res.status(400).json({
                type: "danger",
                message: "Title and body are required"
            });
        }

        const [result] = await db.query(
            "INSERT INTO posts (user_uid, title, body) VALUES (?, ?, ?)",
            [req.session.user.uid, cleanTitle, cleanBody]
        );

        const [newPost] = await db.query(
            `SELECT posts.pid, posts.title, posts.body, posts.created_at,
                    users.uid, users.username, users.display_name
             FROM posts
             INNER JOIN users ON users.uid = posts.user_uid
             WHERE posts.pid = ?
             LIMIT 1`,
            [result.insertId]
        );

        res.status(201).json({
            type: "success",
            message: "Post created successfully",
            data: newPost[0]
        });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({
            type: "danger",
            message: "Failed to create post"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});