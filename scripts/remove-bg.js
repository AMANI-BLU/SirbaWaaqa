const mod = require('jimp');
const Jimp = mod.Jimp || mod.default || mod;
const path = require('path');

console.log('Starting background removal...');
Jimp.read(path.join(__dirname, '../assets/images/mk.png')).then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // If pixel is white or very close to white, make it completely transparent
        if (r > 240 && g > 240 && b > 240) {
            this.bitmap.data[idx + 3] = 0; // Alpha 0
        }
    });
    image.write(path.join(__dirname, '../assets/images/logo-transparent.png'));
    console.log('Successfully saved logo-transparent.png!');
}).catch(err => {
    console.error("Failed to process image:", err);
});
