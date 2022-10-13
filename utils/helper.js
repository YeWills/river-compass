const fs = require('fs');
const path = require('path');

const npmPkgPath = path.join(__dirname, '.././package.json');

const getLintPackageJsn = () => {
  const packageJsonStr = fs.readFileSync(npmPkgPath);
  return JSON.parse(packageJsonStr);
};

const getLintDependencies = () => {
  const packageJson = getLintPackageJsn();
  // 删除原有项目有关 eslint 或 stylelint 所有依赖
  const eslintNpm = Object.entries(packageJson.dependencies)
    .filter(([key]) => {
      return /eslint|stylelint/.test(key);
    })
    .map(([key]) => key);
  return [...eslintNpm];
};

const goExit = () => {
  // todo 如何退出不报错
  process.exit(1);
};

// 获取执行命令行根目录下的目录地址
const getProcessCwdPath = (folderName) => {
  const cwdPath = process.cwd();
  return path.join(cwdPath, folderName);
};

module.exports = {
  getLintPackageJsn,
  getLintDependencies,
  goExit,
  getProcessCwdPath,
};
