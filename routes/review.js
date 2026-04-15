const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//REVIEW ROUTE
router.post("/", isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId" , isLoggedIn,  wrapAsync(reviewController.destroyReview));

module.exports = router;