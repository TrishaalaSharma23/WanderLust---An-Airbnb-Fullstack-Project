const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//To connect backend with cloudinary
cloudinary.config({    //cloud_name,api_key,api_secret should be this only by name
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

//To make folder and allowed formats of image
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params : {
        folder: "wanderlust_DEV",
        allowedFormats: ['png' , 'jpg' , 'jpeg'],
    }
});

module.exports= { cloudinary , storage };