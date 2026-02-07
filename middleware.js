const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError= require("./utils/expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");
module.exports.isLogedIn =(req,res,next)=>{
   // user k bare m btatta h konse path ko access krne ki koshish krra tha user
      if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","you msut be loggedin to create listing");
       return  res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl= (req,res,next)=>{
  if( req.session.redirectUrl){
   res.locals.redirectUrl =req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id}= req.params;
     let listings =await listing.findById(id);
 if(!listings.owner._id.equals(res.locals.currUser._id)){
     req.flash("error", "you are not the owner of the list");
    return res.redirect(`/listings/${id}`);
 }
 next();
}


module.exports.validateListing = (req,res,next) =>{
     let {error} = listingSchema.validate(req.body);
    
    if(result.error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
module.exports.validateReview = (req,res,next) =>{
     let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId}= req.params;
     let review =await Review.findById(reviewId);
 if(!review.author._id.equals(res.locals.currUser._id)){
     req.flash("error", "you are not the author of this review");
    return res.redirect(`/listings/${id}`);
 }
 next();
}

