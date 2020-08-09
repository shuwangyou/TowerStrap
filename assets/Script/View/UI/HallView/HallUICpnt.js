cc.Class({
    extends: cc.Component,

    properties: {
        nd_btnStartGame: cc.Node,
        lab_btnStartGame: cc.Label,
    },

    onLoad() {

    },

    start() {

    },

    update(dt) {

    },

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    init(data) {
        // cc.log(cc.js.getClassName(this) + ` init data = `, data)

        data = data || {}
        this.lab_btnStartGame.string = data.labBtnStartGame || ``
    },

    getNdBtnStartGame(call) {
        // cc.log(cc.js.getClassName(this) + ` bindEventStartGame`)

        return this.nd_btnStartGame
    },
});
