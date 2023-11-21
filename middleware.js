const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res,next) =>{
  // console.log(req.user);
  console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create ,edit or delete listings!");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl= req.session.redirectUrl
  }
  next();
};

module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if ( !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error","you are not the owner of this post");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports. validateListing = (req, res, next) => {
  let {error}= listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let {error}= reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if ( !review.author.equals(res.locals.currUser._id)) {
    req.flash("error","you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};








// the middle ware in line number  12 created because the code in user.js passport when you login it 
// will automatically dele req.session.redirectUrl but to make our user friendly 
// it sould redirect