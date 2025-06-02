const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync= require("../utils/wrapasync.js");
const {reviewSchema} = require("../schema.js");
const {isLogedIn,isOwner,validateListing } =require("../middleware.js")
const listingController =require("../controllers/listings.js")
const multer  = require('multer')
const {storage}= require("../cloudconfig.js")
const upload = multer({ storage })


router
    .route("/")
    .get(wrapAsync(listingController.index)) // index route
    .post(isLogedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing)); // create route
    //    .post(isLogedIn,wrapAsync(listingController.createListing)); 
router.get("/new",isLogedIn,listingController.renderNewForm); // new route

router 
    .route("/:id")
    .get (wrapAsync(listingController.showListing)) //    show route
    .put(isLogedIn,upload.single('listing[image]'),isOwner,wrapAsync(listingController.updateListing)) //update route
    .delete(isLogedIn,isOwner,wrapAsync(listingController.destroyListing)) //delete route



// edit route
router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router;