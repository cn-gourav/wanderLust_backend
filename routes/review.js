const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access listing ID
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require("../models/listing");
const Review = require('../models/review');
const { vaildateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');




// post route 
router.post("/",isLoggedIn,vaildateReview,
  wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);
 newReview.author = req.user._id;

 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
  req.flash("success", "Review added successfully");
    // Redirect to the listing page after adding the review
 res.redirect(`/listings/${listing._id}`); 
}))


// delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor ,wrapAsync(async(req,res)=>{
  let{id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // Remove review from listing
  // Delete the review from the database
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;
