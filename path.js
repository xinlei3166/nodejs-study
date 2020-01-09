const path = require('path');

// 解析当前目录:
const workDir = path.resolve('.'); // '/Users/junxi/nodejs/learning'
console.log(workDir);

// 组合完整的文件路径:当前目录+'pub'+'index.html':
const filePath = path.join(workDir, 'pub', 'index.html');   // '/Users/junxi/nodejs/learning/pub/index.html'
console.log(filePath);
