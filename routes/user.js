const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/users.js")

router
.route("/signup")
.get(userController.get_signup) //get req for signup
.post(wrapAsync(userController.post_signup)) //post req for signup


router
.route("/login")
.get(userController.get_login)//get req for login
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash:true}), userController.post_login)//post req for login

//logout req
router.get("/logout",userController.logout);

module.exports = router;