const pool = require("./db");

async function post(username, templateName, templateType, picture, description, price)
{
    await pool.query("INSERT INTO templates (username, templateName, templateType, picture, description, price) VALUES ($1,$2,$3,$4,$5,$6)",
               [username, templateName, templateType, picture, description, price]);

    result = await pool.query("SELECT * FROM templates ORDER BY templateid ASC");

    return (result.rows.pop());
}

async function getTemplates()
{
    result = await pool.query("SELECT * FROM templates ORDER BY templateid DESC");
    return (result.rows);
}

async function gettemplatesbyUser(username)
{
    result = await pool.query("SELECT * FROM templates WHERE username = ($1) ORDER BY templateid DESC", [username]);
    return (result.rows);
}

async function getTemplate(templateId)
{
    result = await pool.query("SELECT * FROM templates WHERE templateid = $1", [templateId]);
    return (result.rows);
}

async function customizations(templateId, customType, price, description)
{
    await pool.query("INSERT INTO customizations (templateid, customtype, price, description) VALUES ($1,$2,$3,$4)",
               [templateId, customType, price, description]);
}

async function getCustomizations(templateId)
{
    result = await pool.query("SELECT * FROM customizations WHERE templateid = $1", [templateId]);
    return (result.rows);
}

module.exports = {post, getTemplates, getTemplate, customizations, getCustomizations, gettemplatesbyUser};