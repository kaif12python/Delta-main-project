const Listing = require("../models/listing");
const Review = require("../models/review");

// post review
module.exports.createReview = async(req,res)=> {
    
     let listing= await Listing.findById(req.params.id)
     let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
     console.log(newReview);
     listing.reviews.push(newReview);
  
     await newReview.save();
     await listing.save();
     req.flash("success", "New Review Added!");
     res.redirect(`/listings/${listing._id}`)};

// delete review
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted!");
    res.redirect(`/listings/${id}`);
   };