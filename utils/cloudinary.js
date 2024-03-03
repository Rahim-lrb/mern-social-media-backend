const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dauwoapmc",
    api_key: "999399123762465",
    api_secret: "E0vCvekm4TnOFXshZRxP26Lbot4"
});

module.exports = cloudinary;
