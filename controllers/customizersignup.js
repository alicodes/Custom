const express = require('express');
var router = express.Router()
const SignupModel = require('../models/customizersignup.js')

// Displays the signup page
router.get("/", async function(req, res)
{
  // If we had an error during form submit, display it, clear it from session
  req.TPL.signup_error = req.session.signup_error;
  req.session.signup_error = "";

  if (req.session.signup){
      req.TPL.signup = req.session.signup;
  }
  
  req.session.signup = false;
  // render the signup page
  res.render("customizersignup", req.TPL);
});

// Attempts to signup a user
// - The action for the form submit on the signup page.
router.post("/attemptsignup", async function(req, res)
{
  // is the username and password > 1 character in length
  if (req.body.username.length >= 1 && req.body.password.length >= 1 && req.body.email.length >= 1)
  {
    SignupModel.signup(req.body.username, req.body.password, req.body.email);

    // set a session key username to login the user
    req.session.signup = true;

    // re-direct the logged-in user to the members page
    res.redirect("/customizersignup");
  }
  else
  {
    // if we have an error, reload the login page with an error
    req.session.signup_error = "Username/password cannot be blank!";
    res.redirect("/customizersignup");
  }
});

module.exports = router;