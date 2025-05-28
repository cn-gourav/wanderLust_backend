const Listing = require("./models/listing");
const Review = require('./models/review');
const ExpressError = require("./utils/ExpressError");
const {listingSchema ,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
     //redirect to login 
     req.session.redirectUrl = req.originalUrl; // Store the original URL to redirect after login
    req.flash("error", "You must be logged in to do that!");     
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
     next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You are not authorized to edit this listing");
      return res.redirect(`/listings/${id}`); 
    }
    next();
}

// vaildateListing middleware 
module.exports.vaildateListing = (req, res, next) => {
   let {error}=  listingSchema.validate(req.body); // Validate the listing data
  if(error){
    let errmsg = error.details.map((el) => el.message).join(", "); 
    throw new ExpressError(400, errmsg); 
  }else{
    next();
  }
}

// vaildateReview middleware
module.exports.vaildateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body); // Validate the review data
  if(error){
    let errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }else{
    next();
  }
}

// Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to delete this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}