require('colors')
const shell = require('shelljs');
const projectDir = require('../package.json').name;

const platform = process.platform;
if (['win32', 'darwin'].indexOf(platform) < 0) {
  console.log(`Do not support platform ${platform}`);
} else {
  const ccbin = process.env.CCBIN;
  if (!ccbin) {
    console.log(`Please set enviroment variable CCBIN which points to the executable of Cocos Creator!`.red.bold);
    console.log(`for example:`)
    console.log(`  Mac: export CCBIN=/Applications/CocosCreator.app/Contents/MacOS/CocosCreator`);
    console.log(`  Win: set CCBIN=c:\\CocosCreator\\CocosCreator.exe`);
    process.exit(0);
  }
  const cmd =`${process.env.CCBIN} --path ${projectDir}`;
  console.log(cmd.green.bold);
  shell.exec(cmd);
}
