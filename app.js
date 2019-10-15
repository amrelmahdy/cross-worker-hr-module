const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const upload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');
const helpers = require('handlebars-helpers')();
const fs = require("fs");


const app = express();


const env = process.env.NODE_ENV || 'dev';
const dbURL = "mongodb://localhost/";
const dbName = "cross-hr";

mongoose.set('useFindAndModify', false);
mongoose.connect(`${dbURL}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
},(err) => {
    if (err) {
        console.log("DB Connection Error: " + err)
    } else {
        console.log("connected to database successfully");
    }
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(upload({
    preserveExtension: true
}));




//app.use(morgan("dev"));


// View Engine
app.engine('hbs', hbs({
    defaultLayout: 'master',
    extname: 'hbs',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    helpers: {
        ifCond: (v1, v2, options) => {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        ifContains: (v1, v2, options) => {
            const contains = v1.includes(v2);
            if (contains) {
                return options.fn(this);
            }
        },
        dateTimeFormat: (date) => {
            /*  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              var today  = new Date();
              console.log(today.toLocaleDateString("en-US")); // 9/17/2016
              console.log(today.toLocaleDateString("en-US", options)); // Saturday, September 17, 2016
              console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016*/
            let date_options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
            return date.toLocaleDateString("en-US", date_options);
        },
    }
}));
app.set('view engine', 'hbs');







// Express Session
app.use(session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true
    }
));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.path = req.path;
    res.locals.origin = req.query && req.query.origin ? req.query.origin : "/";
    next();
});


app.set("port", 3000);
const port = app.get("port") || 3000;

// Setup Static Pages.
app.use("/public", express.static(path.join(__dirname, "public")));



//handling Cross Origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.method === 'OPTIONS') {
        res.header('Allow-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        return res.status(200).json({});
    }
    next();
});



app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/user"));
app.use("/benefits", require("./routes/benefit"));

// API Routes
app.use("/api/users", require("./routes/api/user"));






app.listen(port, () => {
    console.log(`application is running on  ${env}`);
    console.log(`database connection is working on : ${dbURL}`);
    console.log(`app is listening to port ${port}`)
});
