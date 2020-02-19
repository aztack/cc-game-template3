/*
if [ -z $1 ]; then
  echo 'Please provide module name'
else
  if [ -d src/assets/scripts/cc_modules/$1 ]; then
    rm -rf src/assets/scripts/cc_modules/$1
  fi
  npm i --save --prefix src/assets/scripts/ git+ssh://git@code.vipkid.com.cn:3590/edu/cc-game/infra/$1.git
  mkdir -p src/assets/scripts/cc_modules
  mv src/assets/scripts/node_modules/* src/assets/scripts/cc_modules
  echo Removing src/assets/scripts/node_modules
  if [ -z "$(ls -A src/assets/scripts/node_modules)" ]; then
    rm -rf src/assets/scripts/node_modules
    echo Done!
  else
    echo src/assets/scripts/node_modules is not empty!
  fi
fi
*/
require('colors');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const pkg = require(path.join(__dirname,'../package.json'));
const projectDir = pkg.name;
const groupUrl = pkg.ccmodulesgroup.replace(/\/$/, '');

const argv = process.argv;
if (!fs.existsSync(path.join(__dirname, `../${projectDir}`))) {
  console.log(`Can not find project directory '${projectDir}'`);
  process.exit(-1);
}

const mods = argv.slice(2);
if (mods.length <= 0) {
  console.log(`Please specify a module name to install`);
  process.exit(-2);
} else {
  console.log(`Start to install: ${mods.join(', ')}`.green.bold);
}

const modsRepos = mods.map(function (mod) {
  return `${groupUrl}/${mod}.git`;
});

const ccModulesDir = `${projectDir}/assets/scripts/cc_modules/`;
const nodeModulesDir = `${projectDir}/assets/scripts/node_modules/`;
shell.exec(`npm i --verbose --save --prefix ${projectDir}/assets/scripts/ ${modsRepos.join(' ')}`)
shell.mkdir('-p', ccModulesDir);
shell.mv(`${nodeModulesDir}*`, ccModulesDir)
shell.rm('-rf', nodeModulesDir)
