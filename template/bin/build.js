require('./utils.js').utils.cocos(`--path ${utils.projectDir} --build ${[
  'debug=false',
  'platform=web-mobile',
  'inlineSpriteFrames=true',
  'md5Cache=true',
  'mergeStartScene=true'
].join(';')}`, true);
