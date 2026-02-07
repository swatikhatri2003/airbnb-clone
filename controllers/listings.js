const listing = require("../models/listing");
const { CATEGORIES } = require("../models/listing");

module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  const conditions = [];

  // Search: match title, description, location, or country (case-insensitive)
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    conditions.push({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
      ],
    });
  }

  // Category filter - match exact category OR listings without category (legacy) when "Trending"
  if (category && category.trim()) {
    if (category.trim() === "Trending") {
      conditions.push({
        $or: [
          { category: "Trending" },
          { category: { $exists: false } },
          { category: "" },
          { category: null },
        ],
      });
    } else {
      conditions.push({ category: category.trim() });
    }
  }

  const filter = conditions.length ? { $and: conditions } : {};
  const alllistings = await listing.find(filter).sort({ _id: -1 });
  res.render("./listings/index.ejs", {
    alllistings,
    categories: CATEGORIES,
    currentSearch: search || "",
    currentCategory: category || "",
  });
};
module.exports.renderNewForm =(req,res) => {
    res.render("./listings/new.ejs");
   }

module.exports.showListing=async (req,res) => {
    let {id}= req.params;
    const listings = await listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
    if(!listing){
            req.flash("error"," listing does not exist");
            res.redirect("/listings");
    }

    res.render("./listings/show.ejs",{listing:listings});

}
module.exports.createListing= async(req,res,next)=> {
   let url= req.file.path;
   let filename= req.file.filename;
   
    const newlisting = new listing ( req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image ={url,filename};
    await newlisting.save();
    req.flash("success","new listing created")
    res.redirect("/listings");
}
// app.post("/listings",validateListing,
//     wrapAsync(async(req,res,next)=> {
   
//     const newlisting = new listing ( req.body.listing);
    
//     await newlisting.save();
//     res.redirect("/listings");
       
   
// }));
module.exports.renderEditForm=async (req,res) =>{
     let {id}= req.params;
    const listings = await listing.findById(id);
    res.render("./listings/edit.ejs",{listing:listings})


}
module.exports.updateListing=async (req,res) => {
    
    let {id}= req.params;
 
 let Listing =await listing.findByIdAndUpdate(id,{ ...req.body.listing });
 if(typeof req.file !="undefined"){
     let url= req.file.path;
   let filename= req.file.filename;
   Listing.image={url,filename};
   await Listing.save();
 }
 
     req.flash("success","listing updated")
    res.redirect(`/listings/${id}`)
}
// router.put("/listings/:id",validateListing,wrapAsync(async (req,res) => {
//      let {id}= req.params;
//     let listings =await listing.findById(id);
// if(!listings.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error", "you don't have permission to edit");
//      res.redirect(`/listings/${id}`);
// }
//  await listing.findByIdAndUpdate(id,{ ...req.body.listing });
//  res.redirect(`/listings/${id}`)
// }))
module.exports.destroyListing= async (req,res) =>{
     let {id}= req.params;
     let deletedlisting=  await listing.findByIdAndDelete(id);
 
         req.flash("success"," listing deleted")
     res.redirect("/listings");
     
}