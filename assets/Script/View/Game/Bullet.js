import Const from 'Const'

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
    },

    start() {
    },

    update(dt) {
        this._bulletUpdateCall && this._bulletUpdateCall(dt, this.node, this._targetEnemy)
    },

    unuse() {
        this._targetEnemy = null
        this._bulletUpdateCall = null
        this.reset()
    },

    reuse() {
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    init(targetEnemy, bulletUpdateCall) {
        this._targetEnemy = targetEnemy
        this._bulletUpdateCall = bulletUpdateCall
    },

    reset() {
        this.node.stopAllActions()
    },
});
