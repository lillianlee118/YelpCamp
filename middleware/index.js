var Campground = require("../models/campground");
var Comment = require("../models/comments");

// all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                req.campground = foundCampground;
                next();
            } else {
                req.flash("error", "No Permission");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment doesn't exist");
                res.redirect("/campgrounds");
            } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                 req.comment = foundComment;
                 next();
            } else {
                req.flash("error", "No permission");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });    
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Must be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;


