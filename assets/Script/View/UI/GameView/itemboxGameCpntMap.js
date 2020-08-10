import Const from 'Const'

cc.Class({
    extends: cc.Component,

    properties: {
        nd_spSearch: cc.Node,
        nd_spWay: cc.Node,
        nd_top: cc.Node,
        nd_bottom: cc.Node,
        nd_left: cc.Node,
        nd_right: cc.Node,
        nd_content: cc.Node,
        lab_lab: cc.Label,
        nd_spEnter: cc.Node,
        nd_spExist: cc.Node,
    },

    onLoad() {

    },

    start() {

    },

    update(dt) {

    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    init(types = [Const.GameView.ItemType.Normal], gridPos) {
        this._gridPos = gridPos
        
        this.nd_top.active = false
        this.nd_bottom.active = false
        this.nd_left.active = false
        this.nd_right.active = false
        this.nd_content.removeAllChildren()
        this.nd_spEnter.active = false
        this.nd_spExist.active = false
        this._types = types
        this._isBuildType = false
        this._graidPosInRangeMap = new Map()
        this._enemiesMap = new Map()
        this._types.forEach(type => {
            switch (type) {
                case Const.GameView.ItemType.Top:
                    this.nd_top.active = true
                    break
                case Const.GameView.ItemType.Bottom:
                    this.nd_bottom.active = true
                    break
                case Const.GameView.ItemType.Left:
                    this.nd_left.active = true
                    break
                case Const.GameView.ItemType.Right:
                    this.nd_right.active = true
                    break
                case Const.GameView.ItemType.Enter:
                    this.nd_spEnter.active = true
                    break
                case Const.GameView.ItemType.Exist:
                    this.nd_spExist.active = true
                    break
                case Const.GameView.ItemType.Build:
                    this._isBuildType = true
                    break

                default:
                    break
            }
        })

        this.lab_lab.string = `${gridPos.x.toString()},${gridPos.y.toString()}`
    },

    getGridPos() {
        return this._gridPos
    },

    isBuildType() {
        return this._isBuildType
    },

    addTowerGridPosInRange(gridPos) {
        this._graidPosInRangeMap.set(gridPos.x, this._graidPosInRangeMap.get(gridPos.x) || new Map())
        this._graidPosInRangeMap.get(gridPos.x).set(gridPos.y, gridPos)
    },

    getTowerGridPosInRange() {
        return this._graidPosInRangeMap
    },

    removeTowerGridPosInRange(gridPos) {
        cc.log(cc.js.getClassName(this) + ` removeTowerGridPosInRange gridPos = `, gridPos)
        
        this._graidPosInRangeMap.get(gridPos.x).delete(gridPos.y)
        if (this._graidPosInRangeMap.get(gridPos.x).size <= 0) {
            this._graidPosInRangeMap.delete(gridPos.x)
        }
    },

    addEnemy(enemy) {
        this._enemiesMap.set(enemy.uuid, enemy)
    },

    removeEnemy(enemy) {
        this._enemiesMap.delete(enemy.uuid)
    },

    getEnemiesMap() {
        return this._enemiesMap
    },
});
