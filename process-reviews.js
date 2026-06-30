const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'assets', 'testimonials and reviews');
const destDir = path.join(__dirname, 'assets');

if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    let imgCount = 1;
    let vidCount = 1;
    
    // Sort files to process base files before (1) files
    files.sort();

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const oldPath = path.join(srcDir, file);
        
        // Skip duplicate files
        if (file.includes('(1)')) {
            fs.unlinkSync(oldPath);
            return;
        }

        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            fs.renameSync(oldPath, path.join(destDir, `review_img_${imgCount}${ext}`));
            imgCount++;
        } else if (ext === '.mp4' || ext === '.mov') {
            fs.renameSync(oldPath, path.join(destDir, `review_vid_${vidCount}${ext}`));
            vidCount++;
        }
    });

    // Delete the empty directory
    try {
        fs.rmdirSync(srcDir);
    } catch(e) {
        console.error("Could not remove dir, it might not be empty: ", e.message);
    }
    console.log(`Processed ${imgCount - 1} images and ${vidCount - 1} videos.`);
} else {
    console.log("Source directory not found.");
}
