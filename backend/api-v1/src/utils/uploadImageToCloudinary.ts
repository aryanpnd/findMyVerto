import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/**
 * Uploads a base64 encoded image to Cloudinary inside the "students" folder and returns the secure URL.
 * @param base64Image - The base64 encoded image string.
 * @param regNo - The student's registration number (used as public_id).
 * @returns The Cloudinary secure URL.
 */
export const uploadImageToCloudinary = async (base64Image: string, regNo: string): Promise<string> => {
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
