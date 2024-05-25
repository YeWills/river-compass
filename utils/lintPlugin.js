const fs = require('fs');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const helper = require('./helper');
const init = require('./reformProject');

// todo 判断是否集成river-compass, 可以优化更多条件；
const isIntegrateEslint = () => {
  const packagejsonPath = helper.getProcessCwdPath('./package.json');
  const packageJsonStr = fs.readFileSync(packagejsonPath);
  const packageJson = JSON.parse(packageJsonStr);
  // packageJson.devDependencies[name]
  const key = 'lint-staged:js';
  if (packageJson.scripts[key]) {
    return true;
  }
  return false;
};

const isInitHusky = () => {
  // todo 判断是否初始化 Husky 的条件需要优化
  const precommitPath = helper.getProcessCwdPath('./.husky/pre-commit');
  return fs.existsSync(precommitPath);
};

/**
 *
 * @param {*} packagejsonPath = './package.json'
 * @param {*} srcName = 'src'
 */
const lintPlugin = async () => {
  console.log('start  lintPlugin .....');

  const isEslintExit = isIntegrateEslint();

  // 是否集成 eslint
  if (isEslintExit) {
    // 是否初始化过husky
    const isPreCommitInstall = isInitHusky();
    if (!isPreCommitInstall) {
      const { next } = await inquirer.prompt({
        type: 'confirm',
        name: 'next',
        message: `没有初始化husky，是否要初始化husky?`,
        default: false,
      });
      if (next) {
        execSync(
          'npm run husky',
          { cwd: process.cwd() },
          (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
          }
        );
        console.log('husky 初始化完成，线程将正常终止，请重启项目！');
      }
      helper.goExit();
    }
    console.log(' eslint及其husky 检查通过。');
  } else {
    const { next } = await inquirer.prompt({
      type: 'confirm',
      name: 'next',
      message: `你没有集成统一的 eslint， 是否要集成?`,
      default: false,
    });
    if (next) {
      await init();
    }
  }
};

module.exports = lintPlugin;
