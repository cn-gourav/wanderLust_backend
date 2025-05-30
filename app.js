if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
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
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user");



// Import routes
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");


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

//session and flash middleware
app.use(session(sessionOptions));
app.use(flash());


// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//       username: "emoUser",
//       email: "demo@gmail.com"
//     });
//     let registeredUser = await User.register(fakeUser, "1234")
//     res.send(registeredUser)
// })






// All Router here !! 
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter);  
 






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
