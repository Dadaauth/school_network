// require packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const passportCustom = require("passport-custom");
const CustomStrategy = passportCustom.Strategy;
const formidable = require("formidable");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/login", express.static("public"));

// // connect to mongoose
// // mongoose.connect("mongodb+srv://authority:4141clement%3F@cluster0.gs6bw9m.mongodb.net/socialiteDB");
mongoose.connect("mongodb://localhost:27017/schoolNetDB");
 
// // get mongoose client
const mongooseClient = mongoose.connection.getClient();

// express session and passport connecting to the session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: "socialite",
    store: MongoStore.create({  
        client: mongooseClient,
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SECRET,
          }
    })
}));
app.use(passport.initialize());
app.use(passport.session());




// for passport login and signup authentication
passport.use('userLR', new CustomStrategy(
    function(req, done) {
        User.findOne({
            email_address: req.body.email,
            password: req.body.password
        }, (err, user) => {
            done(err, user);
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

// passport authentication END


app.get("/school-signup", (req, res) => {
    res.render("school_signup");
});

app.get("/login/student", (req, res) => {
    res.render("student_login");
});

app.get("/test", (req, res) => {
    res.render("test.ejs");
});

app.listen(3000, () => {console.log("app running on port 3000");});