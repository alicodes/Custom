const pool = require("./db");
// datetime format: '2016-06-22 19:10:25-07' or '2016-06-22 19:10:25-07' -07 is timezone
async function send(sendername, recievername, messagetext, datetime)
{
    await pool.query("INSERT INTO messages (sendername, recievername, messagetext, datetime) VALUES ($1,$2,$3,$4)",
               [sendername, recievername, messagetext, datetime]);
}

async function allmessages(username)
{
    let query = "SELECT * FROM messages WHERE sendername = '"+username+"' OR recievername = '"+username+"' ORDER BY datetime DESC";
    //"SELECT * FROM messages WHERE sendername = '$1' OR recievername = '$2'", [username, username]
    result = await pool.query(query);
    return (result.rows);
}

async function sentmessages(username)
{
    let query = "SELECT * FROM messages WHERE sendername = '"+username+"' ORDER BY datetime DESC";
    result = await pool.query(query);
    return (result.rows);
}

async function recievedmessages(username)
{
    let query = "SELECT * FROM messages WHERE recievername = '"+username+"' ORDER BY datetime DESC";
    result = await pool.query(query);
    return (result.rows);
}

async function privateMessages(userOne, userTwo)
{
    let query = "SELECT * FROM messages WHERE sendername = '"+userOne+"' AND recievername = '"+userTwo+"' OR sendername = '"+userTwo+"' AND recievername = '"+userOne+"' ORDER BY datetime ASC";
    result = await pool.query(query);
    return (result.rows);
}

module.exports = {send, allmessages, sentmessages, recievedmessages, privateMessages};