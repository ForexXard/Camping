var express = require("express"),
    router = express.Router(),
    passport =require("passport"),
    User = require("../models/user");
    
//Root Route
router.get("/", function(req, res){
    res.render("landing");
});
// =========AUTH ROUTES============


// ====Show register form======
router.get("/register", function(req, res) {
    res.render("register");
});

//Handle sign up
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Campground " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Login Route

//show login form

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Log out Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Loged you out")
    res.redirect("/campgrounds");
});

// Loged in Function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;