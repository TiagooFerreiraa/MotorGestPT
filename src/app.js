const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// ENCRYPT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VIEWS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// SESSION
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));

// ROUTES
const routes = require("./routes");
app.use("/", routes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});