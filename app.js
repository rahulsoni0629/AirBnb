const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
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

const sessionOptions={
    secret:"mysuperscreatcode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true, // to prevent cross-scripting attacks
    },
};

app.get("/",(req,res)=>{
    res.send("app working perfectly i am root");
});

app.use(session(sessionOptions));
app.use(flash());//must before routes

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user; // use during nav-login-signup-logout
    next();
})

// app.get("/demo", async(req,res)=>{
//     let fakeUser = new User({
//         email:"rahulmehulsoni@gmail.com",
//         username: "rsoni29"
//     });
//     let regUser = await User.register(fakeUser,"soni20573");
//     res.send(regUser);
// });
 

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


//Unknown Route error
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//Error route
app.use((err,req,res,next) => {
    let {status=500,message="No no no no"}= err;
    res.status(status).render("listings/error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("listening 8080");
});
