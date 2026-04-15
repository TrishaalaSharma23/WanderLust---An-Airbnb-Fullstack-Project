require("dotenv").config();

const dns=require('node:dns');
dns.setServers(['8.8.8.8' , '8.8.4.4']);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
var methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

main().then(res => {
    console.log("CONNECTION WITH DATABASE FULFILLED");
}).catch((err) => {
    console.log("connection failed with db.");
    console.log(err);
});

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookies: {
        expires: Date.now()+1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly:true
    },
};

// app.get("/", (req, res) => {
//     res.send("APP IS WORKING");
// });

app.use(flash());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

//IF ANY INVALID ROUTE IS SEARCHED
app.use((req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND"));
});

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { status = 500, message = "SOMETHING WENT WRONG" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { err });
});

//FORMING CONNECTION
app.listen(port, () => {
    console.log("APP IS LISTENING ON PORT 8080");
});