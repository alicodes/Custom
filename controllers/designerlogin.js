const express = require('express');
var router = express.Router()
const LoginModel = require('../models/designerlogin.js')

// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("designerlogin", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res)
{
  // is the username and password OK?
  if (await LoginModel.login(req.body.username, req.body.password) == true)
  {
    // set a session key username to login the user
    req.session.username = req.body.username;

    res.redirect("/designer");

    /* if (await LoginModel.level(req.body.username) == true){
      // set level session for user
      req.session.level = "member";

      // re-direct the logged-in user to the members page
      res.redirect("/members");

    }else if (await LoginModel.level(req.body.username) == false){
      // set level session for user
      req.session.level = "editor";

      // re-direct the logged-in user to the editors page
      res.redirect("/editors");
    } */
  }
  else
  {
    // if we have an error, reload the login page with an error
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/designerlogin");
  }

});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  delete(req.session.level);
  res.redirect("/home");
});

module.exports = router;
