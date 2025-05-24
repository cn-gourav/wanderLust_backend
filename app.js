const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema.js");
const Review = require("./models/review");

app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public"))) 

main()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
app.get("/listings", wrapAsync( async (req, res) => {   
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings }); 
}));

// new form 
app.get("/listings/new",(req,res)=>{
  res.render("listings/new")
})

// show route 
app.get("/listings/:id",wrapAsync( async(req,res)=>{
  let{id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs" , {listing});
}));

// Create Route 
app.post("/listings",vaildateListing
  ,wrapAsync(async(req,res)=>{
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings")
}));

//edit and update 
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
   let{id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit" , {listing})
}))


// update router
app.put("/listings/:id",vaildateListing
   , wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"Invalid Listing Data");
  }
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`)
}))

// delete route 
app.delete("/listings/:id" , wrapAsync( async(req,res)=>{
  let {id} = req.params;
  let deleting = await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
}))


// all routes check 
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));

}); 

// Error handle middleware 
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs" , {err});
});



//review route
// post route 
app.post("/listings/:id/reviews" , async(req,res)=>{
 let listing = await Listing.findById(req.params.id) 
 let newReview = new Review(req.body.review);
 listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();

 console.log("new review saved")
//  res.send("Review saved")
 res.redirect(`/listings/${listing._id}`)
})

// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "t2est",
//     description: "test",
//     price: 2220,
//     location: "test",
//     country: "test",
//   });

//   await sampleListing
//     .save()
//     .then(() => {
//       console.log("Listing saved");
//       res.send("Listing saved");
//     }) 
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
