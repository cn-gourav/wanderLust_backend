const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema} = require("../schema.js");



// vaildateListing middleware 
const vaildateListing = (req, res, next) => {
   let {error}=  listingSchema.validate(req.body); // Validate the listing data
  if(error){
    let errmsg = error.details.map((el) => el.message).join(", "); 
    throw new ExpressError(400, errmsg); 
  }else{
    next();
  }
}


//Index route
router.get("/", wrapAsync( async (req, res) => {   
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings }); 
}));

// new form 
router.get("/new",(req,res)=>{
  res.render("listings/new")
})

// show router 
router.get("/:id", wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews"); // Populate reviews for the listing
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", {listing});
}));

// Create router 
router.post("/",vaildateListing
  ,wrapAsync(async(req,res)=>{
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings")
}));

//edit and update 
router.get("/:id/edit", wrapAsync(async(req,res)=>{
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
router.put("/:id",vaildateListing
   , wrapAsync(async(req,res)=>{w
  if(!req.body.listing){
    throw new ExpressError(400,"Invalid Listing Data");
  }
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`)
}))

// delete route 
router.delete("/:id" , wrapAsync( async(req,res)=>{
  let {id} = req.params;
  let deleting = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings")
}))




module.exports = router;