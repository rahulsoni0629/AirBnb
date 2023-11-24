if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dburl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);
}
main()
.then(() => {
    console.log("Connection to DB");
})
.catch((err) =>{
    console.log(err);
})

app.set("views",path.join(__dirname,"views"));//to use ejs template if server start other then main golder
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true }));//to paras the code from url
app.use(methodOverride("_method")); // to use put, patch, delete req..other then get and post request.... 
app.engine("ejs",ejsMate);


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true, // to prevent cross-scripting attacks
    },
};


app.use(session(sessionOptions));
app.use(flash());//must before routes

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user; // use during nav-login-signup-logout
    next();
})

// differennt routs are created in routers folder
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//Unknown Route address error
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//Error route
app.use((err,req,res,next) => {
    let {status=500,message="No no no no"}= err;
    res.status(status).render("listings/error.ejs",{message});
})

//listen
app.listen(8080,()=>{
    console.log("listening 8080");
});
