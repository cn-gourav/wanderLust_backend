const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);
 newReview.author = req.user._id;

 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
  req.flash("success", "Review added successfully");
    // Redirect to the listing page after adding the review
 res.redirect(`/listings/${listing._id}`); 
}


module.exports.deleteReview = async(req,res)=>{
  let{id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // Remove review from listing
  // Delete the review from the database
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
}