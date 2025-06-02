const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync= require("../utils/wrapasync.js");
const ExpressError= require("../utils/expresserror.js");
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const{validateReview,isLogedIn,isReviewAuthor}=require("../middleware.js")
const reviewController= require("../controllers/reviews.js")




//    review route post route
router.post("/",isLogedIn,wrapAsync(reviewController.createReview))

// delete review route
router.delete("/:reviewId",isLogedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))
module.exports = router;