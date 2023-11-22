const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const { isValidObjectId } = require("mongoose");

router.get("/home",(req,res)=>{
    res.render("listings/home.ejs")
});

//Index Route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
}));

//New Route
router.get("/new",isLoggedIn,(req,res) => {
    res.render("listings/new.ejs");
});

//About Route
router.get("/about",(req, res) => {
    res.render("listings/about.ejs");
});

//Contact Route
router.get("/contact",(req, res) => {
    res.render("listings/contact.ejs");

});

//Show Route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing not exist !")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/", isLoggedIn, wrapAsync(async (req,res,next)=>{ //validateListing is missing or removed
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing is Created !");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Delete Route
router.delete("/:id",isOwner, isLoggedIn,wrapAsync( async (req,res,next)=>{
    let {id} = req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

//Update Route
//isValidated is not working 
router.put("/:id", isOwner,isLoggedIn,wrapAsync(async (req, res) => { //validateListing is missing or removed 
    let { id } = req.params;
    // const { title, description, image, price, country, location } = req.body.Listing;
    // await Listing.findByIdAndUpdate(id, {title,description,image,price,country,location});
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;