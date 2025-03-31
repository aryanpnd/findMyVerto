import { v2 as cloudinary } from 'cloudinary';

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
  console.warn('Warning: Missing Cloudinary environment variables. Cloudinary functionality may not work properly.');
}

cloudinary.config({
  cloud_name: cloudinaryCloudName || '',
  api_key: cloudinaryApiKey || '',
  api_secret: cloudinaryApiSecret || '',
});

export const uploadImageToCloudinary = async (base64Image: string, regNo: string): Promise<string> => {
  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw new Error('Cloudinary environment variables are not set.');
  }

  try {
    let dataUri = base64Image;
    if (!base64Image.startsWith("data:image/")) {
      dataUri = `data:image/png;base64,${base64Image}`;
    }

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: 'students',
      public_id: regNo,
      overwrite: true,
    });

    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
