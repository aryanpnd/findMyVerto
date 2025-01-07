const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

const saveImage = async (page, imageUrl, regNo) => {
    await page.goto(imageUrl);
    const imageElement = await page.$('img'); // Assuming the image is within an <img> tag
    const imageBuffer = await imageElement.screenshot({ encoding: 'binary'});
    const imagePath = path.join(__dirname, `../public/images/${regNo}.png`);

    try {
        await writeFile(imagePath, imageBuffer);
        return `${process.env.SERVER_URL}/images/${regNo}.png`;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { saveImage };