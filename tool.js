// 拷贝目录文件

const fs = require('fs');
const path = require('path');

function copyFilesSync(source, destination) {
  const items = fs.readdirSync(source);

  // 创建目标文件夹
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < items.length; i++) {
    const sourcePath = path.join(source, items[i]);
    const destinationPath = path.join(destination, items[i]);

    // 获取文件的状态
    const stat = fs.lstatSync(sourcePath);

    if (stat.isFile()) {
      // ts\js文件已经被 tsc 或 babel 解析和复制，不需要复制
      if (/\.t|js\b/.test(sourcePath)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // 复制文件
      fs.copyFileSync(sourcePath, destinationPath);
    } else if (stat.isDirectory()) {
      // 递归复制子文件夹
      copyFilesSync(sourcePath, destinationPath);
    }
  }
}

// export default copyFilesSync;
// // 使用示例
const sourceDir = './src';
const destinationDir = './dist';

copyFilesSync(sourceDir, destinationDir);
