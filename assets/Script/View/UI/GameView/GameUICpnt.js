cc.Class({
    extends: cc.Component,

    properties: {
        nd_btnClose: cc.Node,
        lab_btnClose: cc.Label,
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
        this.lab_btnClose.string = data.labBtnClose || ``
    },

    getNdBtnClose(call) {
        // cc.log(cc.js.getClassName(this) + ` bindEventClose`)

        return this.nd_btnClose
    },
});
