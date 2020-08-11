cc.Class({
    extends: cc.Component,

    properties: {
        nd_btnStartGame: cc.Node,
        lab_btnStartGame: cc.Label,
        eb_width: cc.EditBox,
        eb_height: cc.EditBox,
    },

    onLoad() {
        this.setWidth(10)
        this.setHeight(12)
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

    setWidth(width) {
        this.eb_width.string = width.toString()
    },

    getWidth() {
        return Number(this.eb_width.string)
    },

    setHeight(height) {
        this.eb_height.string = height.toString()
    },

    getHeight() {
        return Number(this.eb_height.string)
    },
});
