var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var midleware = require("../middleware")

router.get("/", function(req, res){
    req.user;
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//app.post wil send  the data from form to the campground page
//Create - send the data from the form to DB
router.post("/", midleware.isLoggedIn, function(req, res){
    //get data from form and add it to array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            console.log(newlyCreated);
            //redirect back to campgrounds
            res.redirect("/campgrounds");
        }
    });
});
// here is the form to send a new camp ground to the app.post
// New - show form to campgrounds
router.get("/new", midleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOWS - shows more info about campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
// Render Edit form
router.get("/:id/edit", midleware.checkCampgroundOwnership, function(req, res) {
    //is user loged in
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
        
            //dos user owne campground

// actualy eddit the Form
router.put("/:id", midleware.checkCampgroundOwnership, function(req, res){

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Campground

router.delete("/:id", midleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;
