const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const helper = require('./helper');
/**
 *
 * @param {*} packagejsonPath = './package.json'
 * @param {*} srcName = 'src'
 */
const formatPackageJson = (packagejsonPath, srcName, LintVersion) => {
  const packageJsonStr = fs.readFileSync(packagejsonPath);

  let packageJson = JSON.parse(packageJsonStr);

  const needDelete = helper.getLintDependencies();

  // river-compass 的 package.json
  const LintPackageJsn = helper.getLintPackageJsn();

  needDelete.forEach((name) => {
    if (packageJson.devDependencies) {
      delete packageJson.devDependencies[name];
    }
    if (packageJson.dependencies) {
      delete packageJson.dependencies[name];
    }
  });

  // [['husky', "^4.2.1"], ['lint-staged', "^11.1.2"],['river-compass', "^0.0.3"],['prettier', "^2.3.2"]]
  const allDevDependencies = {
    husky: '^4.2.1',
    'lint-staged': '^11.1.2',
    // todo 通过request获取最新的公司的npm最新版本
    'river-compass': LintVersion,
    prettier: LintPackageJsn.peerDependencies.prettier,
  };

  Object.entries(allDevDependencies).forEach(([key, value]) => {
    if (packageJson.devDependencies[key]) {
      packageJson.devDependencies[key] = value;
      delete allDevDependencies[key];
      return;
    }
    if (packageJson.dependencies[key]) {
      packageJson.dependencies[key] = value;
      delete allDevDependencies[key];
    }
  });

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...allDevDependencies,
  };

  const moreScripts = {
    husky:
      'npx husky install && npx husky add .husky/pre-commit "npm run lint-staged"',
    'lint:js': `eslint --ext .js,.jsx,.ts,.tsx --format=pretty "./${srcName}" `,
    'lint:fix': 'npm run lint:fix:js && npm run lint:style',
    'lint-staged': 'lint-staged',
    'lint:fix:js': `eslint --fix --ext .js,.jsx,.ts,.tsx --format=pretty "./${srcName}" `,
    'lint:style': `stylelint --fix "${srcName}/**/*.scss" --syntax scss`,
    'lint-staged:js': 'eslint --fix --ext .js,.jsx,.ts,.tsx',
    'lint-staged:style': 'stylelint --fix --syntax scss',
  };

  packageJson.scripts = { ...packageJson.scripts, ...moreScripts };

  const stagedConfig = {
    'lint-staged': {
      [`./${srcName}/**/*.{js,jsx,ts,tsx}`]: 'npm run lint-staged:js',
    },
  };

  packageJson = { ...packageJson, ...stagedConfig };

  delete packageJson.eslintConfig;

  const needDeletFiles = ['.eslintrc.ejs', '.eslintrc'];

  // 如果原来项目定义了 files ，说明需要files,否则不用管
  if (packageJson.files) {
    packageJson.files = packageJson.files
      .filter((file) => {
        return !needDeletFiles.includes(file);
      })
      .concat(['.eslintrc.js', '.prettierrc.js', '.stylelintrc.js']);
  }

  // console.log(packageJson)

  const newPackageJsonStr = JSON.stringify(packageJson, null, 2);

  fs.writeFileSync(packagejsonPath, newPackageJsonStr, function (err) {
    if (err) console.error(err);
    console.log('----------修改package.json文件完毕------------');
  });
};

const handleFiles = () => {
  fs.copyFileSync(
    path.resolve(__dirname, '.eslintrc.ejs'),
    helper.getProcessCwdPath('.eslintrc.js')
  );
  fs.copyFileSync(
    path.resolve(__dirname, '.prettierrc.ejs'),
    helper.getProcessCwdPath('.prettierrc.js')
  );
  fs.copyFileSync(
    path.resolve(__dirname, '.stylelintrc.ejs'),
    helper.getProcessCwdPath('.stylelintrc.js')
  );
  fs.copyFileSync(
    path.resolve(__dirname, '.stylelintignore.ejs'),
    helper.getProcessCwdPath('.stylelintignore')
  );

  const eslintrcPath = helper.getProcessCwdPath('./.eslintrc');
  if (fs.existsSync(eslintrcPath)) {
    fs.unlinkSync(eslintrcPath);
  }
  console.log('----------eslint配置文件添加完毕------------');
};

const handleVscodeFiles = () => {
  const vscodeSettingsPath = helper.getProcessCwdPath(
    './.vscode/settings.json'
  );

  let settingJson = {
    'editor.codeActionsOnSave': {
      'source.fixAll': true,
    },
    'stylelint.validate': ['css', 'less', 'scss'],
  };

  if (fs.existsSync(vscodeSettingsPath)) {
    const str = fs.readFileSync(vscodeSettingsPath);

    // 防止str为空， settings.json 可能为空
    const originSettingJson = str.length ? JSON.parse(str) : {};
    settingJson = { ...originSettingJson, ...settingJson };
  } else {
    fs.mkdirSync(helper.getProcessCwdPath('./.vscode'));
  }

  const newsettingJsonStr = JSON.stringify(settingJson, null, 2);
  fs.writeFileSync(vscodeSettingsPath, newsettingJsonStr, function (err) {
    if (err) console.error(err);
    console.log(err);
  });
  console.log('----------修改 settings.json文件完毕------------');
};

/**
 * @param {*} isNeedCustom 是否需要通过命令行输入自定义的目录名； 默认为false
 * 以下参数只有传 false 时才为false，不传或其他情况为true
 * @param {*} isHandleFile 是否需要新增 '.eslintrc.js', '.prettierrc.js', '.stylelintrc.js' ；
 * @param {*} isHandleVscode 是否需要操作 vscode setting.json 增加自动保存；
 */
const initPackageJson = async ({
  isNeedCustom,
  isHandleFile: _isHandleFile,
  isHandleVscode: _isHandleVscode,
} = {}) => {
  const isHandleFile = _isHandleFile !== false;
  const isHandleVscode = _isHandleVscode !== false;
  let packagePath = helper.getProcessCwdPath('./package.json');
  let srcPathName = 'src';
  let LintVersion = 'latest';
  if (isNeedCustom) {
    const info = await inquirer.prompt([
      {
        name: 'packagePath',
        message: '请输入package.json的相对路径，默认(./package.json):',
        type: 'input',
      },
      {
        name: 'srcPathName',
        message: '请输入业务代码根路径文件名，默认(src):',
        type: 'input',
      },
      {
        name: 'LintVersion',
        message: `请输入想要的river-compass版本，默认(${LintVersion}):`,
        type: 'input',
      },
    ]);
    packagePath = helper.getProcessCwdPath(
      info.packagePath || './package.json'
    );
    srcPathName = info.srcPathName || srcPathName;
    LintVersion = info.LintVersion || LintVersion;
  }

  formatPackageJson(packagePath, srcPathName, LintVersion);
  if (isHandleFile) {
    handleFiles();
  }
  if (isHandleVscode) {
    handleVscodeFiles();
  }

  const { next } = await inquirer.prompt({
    type: 'confirm',
    name: 'next',
    message: 'eslint集成成功，是否需要现在安装相关依赖?',
    default: false,
  });
  if (next) {
    console.log('请直接删除项目所有依赖，然后执行npm install 或 yarn install');
    helper.goExit();
  }
};

module.exports = initPackageJson;
