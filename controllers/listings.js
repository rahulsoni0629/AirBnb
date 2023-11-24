const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

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

module.exports.contact = (req, res) => {
    res.render("listings/contact.ejs");
};

module.exports.submit_contact = (req,res)=>{
    res.render("listings/submit_contact.ejs")
};

module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","Listing not exist !")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing});
};
module.exports.create = async (req,res,next) => { 
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let sss  = await newListing.save();
    console.log(sss);
    req.flash("success","New Listing is Created !");
    res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not exist !")
        res.redirect("/listings");
    }
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("upload/", "upload/w_250/");
    res.render("listings/edit.ejs", { listing , originalImgUrl});
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
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
};