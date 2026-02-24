const fs = require('fs');
const path = require('path');

// Portfolio folder
const portfolioDir = path.join(__dirname, '../portfolio');
const outputFile = path.join(portfolioDir, 'searchfiles.json');

// Recursively find .fcstd files
function getFcstdFiles(dir, prefix = '') {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getFcstdFiles(fullPath, prefix + file + '/'));
    } else if (file.endsWith('.fcstd')) {
      results.push(prefix + file);
    }
  });

  return results;
}

const fcstdFiles = getFcstdFiles(portfolioDir);

fs.writeFileSync(outputFile, JSON.stringify(fcstdFiles, null, 2));
console.log(`Generated ${outputFile} with ${fcstdFiles.length} files.`);