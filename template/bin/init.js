require('colors');
const path = require('path')
const projectDir = require('../package.json').name;
const shell = require('shelljs');
const srcDir = path.resolve(__dirname, '../src');
const newDir = path.resolve(__dirname, `../${projectDir}`);
console.log(`rename source code folder to ${newDir}`.green.bold);
shell.mv(srcDir, newDir);
['scripts', 'animations', 'audios', 'scenes', 'skeletons'].forEach(function(dir){
  console.log(`creating ${dir} folder`);
  shell.mkdir('-p', `${newDir}/assets/${dir}`);
});
console.log(`creating zips folder`);
shell.mkdir('-p', './zips');