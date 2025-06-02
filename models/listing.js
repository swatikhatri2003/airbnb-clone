const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js")
const listingSchema = Schema({
    title: {
        type:String,
        required:true,
    },
    description:String,
    image:{
       url: String,
       filename: String,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref:"Review",
        }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",  
    },
});

listingSchema.post("findOneAndDelete", async(Listing) =>{
    if(Listing ){
                await Review.deleteMany({_id :{$in : Listing.reviews}})
    }
    
})
const listing = mongoose.model("listing",listingSchema);
module.exports = listing;