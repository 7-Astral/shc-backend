const multer =require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name:"dqumrztof",
    api_key:"726667758648372",
    api_secret:"DOwHEuqLY0frNdIR_35V_gdXJwk",

  });

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"Doctor",
        format:async()=>"jpeg",
        public_id:(req,file)=>file.filename,
    }
});

const parser = multer({
    storage:storage
});

module.exports = parser;