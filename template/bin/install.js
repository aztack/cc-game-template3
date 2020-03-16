require('colors');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const utils = require('./utils.js');
const pkg = utils.pkg;
const projectDir = pkg.name;
const groupUrl = pkg.ccmodules.group.replace(/\/$/, '');
const typeToDir = pkg.ccmodules.dirs || {};

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

const modGroup = {};
mods.forEach(function (mod) {
  const type = mod.split('-')[0];
  const group = modGroup[type];
  if (!group) {
    group = modGroup[type] = [];
  }
  group.push(mod);
});

for (let type in modGroup) {
  const group = modGroup[type];
  if (!group || !group.length) continue;
  const modsRepos = group.map(function (mod) {
    return `${groupUrl}/${mod}.git`;
  });
  const dir = typeToDir[type];
  const ccModulesDir = `${projectDir}/${dir}/cc_modules/`;
  const nodeModulesDir = `${projectDir}/${dir}/node_modules/`;
  console.log(`Installing ${dir.replace('assets/', '')}...`.green.bold);
  utils.npm(`i --verbose --save --prefix ${projectDir}/${dir}/ ${modsRepos.join(' ')}`);
  shell.mkdir('-p', ccModulesDir);
  shell.mv(`${nodeModulesDir}*`, ccModulesDir);
  shell.rm('-rf', nodeModulesDir);
}
console.log(`Done!`);
