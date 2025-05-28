const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const {isLoggedIn, isOwner ,vaildateListing} = require("../middleware.js"); 


//Index route
router.get("/", wrapAsync( async (req, res) => {   
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings }); 
}));


// new form 
router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listings/new")
})


// show router 
router.get("/:id", wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate( {
    path:"reviews" ,
    populate: {
      path: "author",
    }
  })
  .populate("owner"); // Populate reviews for the listing
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", {listing});
}));


// Create router 
router.post("/",isLoggedIn,vaildateListing
  ,wrapAsync(async(req,res)=>{
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id; // Set the owner of the listing
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings")
}));


//edit and update 
router.get("/:id/edit",isLoggedIn, wrapAsync(async(req,res)=>{
   let{id} = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  req.flash("success", "Edit Listing Successfully");
  res.render("listings/edit" , {listing})
}))


// update routerr
router.put("/:id",isLoggedIn,isOwner,vaildateListing
   , wrapAsync(async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`)
}))

// delete route 
router.delete("/:id" ,isLoggedIn,isOwner, wrapAsync( async(req,res)=>{
  let {id} = req.params;
  let deleting = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings")
}))




module.exports = router;