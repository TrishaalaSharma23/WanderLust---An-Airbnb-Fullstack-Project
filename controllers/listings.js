const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({                             //NESTED POPULATE
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested listing does not exists.");
        return res.redirect("/listings");
    } else {
        res.render("./listings/show.ejs", { listing, currUser: req.user });
    }
};

module.exports.newListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Requested listing does not exists.");
        const statusCode=302;
        res.redirect(statusCode , "/listings");
    }

    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");  //CHANGING PIXELS USING API OF CLOUDINARY
    res.render("./listings/edit.ejs", { list, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updatedList = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedList.image = { url, filename };
    }
    await updatedList.save();
    req.flash("success", "Listing updated Successfully!");
    res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfuly")
    res.redirect("/listings");
};

