const bcrypt = require("bcrypt");

async function gerarHash() {

    const password = "1234";

    const hash = await bcrypt.hash(password, 10);

    console.log(hash);
}

gerarHash();