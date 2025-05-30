const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access listing ID
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require("../models/listing");
const Review = require('../models/review');
const { vaildateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review');



// post route 
router.post("/",
  isLoggedIn,
  vaildateReview,
  wrapAsync(reviewController.createReview))


// delete review route
router.delete("/:reviewId",
  isLoggedIn, 
  isReviewAuthor ,
  wrapAsync( reviewController.deleteReview));

module.exports = router;
