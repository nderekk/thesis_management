const fs = require('fs').promises;
const path = require('path');

async function deleteUploadedFile(filename) {
  if (!filename) return;
  try {
    const filePath = path.join(__dirname, '../uploads', filename);
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file "${filename}":`, error.message);
    throw error;
  }
}

module.exports = deleteUploadedFile;
