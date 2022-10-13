#!/usr/bin/env node

const chalk = require('chalk');
// const fs = require("fs-extra");
const cowsay = require('cowsay2');
const yasuna16 = require('cowsay2/cows/yasuna_16');
const yasuna10 = require('cowsay2/cows/yasuna_10');

const initLint = require('./reformProject');

async function lintCli() {
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split('.');
  const major = semver[0];

  const args = process.argv;
  const LintVersion = args[2]; // 是否要新增修改 .eslintrc.js等,传0则禁止；
  const isHandleVscode = args[3]; // 是否要修改 .vscode/setting.json,传0则禁止；

  if (LintVersion === '--help' || LintVersion === '-h') {
    console.log(
      chalk.yellow(
        cowsay.say(`\n 使用示例：\n\n ${chalk.green('$ -lint 0 0 \n')}`, {
          cow: yasuna10,
          W: 100,
          n: true,
        }),
      ),
    );
    process.exit(0);
  }

  if (major < 14) {
    console.log(
      chalk.cyan(
        cowsay.say(
          `你现在运行的 node 版本是 ${chalk.red(currentNodeVersion)} 。\n` +
            `我们要求 node 版本在 ${chalk.magenta('14')} 以上。\n` +
            `请升个级吧！`,
          { cow: yasuna16, W: 100, n: true },
        ),
      ),
    );
    process.exit(1);
  }

  await initLint({
    isNeedCustom: true,
    isHandleFile: LintVersion !== '0',
    isHandleVscode: isHandleVscode !== '0',
  });
}

lintCli();
