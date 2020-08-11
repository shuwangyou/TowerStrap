import Const from 'Const'

cc.Class({
    extends: cc.Component,

    properties: {
        sp_health: cc.Sprite,
        lab_score: cc.Label,
    },

    onLoad() {
        this.sp_health.fillRange = 1
        this.lab_score.node.opacity = 0
    },

    start() {

    },

    update(dt) {
        this._enemyCheckGridPosCall && this._enemyCheckGridPosCall(dt, this.node)
    },

    unuse() {
        this._enemyCheckGridPosCall = null
        this._bulletsMap.forEach((bullet, uuid) => {
            let sc_bullet = bullet.getComponent(bullet.name)
            sc_bullet.putToPool()
        })
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

    init(HP, gridPos, enemyCheckGridPosCall) {
        this._hp = HP
        this._gridPos = gridPos
        this._enemyCheckGridPosCall = enemyCheckGridPosCall

        this._fullHP = this._hp
        
        this.reset()
    },

    reset() {
        this.sp_health.fillRange = 1
        this._bulletsMap = new Map()
        this.node.stopAllActions()
    },

    setGridPos(gridPos) {
        this._gridPos = gridPos
    },

    getGridPos() {
        return this._gridPos
    },

    onHit(damage) {
        this._hp -= damage
        this.sp_health.fillRange = this._hp / this._fullHP

        return this._hp
    },

    playScore(score) {
        if (this.node.parent) {
            let lab = cc.instantiate(this.lab_score.node).getComponent(cc.Label)
            this.node.parent.addChild(lab.node)
            lab.node.x = this.node.x
            lab.node.y = this.node.y + this.node.height * 0.5
            lab.node.opacity = 255
            lab.string = `+` + score.toString()
            let dt = 0.2
            lab.node.runAction(cc.sequence(cc.moveBy(dt, cc.v2(0, 30), 30), cc.callFunc(() => {
                lab.node.active = 0
                lab.node.destroy()
            })))
            lab.node.runAction(cc.fadeOut(dt))
        }
    },

    getHP() {
        return this._hp
    },

    addBullet(bullet) {
        this._bulletsMap.set(bullet.uuid, bullet)
    },

    removeBullet(bullet) {
        this._bulletsMap.delete(bullet.uuid)
    },
});
