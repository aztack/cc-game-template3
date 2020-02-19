require('colors');
const path = require('path')
const projectDir = require('../package.json').name;
const shell = require('shelljs');
const srcDir = path.resolve(__dirname, '../src');
const newDir = path.resolve(__dirname, `../${projectDir}`);
console.log(`rename source code folder to ${newDir}`.green.bold);
shell.mv(srcDir, newDir);
console.log(`creating cc_modules folder`);
shell.mkdir('-p', `${newDir}/assets/scripts/cc_modules`.green.bold);