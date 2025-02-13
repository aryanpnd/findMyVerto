import path from "path";
import fs from "fs";

/**
 * Saves a base64 image to the server's local storage and returns its accessible URL.
 * @param {string} base64Image - The base64 encoded image.
 * @param {string} regNo - The student's registration number (for unique naming).
 * @returns {Promise<string>} - The local URL of the saved image.
 */
export const saveImageLocally = async (base64Image: string, regNo: string): Promise<string> => {
    try {
        // Convert the base64 string (without prefix) to a buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Define the folder and file path
        const imageFolder = path.join(__dirname, '../../public/student_images/');
        const imageName = `${regNo}.png`;  // Always saving as PNG
        const imagePath = path.join(imageFolder, imageName);

        // Ensure the directory exists
        if (!fs.existsSync(imageFolder)) {
            fs.mkdirSync(imageFolder, { recursive: true });
        }

        // Write the image to the server
        await fs.promises.writeFile(imagePath, imageBuffer);

        // Return the accessible URL
        return `/public/student_images/${imageName}`;
    } catch (error) {
        console.error('Error saving image locally:', error);
        throw new Error('Failed to save image locally');
    }
};
