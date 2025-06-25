import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import fs from 'fs';

cloudinary.config({
    cloud_name: config.cloud.cloud_name,
    api_key: config.cloud.api_key,
    api_secret: config.cloud.api_secret
});

export const sendImageToCloudinary = async (path: string, name: string) => {
    try {
        const result = await cloudinary.uploader
            .upload(path, {
                public_id: `${name}-${Date.now()}`,
            })
        fs.unlink(path, (err) => {
            if (err) {
                console.error("Failed to delete image:", err);
            }
        });
        return result;
    } catch (error) {
        throw error
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })