const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const { send, title } = require("process");
const methodOverride = require('method-override');

app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
// app.use(express.json())
app.use(methodOverride("_method"))

main()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});


//Index route
app.get("/listings", async (req, res) => {   
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings }); 
});

// new form 
app.get("/listings/new",(req,res)=>{
  res.render("listings/new")
})

// show route 
app.get("/listings/:id", async(req,res)=>{
  let{id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs" , {listing});
});

// Create Route 
app.post("/listings",async(req,res)=>{
  // let {title,description,image,price,location,country} = req.body
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings")
})

//edit and update 
app.get("/listings/:id/edit" ,async(req,res)=>{
   let{id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit" , {listing})
})


// update router
app.put("/listings/:id" , async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`)
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
