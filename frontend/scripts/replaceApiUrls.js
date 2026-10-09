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

const SAFE_BASE = "(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\\/+$/, '')";

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('import.meta.env.VITE_API_BASE_URL') || content.includes('http://localhost:5000')) {
    // Replace inline expressions to ensure safe trailing slash handling
    content = content.replace(/\$\{import\.meta\.env\.VITE_API_BASE_URL \|\| 'http:\/\/localhost:5000'\}/g, `\${${SAFE_BASE}}`);
    content = content.replace(/`http:\/\/localhost:5000/g, `\`\${${SAFE_BASE}}`);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(srcDir, file)}`);
    modifiedCount++;
  }
}

console.log(`\n🎉 Successfully sanitized ${modifiedCount} files for safe URL joining.`);
