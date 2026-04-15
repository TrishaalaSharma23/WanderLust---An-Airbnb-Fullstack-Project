const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(res => {
    console.log("CONNECTION WITH DATABASE FULFILLED");
    initDB();
}).catch((err)=> {
    console.log("connection failed with db.");
});

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner: "69cbbbde4628adf96fe7fc36" }));
    await Listing.insertMany(initData.data);
    console.log("DATA WAS INITIALIZED")
};

