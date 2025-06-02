const listing=require("../models/listing")
const Review=require("../models/review")
module.exports.createReview = async(req,res)=>{
   let Listing = await  listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
    newReview.author =req.user._id;
   Listing.reviews.push(newReview);
   await newReview.save();
   await Listing.save();

       req.flash("success","new review created")
         res.redirect(`/listings/${Listing._id}`);
}
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//    let Listing = await  listing.findById(req.params.id);
//    let newReview = new Review(req.body.review);
//    Listing.reviews.push(newReview);
//    await newReview.save();
//    await Listing.save();
//    console.log("new review saved");
//          res.redirect(`/listings/${Listing._id}`);
// }))
module.exports.deleteReview =async(req,res) => {
    let {id,reviewId} = req.params;
     await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
       req.flash("success","review deleted")
    res.redirect(`/listings/${id}`)
}