const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const POSTS_DIR = path.join(__dirname, '..', 'public', 'content', 'posts');

async function extractExif(imagePath) {
    try {
        const tags = ['Make', 'Model', 'LensMake', 'LensModel', 'FNumber', 'ExposureTime', 'ISO', 'PhotographicSensitivity'];
        const data = await exifr.parse(imagePath, tags);
        if (!data) return null;

        const exif = {};

        if (data.Make || data.Model) {
            exif.camera = [data.Make, data.Model].filter(Boolean).join(' ');
            if (data.Make && data.Model && data.Model.toLowerCase().startsWith(data.Make.toLowerCase())) {
                exif.camera = data.Model;
            }
        }

        if (data.LensMake || data.LensModel) {
            exif.lens = [data.LensMake, data.LensModel].filter(Boolean).join(' ');
            if (data.LensMake && data.LensModel && data.LensModel.toLowerCase().startsWith(data.LensMake.toLowerCase())) {
                exif.lens = data.LensModel;
            }
        }

        const iso = data.ISO || data.PhotographicSensitivity;
        const settings = [];
        if (data.FNumber) settings.push(`f/${data.FNumber}`);
        if (data.ExposureTime) {
            const exp = data.ExposureTime >= 1 ? data.ExposureTime : `1/${Math.round(1 / data.ExposureTime)}`;
            settings.push(`${exp}s`);
        }
        if (iso) settings.push(`ISO ${iso}`);

        if (settings.length > 0) {
            exif.settings = settings.join(' ');
        }

        return Object.keys(exif).length > 0 ? exif : null;
    } catch (err) {
        return null; // Ignore errors like no EXIF data, or unsupported formats
    }
}

async function main() {
    console.log('Generating EXIF data for existing posts...\n');

    if (!fs.existsSync(POSTS_DIR)) {
        console.log('No posts directory found.');
        return;
    }

    const slugs = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    let totalImagesGenerated = 0;

    for (const slug of slugs) {
        const postDir = path.join(POSTS_DIR, slug);
        const files = fs.readdirSync(postDir).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

        const exifData = {};

        for (const file of files) {
            const filePath = path.join(postDir, file);
            const extData = await extractExif(filePath);
            if (extData) {
                exifData[file] = extData;
                totalImagesGenerated++;
            }
        }

        if (Object.keys(exifData).length > 0) {
            fs.writeFileSync(path.join(postDir, 'exif.json'), JSON.stringify(exifData, null, 2), 'utf-8');
            console.log(`Generated exif.json for [${slug}] with ${Object.keys(exifData).length} image(s)`);
        } else {
            console.log(`No EXIF data found for [${slug}].`);
        }
    }

    console.log(`\nOperation complete. Total images with EXIF data extracted: ${totalImagesGenerated}`);
}

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
