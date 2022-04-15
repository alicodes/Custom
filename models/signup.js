const pool = require("./db");

async function signup(username, password, email, role)
{
    await pool.query("INSERT INTO login (username, password, email, role) VALUES ($1,$2,$3,$4)",
               [username, password, email, role]);
}

module.exports = {signup};
