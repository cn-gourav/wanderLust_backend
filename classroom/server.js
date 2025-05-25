const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/post");
const { reviewSchema } = require("../schema");
const session = require("express-session");
const flash =  require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const sessionOptions = {
     secret: "mysecret",
     resave: false,
     saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
     let{name = "anoynmous"} = req.query;
     req.session.name = name;
     console.log(req.session.name);

     if(name === "anoynmous") {
          req.flash("error", "user registration failed");
     }else{

          req.flash("success", "user registered successfully");
     }
     res.redirect("/login");
});

app.get("/login", (req, res) => {
     res.locals.successmsg = req.flash("success");
     res.locals.errormsg = req.flash("error");

     // console.log(req.flash("success"));
     res.render("page.ejs",{name : req.session.name });
})
// app.get("reqcount", (req, res) => {
//      if(req.session.count) {
//          req.session.count++;
//      }
//      else {
//          req.session.count = 1;
//      }
//     res.send(`you sent a request ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//      res.send("Hello from test route!");
// })


app.listen(3000,() =>{
     console.log("Server is running on port 3000");
})