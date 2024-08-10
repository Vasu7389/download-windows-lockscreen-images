const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Source directory where Spotlight images are stored
const spotlightDir = path.join(
  process.env.USERPROFILE,
  "AppData",
  "Local",
  "Packages",
  "Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy",
  "LocalState",
  "Assets"
);

// Destination directory where images will be copied to
const destDir = path.join(
  process.env.USERPROFILE,
  "Pictures",
  "Spotlight Images"
);

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdir(spotlightDir, (err, files) => {
  if (err) {
    console.error("Error reading Spotlight directory:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(spotlightDir, file);

    // Filter out small files (not wallpapers)
    if (fs.statSync(filePath).size > 100000) {
      const destPath = path.join(destDir, file + ".jpg");

      // Copy file to the destination directory with a .jpg extension
      fs.copyFile(filePath, destPath, (err) => {
        if (err) {
          console.error("Error copying file:", err);
        } else {
          console.log(`Copied ${filePath} to ${destPath}`);
        }
      });
    }
  });

  console.log(`All Spotlight images have been copied to ${destDir}`);
  exec(`start "" "${destDir}"`);
});
