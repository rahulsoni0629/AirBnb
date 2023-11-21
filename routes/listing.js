const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
};

//Index Route
router.get("/",  wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
}));

//New Route
router.get("/new", (req,res) => {
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
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing not exist !")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/", wrapAsync(async (req,res,next)=>{ //validateListing is missing or removed
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    req.flash("success","New Listing is Created !");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not exist !")
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Delete Route
router.delete("/:id",wrapAsync( async (req,res,next)=>{
    let {id} = req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

//Update Route
router.put("/:id", wrapAsync(async (req, res,next) => { //validateListing is missing or removed 
    // app.put("/listings/:id", async (req, res) => {
    // let { id } = req.params;
    // await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // res.redirect(`/listings/${id}`);
    // });
    let { id } = req.params;
    const { title, description, image, price, country, location } = req.body.Listing;
    await Listing.findByIdAndUpdate(id, {title,description,image,price,country,location});
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;