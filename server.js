require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
/* const app = require('express')(); */
const http = require('http').Server(app);
const io = require('socket.io')(http);

const session = require('express-session');
const mustacheExpress = require('mustache-express');

const moment = require('moment');
//const fileUpload = require('express-fileupload');
//const multer = require('multer');

// Include the mustache engine to help us render our pages
app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const TemplateModel = require('./models/template.js');
const MessageModel = require('./models/message.js');

// We use the .urlencoded middleware to process form data in the request body,
// which is something that occurs when we have a POST request.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//app.use(fileUpload());
//app.use(multer({dest: 'public/uploads'}).single('garmet'));

app.use(express.static("public"));

// Use the session middleware
app.use(session({secret: 'keyboard cat'
                ,resave: false
                ,saveUninitialized:false}));

// Create a middleware to populate an initial template array
app.use(function(req,res,next) {

    // reset the template obect to a blank object on each request
    req.TPL = {};
  
    // decide whether to display the login or logout button in the navbar
    req.TPL.displaylogin = !req.session.username;
    req.TPL.displaylogout = req.session.username;
    req.TPL.username = req.session.username;
    req.TPL.designer = req.session.designer;
    req.TPL.customizer = req.session.customizer;
    req.TPL.home = !req.session.username;

    next();
});

// Home page route
app.use("/home", require("./controllers/home"));

// We route / to redirect to /home by default
app.get("/", function(req, res) {
    res.redirect("/home");
});

// Sign up route
app.use("/designersignup", require("./controllers/designersignup"));

// Log in route
app.use("/designerlogin", require("./controllers/designerlogin"));

// Sign up route
app.use("/customizersignup", require("./controllers/customizersignup"));

// Log in route
app.use("/customizerlogin", require("./controllers/customizerlogin"));

// Designer home route
app.use("/designer", require("./controllers/designer"));

// Customizer home route
app.use("/customizer", require("./controllers/customizer"));

app.get("/explore", async function (req, res){
    result = await TemplateModel.getTemplates();

    req.TPL.templates = result;

    res.render("explore", req.TPL);
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({userId, socketId});
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId)=>{
    return users.find(user=>user.userId === userId);
};

io.on("connection", socket => {
    console.log("New socket connection...");
  
    //socket.emit("message", "Welcome to ChatCord!");

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMesage", ({senderId, recieverId, text}) =>{
        const user = getUser(recieverId);
        io.to(user.socketId).emit("message", text);
    });

    socket.on("disconnect", ()=>{
        console.log("User disconnected");
        removeUser(socket.id);
    });

    socket.on("chatMessage", msg => {
        MessageModel.send(msg.sender, msg.reciever, msg.text, moment().format('YYYY[-]MM[-]DD[ ]HH:mm:ss'))
    })
});

// Sign up route
//app.use("/forgot", require("./controllers/signup"));

// Start the server
var server = http.listen(port, function() {console.log("Server listening...");})