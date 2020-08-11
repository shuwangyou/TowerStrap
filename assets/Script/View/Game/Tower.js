import Const from 'Const'
import * as JKUtils from 'JKUtils'

let SelectTime = 0.15

cc.Class({
    extends: cc.Component,

    properties: {
        nd_spTower: cc.Node,
        nd_selected: cc.Node,
        nd_spRange: cc.Node,
        nd_spGun: cc.Node,
        prfb_bullet: cc.Prefab,
    },

    onLoad() {
        this.sp_gun = this.nd_spGun.getComponent(cc.Sprite)
    },

    start() {

    },

    update(dt) {
        if (this._targetEnemy && this._targetEnemy.isValid && this._targetEnemy.parent) {
            let posOffset = JKUtils.analyzePosOffset(this.node.position, this._targetEnemy.position)
            this.node.angle = -posOffset.degree
        }
    },

    unuse() {
        this._mapItem = null
        this._gridPos = null
        this._bulletPool = null
        this._bulletUpdateCall = null
        this.reset()
    },

    reuse() {
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _switchStatus(status) {
        switch (status) {
            case Const.Game.Tower.Status.Waiting:
                this._status = Const.Game.Tower.Status.Waiting
                this._stopAttack()
                break
            case Const.Game.Tower.Status.Building:
                this._status = Const.Game.Tower.Status.Building
                this._runSelected(false, () => {
                    this.nd_spTower.active = true
                    if (this._enemiesMap.size > 0) {
                        this._switchStatus(Const.Game.Tower.Status.Attacking)
                    } else {
                        this._switchStatus(Const.Game.Tower.Status.Waiting)
                    }
                })
                break
            case Const.Game.Tower.Status.Attacking:
                this._startAttack()
                this._status = Const.Game.Tower.Status.Attacking
                break

            default:
                cc.error(cc.js.getClassName(this) + ` The status "${tatus}" is unknown!`)
                break
        }
    },

    _runSelected(select, call) {
        if (select) {
            this.nd_selected.runAction(cc.sequence(cc.scaleTo(SelectTime, 1), cc.callFunc(() => {
                this.nd_selected.scale = 1
                call && call()
            })))
        } else {
            this.nd_selected.runAction(cc.sequence(cc.scaleTo(SelectTime, 0), cc.callFunc(() => {
                this.nd_selected.scale = 0
                this.nd_selected.active = false
                call && call()
            })))
        }
    },

    _startAttack() {
        this._targetEnemy = this._enemiesMap.values().next().value
        if (this._targetEnemy && this._targetEnemy.isValid && this._targetEnemy.parent) {
            if (this._enemiesMap.size > 0 && !this._firing) {
                this._firing = true
                this.schedule(this._fireOneBullet, Const.Game.Tower.FireSpeed.Normal, cc.macro.REPEAT_FOREVER)
                this._fireOneBullet()
            }
        }
    },

    _fireOneBullet() {
        if (this._targetEnemy && this._targetEnemy.isValid && this._targetEnemy.parent) {
            let bullet = this._bulletPool.get() || cc.instantiate(this.prfb_bullet),
                sc_bullet = bullet.getComponent(bullet.name)
            sc_bullet.init(this._bulletPool, this._targetEnemy, (dt, bullet, targetEnemy) => {
                this._bulletUpdateCall && this._bulletUpdateCall(dt, bullet, targetEnemy)
            })
            this.node.parent.addChild(bullet)
            bullet.x = this.node.x
            bullet.y = this.node.y
        }
    },

    _stopAttack() {
        this._firing = false
        this.unscheduleAllCallbacks()
    },

    //====================================================================
    //=============================外部方法===============================
    //====================================================================\

    init(gridPos, mapItem, bulletPool, bulletUpdateCall) {
        this._mapItem = mapItem
        this._gridPos = gridPos
        this._bulletPool = bulletPool
        this._bulletUpdateCall = bulletUpdateCall

        this.reset()
    },

    reset() {
        this.nd_spTower.active = false
        this.nd_selected.active = false
        this._mapItem && (this.nd_spRange.width = this.nd_spRange.height = this._mapItem.width)
        this.nd_selected.scale = 0
        this.nd_selected.stopAllActions()
        this._switchStatus(Const.Game.Tower.Status.Waiting)
        this._enemiesMap = new Map()
        this._targetEnemy = null
        this.node.angle = 0
        this.node.stopAllActions()
    },

    getGridPos() {
        return this._gridPos
    },

    hasTower() {
        return this.nd_spTower.active
    },

    preBuildTower(select, range) {
        if (select) {
            this.nd_selected.active = true
            this.nd_selected.scale = 0
            this.nd_spRange.width = this.nd_spRange.height = this._mapItem.width * (range * 2 + 1)
            this._runSelected(true)
        } else {
            this._runSelected(false)
        }
    },

    buildTower() {
        this._switchStatus(Const.Game.Tower.Status.Building)
    },

    addEnemy(enemy) {
        this._enemiesMap.set(enemy.uuid, enemy)
        this._status !== Const.Game.Tower.Status.Building && this._switchStatus(Const.Game.Tower.Status.Attacking)
    },

    removeEnemy(enemy) {
        if (enemy) {
            this._targetEnemy === enemy && (this._targetEnemy = null)
            this._enemiesMap.delete(enemy.uuid)
            if (this._status !== Const.Game.Tower.Status.Building) {
                if (this._enemiesMap.size > 0) {
                    this._switchStatus(Const.Game.Tower.Status.Attacking)
                } else {
                    this._switchStatus(Const.Game.Tower.Status.Waiting)
                }
            }
        }
    },
});
