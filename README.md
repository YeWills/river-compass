
# river-compass

river（河流）compass（指南针），航行指南针，引申为规则，本包是一个lint规则集合。<br>
集成了prettier、eslint、stylelint配置规则和vscode/setting.json，主要用于所有项目使用统一的lint规则，支持js、typeScript。<br>
>另外本包提供了cli命令，可一键将以上lint配置集成到新项目中，或者将老项目的lint配置更换。

# Use

安装

```bash
npm i river-compass
```

in `.eslintrc.js`

```js
module.exports = {
  extends: [require.resolve('river-compass/dist/eslint')],

  // in antd-design-pro
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },

  rules: {
    // your rules
  },
};
```

in `.stylelintrc.js`

```js
module.exports = {
  extends: [require.resolve('river-compass/dist/stylelint')],
  rules: {
    // your rules
  },
};
```

in `.prettierrc.js`

```js
const rclint = require('river-compass');

module.exports = {
  ...rclint.prettier,
};
```

# bin
为了给项目集成lint更加方便，也为了解决eslint相关包冲突失效的问题。

提供了`compass-lint`命令，一键集成lint，以及vscode的setting.json。

### 安装
全局安装river-compass：
```s
npm install river-compass -g
```
也可以安装river-compass到局部，通过 npx 使用 `compass-lint`命令。

### 使用
项目根目录下执行：
```s
compass-lint
```
<image src="./bin.png">

### 文件变动如下：

<image src="./file.png">


增加了 .vscode/settions.json :
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "stylelint.validate": [
    "css",
    "less",
    "scss"
  ]
}
```
