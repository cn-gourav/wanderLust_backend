// Description: A simple Express application that connects to a MongoDB database,
// provides routes for managing listings and reviews, and includes error handling.
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
const {reviewSchema} = require("./schema.js");

const listingRouter = require("./routes/listing");

// Middleware
app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public"))) 


// Connect to MongoDB
main()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


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

// test router 
app.get("/", (req, res) => {
  res.send("Hello World!");
});





//review route

// post route 
app.post("/listings/:id/reviews",vaildateReview,
  wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id);
 let newReview = new Review(req.body.review);
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
 res.redirect(`/listings/${listing._id}`); 
}))


// delete review route
app.delete("/lisitngs/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
  let{id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // Remove review from listing

  // Delete the review from the database
  await Review.findByIdAndDelete(reviewId)

  res.redirect(`/listings/${id}`);
}))


// All Router here !! 
app.use("/listings", listingRouter);

 
// all routes check 
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));

}); 

// Error handle middleware 
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs" , {err});
});


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
