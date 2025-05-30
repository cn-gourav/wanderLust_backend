const User = require("../models/user");


module.exports.signup = async (req, res) => {
     try{
          let { username, email, password } = req.body;
          const newUser = new User({ username, email });
     
         const registeredUser = await User.register(newUser,password)
          req.login(registeredUser, (err) => {
               if (err) {
                   return next(err);
               }
               req.flash("success", "Welcome to Wanderlust!");
                res.redirect("/listings");
          });
     } catch (e) {
          req.flash("error", e.message);
          res.redirect("/signup");
     }

}


module.exports.renderSignupForm = (req, res) => {
     res.render("users/signup");
}

module.exports.renderLoginForm = (req, res) => {
     res.render("users/login");
}


module.exports.login = async(req, res) => {
          req.flash("success", "Welcome back!");
          // res.redirect("/listings");
          res.redirect(res.locals.redirectUrl || "/listings"); // Redirect to the saved URL or default to /listings
}

module.exports.logout = (req, res,next) => {
     req.logout((err) => {
          if (err) {
               return next(err);
          }
          req.flash("success", "Goodbye!");
          res.redirect("/listings");
     });
}