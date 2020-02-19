require('colors');
const path = require('path')
const projectDir = require('../package.json').name;
const shell = require('shelljs');
const srcDir = path.resolve(__dirname, '../src');
const newDir = path.resolve(__dirname, `../${projectDir}`);
console.log(`rename source code folder to ${newDir}`.green.bold);
shell.mv(srcDir, newDir);
['scripts/cc_modules', 'animations', 'audios', 'scenes'].forEach(function(dir){
  console.log(`creating ${dir} folder`);
  shell.mkdir('-p', `${newDir}/assets/${dir}`);
});