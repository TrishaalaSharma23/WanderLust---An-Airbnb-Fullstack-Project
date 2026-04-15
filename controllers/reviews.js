const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req , res) => {
    let {id , reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});
    //pull means reviews k array mai jaa kar reviewId se joh bhi match krega usko update kar do
    req.flash("success", "Review deleted successfully!")
    res.redirect(`/listings/${id}`);
};