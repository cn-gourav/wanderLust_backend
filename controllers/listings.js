const Listing = require("../models/listing");

module.exports.index = async (req, res) => {   
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings }); 
}


module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new")
}

module.exports.showListing = async(req,res)=>{
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
}

module.exports.createListing = async(req,res)=>{
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id; // Set the owner of the listing
  await newListing.save();
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings")
}

module.exports.renderEditForm = async(req,res)=>{
   let{id} = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  req.flash("success", "Edit Listing Successfully");
  res.render("listings/edit" , {listing})
}

module.exports.updateListing = async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req,res)=>{
  let {id} = req.params;
  let deleting = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings")
}