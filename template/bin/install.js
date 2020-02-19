require('colors');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const pkg = require(path.join(__dirname,'../package.json'));
const projectDir = pkg.name;
const groupUrl = pkg.ccmodules.group.replace(/\/$/, '');

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
