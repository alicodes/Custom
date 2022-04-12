const express = require('express');

var router = express.Router();
const TemplateModel = require('../models/designertemplate.js');
const MessageModel = require('../models/message.js');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});

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

// Display the home page
router.get("/explore", async function(req, res)
{
  result = await TemplateModel.getTemplates();

  req.TPL.templates = result;

  res.render("explore", req.TPL);
});

// Display the home page
router.get("/messages", async function(req, res)
{
  /* all = await MessageModel.allmessages(req.session.username);

  let conversations = [];

  conversations.push([all.pop()]);

  all.forEach(element => {
    conversations.forEach(e =>{
      if (element.receivername == e[0].receivername || conversations.length == 0){
        conversations.push([sent.pop()]);
      };
    });
  }); */

  sent = await MessageModel.sentmessages(req.session.username);

  recieved = await MessageModel.recievedmessages(req.session.username);

  let conversations = [];

  sent.forEach(element => {
    if (conversations.length == 0){
      conversations.push([element]);
    } else {
      let index = 0;
      conversations.forEach(e =>{
        if (element.receivername == e[0].receivername){
          conversations[index].push(element);
        };
        index ++;
      });
    };
  });

  recieved.forEach(element => {
    if (conversations.length == 0){
      conversations.push([element]);
    } else {
      let index = 0;
      conversations.forEach(e =>{
        if (element.sendername == e[0].recievername){
          conversations[index].push(element);
        };
        index ++;
      });
    };
  });

  conversations.forEach(element => {
    element.sort(function(a,b){
      return b.datetime - a.datetime;
    });
  });

  console.log(conversations);

  let unique = [];

  conversations.forEach(element => {
    unique = element[0];
  });

  req.TPL.conversations = conversations;
  req.TPL.unique = unique;

  res.render("messages", req.TPL);
});


router.post("/upload", upload.single('garmet'), async function(req, res)
{
  /* let file;
  let uploadPath;

  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send("No files were uploaded.");
  };

  file = req.files.garmet;
  console.log(req.files.garmet);
  //uploadPath = __dirname + '/upload/' + file.name;
  uploadPath = '/Users/shahamali/Documents/GitHub/Custom/public/uploads/'+req.session.username+'/'+ file.name;

  file.mv(uploadPath, function(err){
    if (err) return res.status(500).send(err);
  }); */
  console.log(req.file)
});

router.post("/post", async function(req, res)
{
  uploadPath = '/uploads/'+req.body.image;
  console.log(req.body);
  TemplateModel.post(req.session.username, req.body.name, req.body.type, uploadPath, req.body.description, parseInt(req.body.price));

  res.redirect("/designer");
});

module.exports = router;