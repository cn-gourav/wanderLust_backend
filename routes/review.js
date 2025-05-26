const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access listing ID
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require("../models/listing");
const {listingSchema} = require("../schema.js");
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review');



// vaildateReview middleware
const vaildateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body); // Validate the review data
  if(error){
    let errmsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errmsg);
  }else{
    next();
  }
}

// post route 
router.post("/",vaildateReview,
  wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
  req.flash("success", "Review added successfully");
    // Redirect to the listing page after adding the review
 res.redirect(`/listings/${listing._id}`); 
}))


// delete review route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
  let{id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // Remove review from listing

  // Delete the review from the database
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;
