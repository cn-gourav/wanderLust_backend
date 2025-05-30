const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const {isLoggedIn, isOwner ,vaildateListing} = require("../middleware.js"); 
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // Import the storage configuration from cloudConfig.js
const upload = multer({  storage }); // Set the destination for uploaded files

//Index route
router.get("/", 
  wrapAsync(listingsController.index));


// new form 
router.get("/new",
  isLoggedIn,
  listingsController.
  renderNewForm);


// show router 
router.get("/:id",
   wrapAsync( listingsController.showListing));


// Create router 
router.post("/",
  isLoggedIn,
  upload.single('listing[image]'), // Use multer to handle file upload()
  vaildateListing,
  wrapAsync(listingsController.createListing)
);


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