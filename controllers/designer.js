const express = require('express');
var router = express.Router()

// Display the home page
router.get("/", async function(req, res)
{
  res.render("designerhome", req.TPL);
});

// Display the home page
router.get("/template", async function(req, res)
{
  res.render("template", req.TPL);
});

module.exports = router;