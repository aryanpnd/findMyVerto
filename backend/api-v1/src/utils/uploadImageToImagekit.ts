import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string, 
});

/**
 * Uploads a base64 encoded image to ImageKit inside the "students" folder and returns the image URL.
 * @param base64Image - The base64 encoded image string.
 * @param regNo - The student's registration number (used as fileName).
 * @returns The ImageKit image URL.
 */
export const uploadImageToImageKit = async (base64Image: string, regNo: string): Promise<string> => {
  try {
    let dataUri = base64Image;
    if (!base64Image.startsWith("data:image/")) {
      dataUri = `data:image/jpg;base64,${base64Image}`;
    }

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      imagekit.upload(
        {
          file: dataUri,                      // Base64 image with prefix
          fileName: `${regNo}.jpg`,            
          folder: '/students',                // Upload into the "students" folder
          useUniqueFileName: false,           // Overwrite if file with the same name exists
          isPrivateFile: false,               // Set to true if you want the file to be private
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });

    return uploadResponse.url;
  } catch (error: any) {
    console.error('Error uploading image to ImageKit:', error);
    throw new Error('Failed to upload image to ImageKit');
  }
};
