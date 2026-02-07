const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review.js")

// Airbnb-style categories for filtering
const CATEGORIES = [
  "Trending", "Rooms", "Iconic Cities", "Mountains", "Amazing Pools",
  "Camping", "Farms", "Arctic"
];

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
    category: {
        type: String,
        enum: CATEGORIES,
        default: "Trending",
    },
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
module.exports.CATEGORIES = CATEGORIES;