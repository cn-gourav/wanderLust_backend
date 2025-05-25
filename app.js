// Description: A simple Express application that connects to a MongoDB database,
// provides routes for managing listings and reviews, and includes error handling.
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listing");
const reviews = require("./routes/review");

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

// test router 
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// All Router here !! 
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)
 
// all routes check 
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));

}); 

// Error handle middleware 
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs" , {err});
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
