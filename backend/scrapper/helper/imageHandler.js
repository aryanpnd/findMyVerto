const { promisify } = require('util');
const stream = require('stream');
const cloudinary = require('cloudinary').v2;

const saveImage = async (page, imageUrl, regNo) => {
    await page.goto(imageUrl);
    const imageElement = await page.$('img');
    const imageBuffer = await imageElement.screenshot({ encoding: 'binary' });

    const publicId = `findMyVerto/${regNo}`;

    try {
        // Check if the image already exists on Cloudinary
        await cloudinary.api.resource(publicId);
        // If it exists, return the existing URL
        return cloudinary.url(publicId);
    } catch (error) {
        if (error.error.http_code === 404) {
            // Image does not exist, proceed to upload
            try {
                // Create a passthrough stream
                const passthrough = new stream.PassThrough();
                // Write the image buffer to the passthrough stream
                passthrough.end(imageBuffer);

                // Upload the image to Cloudinary
                const uploadResult = await new Promise((resolve, reject) => {
                    passthrough.pipe(
                        cloudinary.uploader.upload_stream(
                            { public_id: publicId, overwrite: true },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        )
                    );
                });

                // Return the URL of the uploaded image
                return uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Upload Error:', uploadError);
                return null;
            }
        } else {
            // An unexpected error occurred
            console.error('Error:', error);
            return null;
        }
    }
};

module.exports = { saveImage };
