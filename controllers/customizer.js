const express = require('express');
var router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const moment = require('moment');

const TemplateModel = require('../models/template.js');
const OrderModel = require('../models/order.js');
const MessageModel = require('../models/message.js');

router.get('*', function(req, res, next) {
  if (req.session.username){
    next();
  }else{
      res.redirect("/home");
  }
});

router.get("/", async function(req, res)
{
  res.render("customizerhome", req.TPL);
});

router.get("/messages", async function(req, res)
{
  all = await MessageModel.allmessages(req.session.username);

  let unique = [];

  let conversations = [];

  all.forEach(element => {
    if (unique.length == 0){
      conversations.push(element);
      unique.push(element.sendername+element.recievername);
      unique.push(element.recivername+element.sendername);
    } else {
      if (unique.includes(element.sendername+element.recievername) == false && unique.includes(element.recivername+element.sendername) == false){
        conversations.push(element);
        unique.push(element.sendername+element.recievername);
        unique.push(element.recivername+element.sendername);
      };
    }
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

router.get("/orders", async function(req, res)
{
  completed = await OrderModel.getcustomizerOrders(req.session.username, true);
  incomplete = await OrderModel.getcustomizerOrders(req.session.username, false);
  req.TPL.completed = completed;
  req.TPL.incomplete = incomplete;
  res.render("orders", req.TPL);
});

router.get("/explore", async function(req, res)
{
  result = await TemplateModel.getTemplates();
  req.TPL.templates = result;
  res.render("explore", req.TPL);
});

router.post("/customize", async function(req, res){
  template = await TemplateModel.getTemplate(req.body.templateId);
  customizations = await TemplateModel.getCustomizations(req.body.templateId);
  req.TPL.template = template;
  req.TPL.customizations = customizations;
  res.render("custom", req.TPL);
});

router.post("/checkout", async function (req, res){
  total = 0; 
  customizations = [];

  await Promise.all(req.body.customizations.map(async (customid) => {
    const result = await OrderModel.getCustom(customid);
    customizations.push(result);
  }))

  template = await TemplateModel.getTemplate(req.body.template);

  customizations.forEach(element => {
    total += parseFloat(element[0].price);
  });

  total = (total += parseFloat(template[0].price))*100;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
                    name: template[0].templatename,
                    currency:'cad',
                    amount: total,
                    quantity: 1}],
      success_url: `${process.env.SERVER_URL}`,
      cancel_url: `${process.env.SERVER_URL_CANCEL}`
    });
    OrderModel.saveOrder(template[0].templateid, req.body.customizations, total/100, template[0].username, req.session.username, template[0].templatename, template[0].templatetype, template[0].picture, template[0].description, moment().format('YYYY[-]MM[-]DD[ ]HH:mm:ss'), false);
    res.json({url: session.url})
  } catch (e) {
    res.status(500).json({error: e.message})
  }
});

module.exports = router;