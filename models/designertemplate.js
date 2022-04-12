const pool = require("./db");

async function post(username, templateName, templateType, picture, description, price)
{
    await pool.query("INSERT INTO templates (username, templateName, templateType, picture, description, price) VALUES ($1,$2,$3,$4,$5,$6)",
               [username, templateName, templateType, picture, description, price]);
}

async function getTemplates()
{
    result = await pool.query("SELECT * FROM templates");
    return (result.rows);
}

module.exports = {post, getTemplates};