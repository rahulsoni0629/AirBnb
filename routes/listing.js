const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const { isValidObjectId } = require("mongoose");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



router
.route("/")
.get(wrapAsync(listingController.index)) //Index Route
.post(isLoggedIn,upload.single('Listing[image]'), wrapAsync(listingController.create)); //Create Route---validateListing is not working


//home
router.get("/home",listingController.home);

//New Route
router.get("/new", isLoggedIn , listingController.new);

//after contact form fill 
router.get("/submit_contact",listingController.submit_contact);

//Contact Route
router.get("/contact", listingController.contact);

router
.route("/:id")
.get(wrapAsync(listingController.show)) //show
.delete(isOwner, isLoggedIn,wrapAsync( listingController.delete))//delete
.put(isLoggedIn,isOwner,upload.single('Listing[image]'),wrapAsync(listingController.update));//update---validationListing is not working

//Edit Route
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingController.edit));


module.exports = router;