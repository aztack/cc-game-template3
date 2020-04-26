module.exports = {
  types: [{
    value: 'init',
    name: 'init:     Init project(初始化工程)'
  },{
    value: 'feat',
    name: 'feat:     A new feature(新的特性)'
  },{
    value: 'assets',
    name: 'assets:     Add assets(添加资源)'
  },{
    value: 'fix',
    name: 'fix:      A bug fix(修复Bug)'
  },{
    value: 'docs',
    name: 'docs:     Documentation only changes(修改文档)'
  },{
    value: 'style',
    name: 'style:    Changes that do not affect the meaning of the code(空格, 分号等代码规范修正)\n            (white-space, formatting, missing semi-colons, etc)'
  },{
    value: 'refactor',
    name: 'refactor: A code change that neither fixes a bug nor adds a feature(代码重构，既不包括新增特性也不是bug修复)'
  },{
    value: 'perf',
    name: 'perf:     A code change that improves performance(性能优化)'
  },{
    value: 'chore',
    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation(构建、脚手架工具等)'
  },{
    value: 'revert',
    name: 'revert:   Revert to a commit(回退到另一个commit)'
  },{
    value: 'WIP',
    name: 'WIP:      Work in progress(临时保存)'
  }],

  // 项目模块分类
  scopes: ['textures', 'audios', 'skeletons', 'animations', 'scenes', 'scripts', 'Main'],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',
  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing(选择一种你的提交类型):",
    scope: '\nDenote the SCOPE of this change (optional)(选择一个scope (可选)):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change(自定义本次提交修改的模块):',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change(短说明):\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line(长说明，使用"|"换行(可选)):\n',
    breaking: 'List any BREAKING CHANGES (optional)(非兼容性说明 (可选)):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34(关联关闭的issue，例如：#31, #34(可选)):\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?(确定提交说明?)'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  // skipQuestions: ['body'],

  // limit subject length
  subjectLimit: 100
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
}
