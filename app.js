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
const session = require('express-session');
const flash = require('connect-flash');

const listings = require("./routes/listing");
const reviews = require("./routes/review");


// Connect to MongoDB
main()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


// Middleware
app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public"))) 

const sessionOptions ={
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()*7*24*60*60*1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds  
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  }
}

// test router 
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
})

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
