const { Jimp } = require('jimp');
const path = require('path');

async function fixImage(filename) {
    const filePath = path.join(__dirname, '..', 'assets', 'images', filename);
    try {
        console.log(`Processing ${filename}...`);
        const image = await Jimp.read(filePath);
        await image.write(filePath);
        console.log(`Successfully fixed ${filename}`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function main() {
    await fixImage('bg_worship.png');
    await fixImage('bg_flowers.png');
}

main();
