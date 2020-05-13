const utils = require('./utils.js')
// http://docs.cocos.com/creator/manual/zh/publish/publish-in-command-line.html
utils.cocos(`--path ${utils.projectDir} --build`, true);
