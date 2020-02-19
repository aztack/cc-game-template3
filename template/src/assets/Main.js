cc.Class({
  extends: cc.Component,
  properties: {
    sceneScript: true
  },

  // use this for initialization
  onLoad: function () {
    this.label.string = this.text;
  },

  start() {
  },

  // called every frame
  update: function (dt) {

  }
});