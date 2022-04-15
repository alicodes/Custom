const pool = require("./db");

async function getCustom(customid) {
    result = await pool.query("SELECT * FROM customizations WHERE customid = ($1)", [customid]);
    return (result.rows);
};

async function saveOrder(templateId, customizations, total, seller, buyer, templateName, templateType, picture, description, datetime, completed) {
    await pool.query("INSERT INTO orders (templateid, customizations, total, seller, buyer, templatename, templatetype, picture, description, datetime, completed) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
               [templateId, customizations, total, seller, buyer, templateName, templateType, picture, description, datetime, completed]);
};

async function getdesignerOrders(username, completed) {
    result = await pool.query("SELECT * FROM orders WHERE seller = ($1) AND completed = ($2) ORDER BY datetime DESC", [username, completed]);
    return (result.rows);
};

async function getcustomizerOrders(username, completed) {
    result = await pool.query("SELECT * FROM orders WHERE buyer = ($1) AND completed = ($2) ORDER BY datetime DESC", [username, completed]);
    return (result.rows);
};

module.exports = {getCustom, saveOrder, getdesignerOrders, getcustomizerOrders};