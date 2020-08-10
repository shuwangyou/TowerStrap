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
        this._bulletPool = null
        this.sc_targetEnemy.removeBullet(this.node)
        this._targetEnemy = null
        this.sc_targetEnemy = null
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

    init(bulletPool, targetEnemy, bulletUpdateCall) {
        this._bulletPool = bulletPool
        this._targetEnemy = targetEnemy
        this._bulletUpdateCall = bulletUpdateCall

        this.sc_targetEnemy = targetEnemy.getComponent(targetEnemy.name)
        this.sc_targetEnemy.addBullet(this.node)

        this.reset()
    },

    reset() {
        this.node.stopAllActions()
    },

    putToPool() {
        this._bulletPool.put(this.node)
    },
});
