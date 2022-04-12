const express = require('express');
const app = express();
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

io.on("connection", socket => {
    console.log("New socket connection...");
  
    socket.emit("message", "Welcome to ChatCord!");

    socket.on("chatMessage", msg => {
        MessageModel.send("testuser", "testuser2", msg.text, moment().format('YYYY[-]MM[-]DD[ ]HH:mm:ss'))
    })
    
  });

// Sign up route
//app.use("/forgot", require("./controllers/signup"));

// Start the server
var server = http.listen(3000, function() {console.log("Server listening...");})