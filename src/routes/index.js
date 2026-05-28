const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const db = require('../db/connection');

function checkAuth(req, res, next) {
    if (req.session.utilizador) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get("/", checkAuth, async (req, res) => {
    const utilizador = req.session.utilizador;
    const [cars] = await db.query("SELECT COUNT(*) AS total FROM cars");

    const totalCars = cars[0].total;

    if (!utilizador) {
        return res.redirect("/login");
    }

    res.render("home", {
        utilizador,
        totalCars
    });
});

// LOGIN
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", async (req, res) => {
    const { Email, Palavra_Passe } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE Email = ?", [Email]);

    if (rows.length === 0) {
        return res.send("Utilizador não existe!");
    }

    const utilizador = rows[0];

    console.log(req.body);
    console.log(utilizador);

    const match = await bcrypt.compare(Palavra_Passe, utilizador.Palavra_Passe);

    if (match) {
        req.session.utilizador = {
            id: utilizador.ID,
            nome_utilizador: utilizador.Nome_Utilizador,
            email: utilizador.Email
        }
        res.redirect("/");
    } else {
        res.send("Credenciais Inválidas");
    }

    res.send("Login recebido");
    
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