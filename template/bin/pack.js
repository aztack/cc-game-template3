const utils = require('./utils.js');
const shell = require('shelljs');
const date = utils.date();
const zipFileName = `${utils.pkg.name}-${date}.zip`;
const zipFilePath = `./${utils.zipDir}/${zipFileName}`;
const platform = process.argv[2];
utils.mkdir(`./${utils.zipDir}`).zip(`./${utils.projectDir}/build`, zipFilePath, platform).then(function(output){
  const hashOfZip = utils.md5Of(output, 7);
  console.log('hash of zip:', hashOfZip);
  const sh1 = shell.exec('git rev-parse HEAD').toString().slice(0,7)
  console.log('SHA1 of HEAD:', sh1);

  const builderConfig = utils.readLocalBuilderJson();
  let env = 'unset';
  if (builderConfig) {
    env = builderConfig.debug ? 'dev' : 'prod';
  }
  if (env === 'unset') {
    console.error(`Please save building settings in Cocos Creator before packing`);
  }
  const zipFileNameHashedPath = output.replace('.zip', `-${hashOfZip}-${sh1}-${env}.zip`);
  utils.rename(output, zipFileNameHashedPath);
  console.log(`${zipFileNameHashedPath} created`.green.bold);
}).catch(function (e) {
  console.log(`Pack build failed: ${e.toString()}\n${e.stack}`.red.bold);
});