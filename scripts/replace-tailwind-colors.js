const fs = require('fs');
const path = require('path');

const COLOR_MAP = [
  { regex: /bg-\[#1f1f25\]/g, replace: 'bg-bg' },
  { regex: /bg-\[#23272f\]/g, replace: 'bg-input' },
  { regex: /bg-\[#262d36\]/gi, replace: 'bg-card' },
  { regex: /bg-white/g, replace: 'bg-card' },
  { regex: /bg-gray-900/g, replace: 'bg-bg' },
  { regex: /bg-gray-800/g, replace: 'bg-card' },
  { regex: /bg-blue-500/g, replace: 'bg-primary' },
  { regex: /bg-blue-600/g, replace: 'bg-primary' },
  { regex: /text-white/g, replace: 'text-text' },
  { regex: /text-gray-100/g, replace: 'text-text' },
  { regex: /text-gray-400/g, replace: 'text-sub' },
  { regex: /text-gray-500/g, replace: 'text-sub' },
  { regex: /border-gray-700/g, replace: 'border-line' },
  { regex: /border-\[#E2E8F0\]/gi, replace: 'border-line' },
  { regex: /border-\[#23272f\]/gi, replace: 'border-line' },
  { regex: /border-gray-200/g, replace: 'border-line' },
  { regex: /border-gray-300/g, replace: 'border-line' },
  { regex: /bg-\[#0E9EDF\]/gi, replace: 'bg-primary' },
  { regex: /bg-\[#14C2B3\]/gi, replace: 'bg-accent' },
  { regex: /bg-\[#FF5959\]/gi, replace: 'bg-danger' },
  { regex: /bg-\[#FFA447\]/gi, replace: 'bg-warn' },
  { regex: /bg-\[#3CCE71\]/gi, replace: 'bg-safe' },
  { regex: /text-\[#E6EAF1\]/gi, replace: 'text-text' },
  { regex: /text-\[#9CA4B3\]/gi, replace: 'text-sub' },
  { regex: /bg-\[#212730\]/gi, replace: 'bg-input' },
];

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(file) {
  if (!/\.(tsx?|jsx?)$/.test(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let replaced = false;
  COLOR_MAP.forEach(({ regex, replace }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replace);
      replaced = true;
    }
  });
  if (replaced) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Replaced:', file);
  }
}

walk('./components', replaceInFile);
walk('./pages', replaceInFile);
walk('./src', replaceInFile);
