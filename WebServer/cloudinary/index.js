const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: "dxocsnnv1",
    api_key: "194956253287119",
    api_secret: "5JUG3QD-pLkdpBBBvJiL0OjZePA"
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Project'
    }
})

module.exports = {cloudinary, storage}