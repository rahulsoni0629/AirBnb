const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    let{username,email,password} = req.body;
    const newUser = new User({email,username});
    await User.register(newUser,password);
    req.flash("success",`You have successfully registered ! ${username}`);
    res.redirect("/listings");
}));

module.exports = router;