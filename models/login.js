const pool = require("./db");

async function login(username, password, role)
{
  var result = "";

  try {
    result = await pool.query("SELECT * FROM login WHERE username = $1 AND role = $2", [username, role]);
    if (JSON.stringify(result.rows[0].password) == JSON.stringify(password)){
      return true;
    }else{return false;}
  } catch (error) {
    return false;
  }
}

async function level(username)
{
  var result = await db.get("SELECT level FROM deslogin WHERE username = ?", [username]);
  if (result.level == "member") {
    return true;
  } else {
    return false;
  }
}

module.exports = {login};