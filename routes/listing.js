const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const {isLoggedIn, isOwner ,vaildateListing} = require("../middleware.js"); 
const listingsController = require("../controllers/listings.js");

//Index route
router.get("/", 
  wrapAsync(listingsController.index));


// new form 
router.get("/new",
  isLoggedIn,
  listingsController.renderNewForm);


// show router 
router.get("/:id",
   wrapAsync( listingsController.showListing));


// Create router 
router.post("/",
  isLoggedIn,
  vaildateListing
  ,wrapAsync(listingsController.createListing));


//edit and update 
router.get("/:id/edit",
  isLoggedIn,
   wrapAsync(listingsController.renderEditForm));


// update routerr
router.put("/:id",
  isLoggedIn,
  isOwner,
  vaildateListing, 
   wrapAsync(listingsController.updateListing));

// delete route 
router.delete("/:id" ,
  isLoggedIn,
  isOwner,
   wrapAsync(listingsController.destroyListing));




module.exports = router;