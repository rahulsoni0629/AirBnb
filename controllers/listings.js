const Listing = require("../models/listing");

module.exports.home = (req,res)=>{
    res.render("listings/home.ejs")
};

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
};

module.exports.new = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.about = (req, res) => {
    res.render("listings/about.ejs");
};

module.exports.contact = (req, res) => {
    res.render("listings/contact.ejs");
};

module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing not exist !")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};
module.exports.create = async (req,res,next) => { 
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing is Created !");
    res.redirect("/listings");
};

module.exports.edit = async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};
module.exports.delete = async (req,res,next)=>{
    let {id} = req.params; 
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.update = async (req, res) => { //validateListing is missing or removed 
    let { id } = req.params;
    // const { title, description, image, price, country, location } = req.body.Listing;
    // await Listing.findByIdAndUpdate(id, {title,description,image,price,country,location});
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
};