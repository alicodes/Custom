const express = require('express');

var router = express.Router();
const TemplateModel = require('../models/template.js');
const OrderModel = require('../models/order.js');
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

/* router.get('*', function(req, res, next) {
  if (req.session.username){
    next();
  }else{
      res.redirect("/home");
  }
}); */

router.get("/", async function(req, res)
{
  result = await TemplateModel.gettemplatesbyUser(req.session.username);
  req.TPL.templates = result;
  res.render("designerhome", req.TPL);
});

router.get("/template", async function(req, res)
{
  res.render("template", req.TPL);
});

router.get("/explore", async function(req, res)
{
  result = await TemplateModel.getTemplates();

  req.TPL.templates = result;

  res.render("explore", req.TPL);
});

router.get("/messages", async function(req, res)
{
  all = await MessageModel.allmessages(req.session.username);

  let unique = [];

  let conversations = [];

  all.forEach(element => {
    if (unique.includes(element.sendername+element.recievername) == false && unique.includes(element.recivername+element.sendername) == false){
      conversations.push(element);
      unique.push(element.sendername+element.recievername)
      unique.push(element.recivername+element.sendername)
    };
  });

  conversations.forEach(element => {
    if (element.sendername == req.session.username){
      element.otherUser = element.recievername;
    } else {
      element.otherUser = element.sendername;
    };
  });

  req.TPL.conversations = conversations;

  res.render("messages", req.TPL);
});

router.get("/orders", async function(req, res)
{
  completed = await OrderModel.getdesignerOrders(req.session.username, true);
  incomplete = await OrderModel.getdesignerOrders(req.session.username, false);
  req.TPL.completed = completed;
  req.TPL.incomplete = incomplete;
  res.render("orders", req.TPL);
});

router.post("/messages/chatroom", async function(req, res){
  messages = await MessageModel.privateMessages(req.session.username, req.body.username);

  req.TPL.messages = messages;

  messages.forEach(element => {
    if (element.sendername == req.session.username){
      element.outerClass = "d-flex align-items-baseline text-end justify-content-end mb-2";
      element.innerClass = "card d-inline-block bg-primary text-light p-2";
    } else {
      element.outerClass = "d-flex align-items-baseline mb-2";
      element.innerClass = "card d-inline-block bg-secondary text-light p-2";
    };
  });

  req.TPL.messages = messages;

  req.TPL.user = req.body.username;

  res.render("chatroom", req.TPL);
});

router.post("/upload", upload.single('garmet'), async function(req, res)
{
  console.log(req.file)
});

router.post("/post", async function(req, res)
{
  uploadPath = '/uploads/'+req.body.image;
  console.log(req.body);
  result = await TemplateModel.post(req.session.username, req.body.name, req.body.type, uploadPath, req.body.description, parseInt(req.body.price));
  
  req.body.customizations.forEach(element => {
    TemplateModel.customizations(result.templateid, element.customtype, element.price, element.description);
  });
  res.redirect("/designer");
});

module.exports = router;