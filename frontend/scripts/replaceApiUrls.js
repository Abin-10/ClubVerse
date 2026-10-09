import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);
let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:5000')) {
    // Replace single quotes 'http://localhost:5000...' with template literal `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}...`
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}$1` ");
    // Replace double quotes "http://localhost:5000..." with template literal `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}...`
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}$1` ");
    // Replace template literals `http://localhost:5000...` with `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}...`
    content = content.replace(/`http:\/\/localhost:5000/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}");
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(srcDir, file)}`);
    modifiedCount++;
  }
}

console.log(`\n🎉 Successfully updated ${modifiedCount} files to use dynamic VITE_API_BASE_URL.`);
