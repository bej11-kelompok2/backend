const cloudinary = require('cloudinary').v2
const fs = require('fs')
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

async function uploadCloudinary(filepath) {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            use_filename: true 
        })
        await fs.unlinkSync(filepath)

        return result.url

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        try {
            await fs.unlinkSync(filepath)
        } catch (error) {
            console.error('Error deleteing file:',fs.unlinkError)
        }
        return null
    }
}
    

module.exports = uploadCloudinary