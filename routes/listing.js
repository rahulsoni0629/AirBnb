const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const { isValidObjectId } = require("mongoose");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router
.route("/")
.get(wrapAsync(listingController.index)) //Index Route
// .post(isLoggedIn, wrapAsync(listingController.create)); //Create Route---validateListing is not working
.post("/", upload.single('Listing[image]'), (req, res) => { //Listing[image]==name in input
    res.send(req.file);
});


//home
router.get("/home",listingController.home);

//New Route
router.get("/new", isLoggedIn , listingController.new);

//About Route
router.get("/about", listingController.about);

//Contact Route
router.get("/contact", listingController.contact);

router
.route("/:id")
.get(wrapAsync(listingController.show)) //show
.delete(isOwner, isLoggedIn,wrapAsync( listingController.delete))//delete
.put(isOwner,isLoggedIn,wrapAsync(listingController.update));//update---validationListing is not working

//Edit Route
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingController.edit));


module.exports = router;