const pool = require("./db");

async function signup(username, password, email)
{
    await pool.query("INSERT INTO deslogin (username, password, email) VALUES ($1,$2,$3)",
               [username, password, email]);
}

module.exports = {signup};
