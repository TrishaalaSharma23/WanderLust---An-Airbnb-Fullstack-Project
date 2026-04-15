const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, saveRedirectUrl, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {cloudinary , storage} = require("../cloudConfig.js");
const upload= multer({ storage });

//NEW
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
.route("/")
.get(wrapAsync(listingController.index)) //INDEX ROUTE
.post(isLoggedIn , validateListing, upload.single('listing[image]'), wrapAsync(listingController.newListing));  //CREATE ROUTE

router
.route("/:id")
.get(wrapAsync(listingController.showListing))  //SHOW ROUTE
.put(isLoggedIn, isOwner, validateListing, upload.single('listing[image]') , wrapAsync(listingController.updateListing)) //UPDATE ROUTE
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //DELETE ROUTE

//EDIT ROUTE
router.get("/:id/edit", saveRedirectUrl, isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;
