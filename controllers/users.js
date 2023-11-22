const User = require("../models/user");

module.exports.get_signup= (req,res) => {
    res.render("users/signup.ejs");
}
module.exports.post_signup = async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success",`You have successfully registered with username ${username}`);
            res.redirect("/listings");
        })
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.get_login = (req,res) => {
    res.render("users/login.ejs")
};

module.exports.post_login = async(req,res) => {
    req.flash("success","Welcome back to WanderLust");
    if(!res.locals.redirectUrl){
        res.redirect("/listings");
    }else{
        res.redirect(res.locals.redirectUrl); 
    } 
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Successfully Logout...Welcome back soon!!!!");
        res.redirect("/listings");
    })
};