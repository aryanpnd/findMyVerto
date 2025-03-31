import ImageKit from 'imagekit';

const imagekitPublicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const imagekitUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit: ImageKit | null = null;
if (imagekitPublicKey && imagekitPrivateKey && imagekitUrlEndpoint) {
  imagekit = new ImageKit({
    publicKey: imagekitPublicKey,
    privateKey: imagekitPrivateKey,
    urlEndpoint: imagekitUrlEndpoint,
  });
} else {
  console.warn('Warning: Missing ImageKit environment variables. ImageKit functionality will not work.');
}

export const uploadImageToImageKit = async (base64Image: string, regNo: string): Promise<string> => {
  if (!imagekit) {
    throw new Error('ImageKit environment variables are not set.');
  }

  try {
    let dataUri = base64Image;
    if (!base64Image.startsWith("data:image/")) {
      dataUri = `data:image/jpg;base64,${base64Image}`;
    }

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      imagekit!.upload(
        {
          file: dataUri,
          fileName: `${regNo}.jpg`,
          folder: '/students',
          useUniqueFileName: false,
          isPrivateFile: false,
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