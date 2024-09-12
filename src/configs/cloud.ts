import { v2 as Cloudinary, ConfigOptions } from "cloudinary";

const cloudConfig: ConfigOptions = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true, // https
};

Cloudinary.config(cloudConfig);

export default Cloudinary;
