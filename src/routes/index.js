const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../db/connection');

function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get("/", checkAuth,(req, res) => {
    res.render("home");
});

// LOGIN
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE Email = ?", [email]);

    if (rows.length === 0) {
        return res.send("Invalid characters");
    }

    const user = rows[0];

    console.log(req.body);
    console.log(user);

    const match = await bcrypt.compare(password, user.Password);

    if (match) {
        req.session.user = {
            id: user.ID,
            nome: user.Username,
            email: user.Email
        }
        res.redirect("/");
    } else {
        res.send("Invalid credentials");
    }

    res.send("Login recieved");
    
});

// LOGOUT
router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS time");
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;