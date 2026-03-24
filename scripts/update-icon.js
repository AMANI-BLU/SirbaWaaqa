const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function updateIcon() {
    const sourcePath = path.join(__dirname, '../assets/images/new_cross_icon.png');
    const iconPath = path.join(__dirname, '../assets/images/icon.png');
    const foregroundPath = path.join(__dirname, '../assets/images/android-icon-foreground.png');

    console.log('Reading source icon...');
    const buffer = fs.readFileSync(sourcePath);
    const source = await Jimp.read(buffer);

    // 1. Create standard icon.png (1024x1024)
    // We want the cross to be centered and look good.
    // For a standard icon, we can use most of the space.
    console.log('Creating icon.png...');
    const icon = new Jimp({ width: 1024, height: 1024, color: 0x00000000 });

    // Resize source to fit within 900x900 to give a small margin
    const sourceResized = source.clone().scaleToFit({ w: 900, h: 900 });

    icon.composite(sourceResized, (1024 - sourceResized.bitmap.width) / 2, (1024 - sourceResized.bitmap.height) / 2);
    await icon.write(iconPath);

    // 2. Create android-icon-foreground.png (1024x1024)
    // FOR ANDROID ADAPTIVE ICONS:
    // The "safe zone" is the inner 66% (676x676 on 1024x1024 canvas)
    console.log('Creating android-icon-foreground.png...');
    const foreground = new Jimp({ width: 1024, height: 1024, color: 0x00000000 });

    // Resize source to fit safely within the adaptive icon "safe zone"
    // 660x660 is a safe size to avoid clipping on rounded/squircle masks.
    const foregroundResized = source.clone().scaleToFit({ w: 660, h: 660 });

    foreground.composite(foregroundResized, (1024 - foregroundResized.bitmap.width) / 2, (1024 - foregroundResized.bitmap.height) / 2);
    await foreground.write(foregroundPath);

    console.log('Icon update complete!');
}

updateIcon().catch(err => {
    console.error('Error updating icon:', err);
    process.exit(1);
});
