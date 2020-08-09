import Const from 'Const'

cc.Class({
    extends: cc.Component,

    properties: {
        sp_health: cc.Sprite,
        lab_hit: cc.Label,
    },

    onLoad() {
        this.sp_health.fillRange = 1
        this.lab_hit.node.opacity = 0
    },

    start() {

    },

    update(dt) {
        this._enemyCheckGridPosCall && this._enemyCheckGridPosCall(dt, this.node)
    },

    unuse() {
        this._enemyCheckGridPosCall = null
        this.node.stopAllActions()
    },

    reuse() {
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _playHit(damage) {
        this.sp_health.fillRange = this._hp / this._fullHP
        if (this.node.parent) {
            let lab = cc.instantiate(this.lab_hit.node).getComponent(cc.Label)
            this.node.parent.addChild(lab.node)
            lab.node.x = this.node.x
            lab.node.y = this.node.y + this.node.height * 0.5
            lab.node.opacity = 255
            lab.string = `-` + damage.toString()
            let dt = 0.2
            lab.node.runAction(cc.sequence(cc.moveBy(dt, cc.v2(0, 30), 30), cc.callFunc(() => {
                lab.node.active = 0
                lab.node.destroy()
            })))
            lab.node.runAction(cc.fadeOut(dt))
        }
    },

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    init(HP, gridPos, enemyCheckGridPosCall) {
        this._fullHP = this._fullHP || HP
        this._hp = HP
        this.sp_health.fillRange = 1
        this._gridPos = gridPos
        this._enemyCheckGridPosCall = enemyCheckGridPosCall
    },

    setGridPos(gridPos) {
        this._gridPos = gridPos
    },

    getGridPos() {
        return this._gridPos
    },

    onHit(damage) {
        this._hp -= damage
        this._playHit(damage)
        return this._hp
    },

    getHP() {
        return this._hp
    },
});
