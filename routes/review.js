const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateReview,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")


//review create 
router.post("/", isLoggedIn , validateReview, wrapAsync(reviewController.create));

//Delete review 
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAsync(reviewController.delete));

module.exports = router;