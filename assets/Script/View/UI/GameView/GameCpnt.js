import Const from 'Const'
import * as JKUtils from 'JKUtils'
import JKAStart from 'JKAStart'

cc.Class({
    extends: cc.Component,

    properties: {
        nd_mapCtn: cc.Node,
        prfb_itemMap: cc.Prefab,
        nd_unitCtn: cc.Node,
        prfb_enemy: cc.Prefab,
        prfb_tower: cc.Prefab,
        lab_cdTime: cc.Label,
        lab_score: cc.Label,
        lab_playerHP: cc.Label,
    },

    onLoad() {
        this.lyot_mapCtn = this.nd_mapCtn.getComponent(cc.Layout)
        this._towerPool = new cc.NodePool(`Tower`)
        this._bulletPool = new cc.NodePool(`Bullet`)
        this._enemyPool = new cc.NodePool(`Enemy`)
    },

    start() {

    },

    update(dt) {
        if (this._cdTime > 0) {
            this._cdTime -= dt
            this.lab_cdTime.node.active = true
            this.lab_cdTime.string = Math.ceil(this._cdTime).toString()
            if (this._cdTime <= 0) {
                this._cdTime = 0
                this.lab_cdTime.node.active = false
                this._onCountdownCall()
            }
        }
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _initGrid() {
        cc.log(cc.js.getClassName(this) + ` _initGrid`)

        this._itemWidth = this._itemHeight = Math.floor(this.node.width / this._widthItemNum)
        this._itemSumNum = this._widthItemNum * this._heightItemNum
        this._mapItemsMap = new Map()
        this._aStart = new JKAStart(this._widthItemNum, this._heightItemNum, this._mapItemsMap)
        this._disabledItemGridPoss = []
        this._enterItemGridPoss = []
        this._existItemGridPoss = []
        this._normalItemGridPoss = []
        this._buildItemGridPoss = []
        this._topItemGridPoss = []
        this._bottomItemGridPoss = []
        this._leftItemGridPoss = []
        this._rightItemGridPoss = []
        for (let index = 0; index < this._itemSumNum; index++) {
            let x = index % this._widthItemNum,
                y = Math.floor(index / this._widthItemNum),
                gridPos = cc.js.createMap(),
                disabled = false,
                tempHeightNum = (this._heightItemNum - 4) / 3 + 2,
                types = [],
                top = false,
                bottom = false,
                left = false,
                right = false
            gridPos.x = x
            gridPos.y = y
            let item = this.nd_mapCtn.children[index]
            if (!item || !item.isValid) {
                item = cc.instantiate(this.prfb_itemMap)
                this.nd_mapCtn.addChild(item)
            }
            item.width = this._itemWidth
            item.height = this._itemHeight
            this._mapItemsMap.set(x, this._mapItemsMap.get(x) || new Map())
            this._mapItemsMap.get(x).set(y, item)
            this._aStart.initSCItem(item, gridPos)
            let addDisabled = () => {
                disabled = true
                types.push(Const.GameView.ItemType.Disabled)
                this._disabledItemGridPoss.push(gridPos)
                this._aStart.setMoveAbled(item, false)
            },
            addTop = () => {
                top = true
                types.push(Const.GameView.ItemType.Top)
                this._topItemGridPoss.push(gridPos)
            },
            addBottom = () => {
                bottom = true
                types.push(Const.GameView.ItemType.Bottom)
                this._bottomItemGridPoss.push(gridPos)
            },
            addLeft = () => {
                left = true
                types.push(Const.GameView.ItemType.Left)
                this._leftItemGridPoss.push(gridPos)
            },
            addRight = () => {
                right = true
                types.push(Const.GameView.ItemType.Right)
                this._rightItemGridPoss.push(gridPos)
            }
            if (y === 0 || y === 1 || y === this._heightItemNum - 2 || y === this._heightItemNum - 1) {
                addDisabled()
            }
            if (x === 0 || x === 1 || x === this._widthItemNum - 2 || x === this._widthItemNum - 1) {
                if (!disabled) {
                    if (y < tempHeightNum || y >= this._heightItemNum - tempHeightNum) {
                        addDisabled()
                    }
                }
            }
            if (!disabled) {
                if ((y === 2 && (x >= 2 && x < this._widthItemNum - 2)) || (y === tempHeightNum && (x < 2 || x >= this._widthItemNum - 2))) {
                    addTop()
                }
                if ((y === this._heightItemNum - tempHeightNum - 1 && (x < 2 || x >= this._widthItemNum - 2)) || (y === this._heightItemNum - 3 && (x >= 2 && x < this._widthItemNum - 2))) {
                    addBottom()
                }
                if (x === 2 && (y < tempHeightNum || y >= this._heightItemNum - tempHeightNum)) {
                    addLeft()
                }
                if (x === this._widthItemNum - 3 && (y < tempHeightNum || y >= this._heightItemNum - tempHeightNum)) {
                    addRight()
                }
                types.push(Const.GameView.ItemType.Normal)
                this._normalItemGridPoss.push(gridPos)
                if (x === 0) {
                    types.push(Const.GameView.ItemType.Enter)
                    this._enterItemGridPoss.push(gridPos)
                }
                if (x === this._widthItemNum - 1) {
                    types.push(Const.GameView.ItemType.Exist)
                    this._existItemGridPoss.push(gridPos)
                }
                if (x >= 2 && x < this._widthItemNum - 2 && y >= 2 && y < this._heightItemNum - 2) {
                    types.push(Const.GameView.ItemType.Build)
                    this._buildItemGridPoss.push(gridPos)
                }
            }
            let sc_item = item.getComponent(item.name)
            sc_item.init(types, gridPos)
            item.targetOff()
            item.on(cc.Node.EventType.TOUCH_END, (event) => {
                this._onClickMapItem(gridPos, item)
            }, this)
        }
        if (this.nd_mapCtn.children.length > this._itemSumNum) {
            for (let index = this._itemSumNum; index < this.nd_mapCtn.children.length; index++) {
                let item = this.nd_mapCtn.children[index]
                item && item.isValid && item.destroy()
            }
        }
        this.lyot_mapCtn.updateLayout()

        this._towerItemsMap = new Map()

        this._initEnemyWays()
    },

    _initEnemyWays() {
        let enemyWaysMap = new Map(),
            startItem,
            endItem
        this._enterItemGridPoss.forEach(enterGridPos => {
            this._existItemGridPoss.forEach(existGridPos => {
                startItem = this._mapItemsMap.get(enterGridPos.x).get(enterGridPos.y)
                endItem = this._mapItemsMap.get(existGridPos.x).get(existGridPos.y)
                this._aStart.searchWay(startItem, endItem, (steps) => {
                    enemyWaysMap.set(startItem, enemyWaysMap.get(startItem) || new Map())
                    enemyWaysMap.get(startItem).set(endItem, steps)
                })
            })
        })
        // startItem = this._mapItemsMap.get(this._enterItemGridPoss[0].x).get(this._enterItemGridPoss[0].y)
        // endItem = this._mapItemsMap.get(this._existItemGridPoss[0].x).get(this._existItemGridPoss[0].y)
        // this._aStart.searchWay(startItem, endItem, (steps) => {
        //     enemyWaysMap.set(startItem, enemyWaysMap.get(startItem) || new Map())
        //     enemyWaysMap.get(startItem).set(endItem, steps)
        // })
        if (enemyWaysMap.get(startItem).get(endItem)) {
            this._enemyWaysMap = enemyWaysMap
            return true
        } else {
            return false
        }
    },

    _updateCurEnemyWays() {
        this._curEnemies && this._curEnemies.forEach(enemy => {
            if (enemy && enemy.isValid && enemy.parent) {
                let sc_enemy = enemy.getComponent(enemy.name),
                    gridPos = sc_enemy.getGridPos()
                    startItem = this._mapItemsMap.get(gridPos.x).get(gridPos.y),
                    endItem = sc_enemy.endItem
                this._aStart.searchWay(startItem, endItem, (steps) => {
                    this._enemyRun(enemy, steps, 1)
                })
            }
        })
    },

    _onCountdownCall() {
        this._rushEnemy()
    },

    _rushEnemy() {
        this._rushCnt = this._rushCnt || 0
        this._rushDTime = this._rushDTime || Const.Game.Enemy.RushDTime
        this._rushDTime -= Const.Game.Enemy.RushDTime * 0.001
        this._rushDTime = this._rushDTime >= 0.05 ? this._rushDTime : 0.05
        this.scheduleOnce(() => {
            this._initOneEnemy(this._rushCnt++)
            this._rushEnemy()
        }, this._rushDTime)
    },

    _initOneEnemy(index) {
        let enemy = this._enemyPool.get() || cc.instantiate(this.prfb_enemy),
            enterItemGridPos = this._enterItemGridPoss[Math.floor(Math.random() * this._enterItemGridPoss.length)],
            startItem = this._mapItemsMap.get(enterItemGridPos.x).get(enterItemGridPos.y),
            existItemGridPos = this._existItemGridPoss[Math.floor(Math.random() * this._enterItemGridPoss.length)],
            endItem = this._mapItemsMap.get(existItemGridPos.x).get(existItemGridPos.y),
            startPos = startItem.position,
            endPos = endItem.position,
            startGridPos = startItem.getComponent(startItem.name).getGridPos(),
            ways = this._enemyWaysMap.get(startItem).get(endItem),
            wayIndex = 1
        this.nd_unitCtn.addChild(enemy)
        enemy.x = startPos.x
        enemy.y = startPos.y
        enemy.width = startItem.width * 0.75
        enemy.height = startItem.height * 0.75
        let sc_enemy = enemy.getComponent(enemy.name)
        sc_enemy.init(Const.Game.Enemy.HP + this._rushCnt * 0.01, startGridPos, (dt, enemy) => {
            this._enemyUpdateCall(dt, enemy)
        })
        sc_enemy.startItem = startItem
        sc_enemy.endItem = endItem
        cc.JK.JKTaskQueueTool.addCMD({
            cmd: Const.Game.Enemy.CMD.PushOneEnemy,
            params: {},
            call: (cmd, params) => {
                // cc.log(cc.js.getClassName(this) + ` CMD.PushOneEnemy params = `, params)

                this._enemyRun(enemy, ways, wayIndex)

                cc.JK.JKTaskQueueTool.doneCMD(cmd)
            },
        })

        this._curEnemies = this._curEnemies || new Map()
        this._curEnemies.set(enemy.uuid, enemy)
    },

    _enemyRun(enemy, ways, wayIndex) {
        if (ways) {
            enemy.stopAllActions()
            let targetItem = ways[wayIndex++]
            if (targetItem) {
                let time = enemy.position.sub(targetItem.position).mag() / Const.Game.Enemy.MoveSpeed
                enemy.runAction(cc.sequence(cc.moveTo(time, targetItem.position), cc.callFunc(() => {
                    enemy.x = targetItem.position.x
                    enemy.y = targetItem.position.y
                    this._enemyRun(enemy, ways, wayIndex)
                })))
            } else {
                this._enemyPool.put(enemy)
                this._setPlayerHP(this._getPlayerHP() - 1)
                this._curEnemies.delete(enemy.uuid)
            }
        }
    },

    _enemyUpdateCall(dt, enemy) {
        if (enemy && enemy.isValid && enemy.parent) {
            let sc_enemy = enemy.getComponent(enemy.name),
                gridPos = this._pos2GridPos(enemy.position),
                lastGridPos = sc_enemy.getGridPos()
            if (gridPos.x !== lastGridPos.x || gridPos.y !== lastGridPos.y) {
                let mapItem = this._mapItemsMap.get(gridPos.x).get(gridPos.y),
                    lastMapItem = this._mapItemsMap.get(lastGridPos.x).get(lastGridPos.y),
                    sc_mapItem = mapItem.getComponent(mapItem.name),
                    sc_lastMapItem = lastMapItem.getComponent(lastMapItem.name),
                    towerGridPosInRange = sc_mapItem.getTowerGridPosInRange(),
                    lastTowerGridPosInRange = sc_lastMapItem.getTowerGridPosInRange(),
                    addTowersMap = new Map()
                sc_mapItem.addEnemy(enemy)
                if (towerGridPosInRange.size > 0) {
                    towerGridPosInRange.forEach((value, x) => {
                        value.forEach((towerPos, y) => {
                            let tower = this._towerItemsMap.get(x).get(y)
                            if (tower && tower.isValid && tower.parent) {
                                addTowersMap.set(tower.uuid, tower)
                            }
                        })
                    })
                }
                sc_lastMapItem.removeEnemy(enemy)
                if (lastTowerGridPosInRange.size > 0) {
                    lastTowerGridPosInRange.forEach((value, x) => {
                        value.forEach((towerPos, y) => {
                            let tower = this._towerItemsMap.get(x).get(y)
                            if (tower && tower.isValid && tower.parent) {
                                if (!addTowersMap.get(tower.uuid)) {
                                    let sc_tower = tower.getComponent(tower.name)
                                    sc_tower.removeEnemy(enemy)
                                }
                            }
                        })
                    })
                }
                addTowersMap.forEach((tower, uuid) => {
                    if (tower && tower.isValid && tower.parent) {
                        let sc_tower = tower.getComponent(tower.name)
                        sc_tower.addEnemy(enemy)
                    }
                })
                sc_enemy.setGridPos(gridPos)
            }
        }
    },

    _pos2GridPos(pos) {
        let gridPos = cc.js.createMap(),
            x = pos.x - (-this.nd_mapCtn.width * 0.5),
            y = -(pos.y - (this.nd_mapCtn.height * 0.5))
        gridPos.x = Math.floor(x / this._itemWidth)
        gridPos.y = Math.floor(y / this._itemWidth)

        return gridPos
    },

    _onClickMapItem(gridPos, mapItem) {
        cc.log(cc.js.getClassName(this) + ` _onClickMapItem gridPos = `, gridPos)

        if (mapItem && mapItem.isValid) {
            let sc_item = mapItem.getComponent(mapItem.name)
            if (!this._curSelectedMapItemSC || this._curSelectedMapItemSC !== sc_item) {
                this._curSelectedMapItemSC && this._onItemSelected(false, this._curSelectedMapItemSC.getGridPos(), this._curSelectedMapItemSC.node)
                this._curSelectedMapItemSC = sc_item
                this._onItemSelected(true, gridPos, mapItem, true, Const.Game.Tower.Range.Normal)
            } else {
                this._onItemSelected(true, gridPos, mapItem, false, Const.Game.Tower.Range.Normal)
                this._curSelectedMapItemSC = null
            }
        }
    },

    _onItemSelected(select, gridPos, mapItem, firstClick, range) {
        cc.log(cc.js.getClassName(this) + ` _onItemSelected gridPos = `, gridPos)

        let tower = this._towerItemsMap.get(gridPos.x) && this._towerItemsMap.get(gridPos.x).get(gridPos.y),
            sc_tower,
            sc_mapItem = mapItem.getComponent(mapItem.name)
        if (sc_mapItem.isBuildType()) {
            if (select) {
                if (!tower || !tower.isValid) {
                    tower = this._towerPool.get() || cc.instantiate(this.prfb_tower)
                    this.nd_unitCtn.addChild(tower)
                    tower.x = mapItem.x
                    tower.y = mapItem.y
                    tower.width = mapItem.width
                    tower.height = mapItem.height
                    sc_tower = tower.getComponent(tower.name)
                    sc_tower.init(gridPos, mapItem, this._bulletPool, (dt, bullet, targetEnemy) => {
                        this._bulletUpdateCall(dt, bullet, targetEnemy)
                    })
                    this._towerItemsMap.set(gridPos.x, this._towerItemsMap.get(gridPos.x) || new Map())
                    this._towerItemsMap.get(gridPos.x).set(gridPos.y, tower)
                } else {
                    sc_tower = tower.getComponent(tower.name)
                }
                if (firstClick) {
                    if (sc_tower.hasTower()) {
                        // 单击炮塔
                        sc_tower.preBuildTower(true, range)
                    } else {
                        // 单击空地
                        sc_tower.preBuildTower(true, range)
                    }
                } else {
                    if (sc_tower.hasTower()) {
                        // 双击炮塔
                        this._removeTowersInRange(sc_tower, range)
                        this._setScore(this._getScore() + Const.Game.Tower.Expenditure)
                        this._towerPool.put(sc_tower.node)
                        this._towerItemsMap.get(gridPos.x).delete(gridPos.y)
                        this._towerItemsMap.get(gridPos.x).size === 0 && this._towerItemsMap.delete(gridPos.x)
                        this._aStart.setMoveAbled(mapItem, true)
                        this._initEnemyWays()
                    } else {
                        // 双击空地
                        this._aStart.setMoveAbled(mapItem, false)
                        if (this._getScore() >= Const.Game.Tower.Expenditure && this._initEnemyWays()) {
                            tower.width = mapItem.width
                            tower.height = mapItem.height
                            sc_tower.buildTower()
                            this._setTowersInRange(sc_tower, range)
                            this._setScore(this._getScore() - Const.Game.Tower.Expenditure)
                            this._updateCurEnemyWays()
                        } else {
                            this._aStart.setMoveAbled(mapItem, true)
                            sc_tower.preBuildTower(false)
                            this._towerPool.put(tower)
                            this._towerItemsMap.get(gridPos.x).delete(gridPos.y)
                            this._towerItemsMap.get(gridPos.x).size === 0 && this._towerItemsMap.delete(gridPos.x)
                        }
                    }
                }
            } else {
                sc_tower = tower.getComponent(tower.name)
                sc_tower.preBuildTower(false)
                this._towerPool.put(tower)
                this._towerItemsMap.get(gridPos.x).delete(gridPos.y)
                this._towerItemsMap.get(gridPos.x).size === 0 && this._towerItemsMap.delete(gridPos.x)
            }
        }
    },

    _bulletUpdateCall(dt, bullet, targetEnemy) {
        if (targetEnemy && targetEnemy.isValid && targetEnemy.parent) {
            let sc_targetEnemy = targetEnemy.getComponent(targetEnemy.name)
            if (sc_targetEnemy.getHP() > 0) {
                let targetPos = targetEnemy.position,
                    pos = bullet.position,
                    posOffset = JKUtils.analyzePosOffset(pos, targetPos)
                if (posOffset.distance > targetEnemy.width * 0.5 + bullet.width * 0.5) {
                    bullet.x = pos.x + Const.Game.Tower.BulletSpeed * dt * posOffset.vector.x / posOffset.distance
                    bullet.y = pos.y + Const.Game.Tower.BulletSpeed * dt * posOffset.vector.y / posOffset.distance
                    bullet.angle = -posOffset.degree
                } else {
                    // 击中
                    if (sc_targetEnemy.onHit(Const.Game.Tower.BulletDamage) <= 0) {
                        let targetGridPos = sc_targetEnemy.getGridPos()
                            targetMapItem = this._mapItemsMap.get(targetGridPos.x).get(targetGridPos.y),
                            sc_targetMapItem = targetMapItem.getComponent(targetMapItem.name),
                            sc_targetMapItem.removeEnemy(targetEnemy)
                            targetTowers = sc_targetMapItem.getTowerGridPosInRange()
                            targetTowers.forEach((value, x) => {
                                value.forEach((towerPos, y) => {
                                    let targetTower = this._towerItemsMap.get(x).get(y)
                                    if (targetTower && targetTower.isValid && targetTower.parent) {
                                        let sc_targetTower = targetTower.getComponent(targetTower.name)
                                        sc_targetTower.removeEnemy(targetEnemy)
                                    }
                                })
                            })
                        this._enemyPool.put(targetEnemy)
                        this._curEnemies.delete(targetEnemy.uuid)
                        this._setScore(this._getScore() + Const.Game.Enemy.Score)
                    }
                    this._bulletPool.put(bullet)
                }
            } else {
                this._bulletPool.put(bullet)
            }
        } else {
            this._bulletPool.put(bullet)
        }
    },

    _setTowersInRange(sc_tower, range) {
        let gridPos = sc_tower.getGridPos()
        for (let x = gridPos.x - range; x <= gridPos.x + range; x++) {
            for (let y = gridPos.y - range; y <= gridPos.y + range; y++) {
                if (x >= 0 && x < this._widthItemNum && y >= 0 && y < this._heightItemNum) {
                    let tempGraidPos = cc.js.createMap()
                    tempGraidPos.x = x
                    tempGraidPos.y = y
                    let tempMapItem = this._mapItemsMap.get(tempGraidPos.x).get(tempGraidPos.y),
                        sc_tempMapItem = tempMapItem.getComponent(tempMapItem.name)
                    sc_tempMapItem.addTowerGridPosInRange(gridPos)
                    let enemiesMap = sc_tempMapItem.getEnemiesMap()
                    if (enemiesMap.size > 0) {
                        enemiesMap.forEach((enemy, uuid) => {
                            sc_tower.addEnemy(enemy)
                        })
                    }
                }
            }
        }
    },

    _removeTowersInRange(sc_tower, range) {
        let gridPos = sc_tower.getGridPos()
        cc.log(cc.js.getClassName(this) + ` _removeTowersInRange gridPos = `, gridPos)

        for (let x = gridPos.x - range; x <= gridPos.x + range; x++) {
            for (let y = gridPos.y - range; y <= gridPos.y + range; y++) {
                if (x >= 0 && x < this._widthItemNum && y >= 0 && y < this._heightItemNum) {
                    let tempGraidPos = cc.js.createMap()
                    tempGraidPos.x = x
                    tempGraidPos.y = y
                    let tempMapItem = this._mapItemsMap.get(tempGraidPos.x).get(tempGraidPos.y),
                        sc_tempMapItem = tempMapItem.getComponent(tempMapItem.name)
                    let enemiesMap = sc_tempMapItem.getEnemiesMap()
                    if (enemiesMap.size > 0) {
                        enemiesMap.forEach((enemy, uuid) => {
                            sc_tower.removeEnemy(enemy)
                        })
                    }
                    sc_tempMapItem.removeTowerGridPosInRange(gridPos)
                }
            }
        }
    },

    _setScore(score) {
        if (score) {
            this.lab_score.string = score.toString()
        } else {
            this.lab_score.string = `0`
        }
    },

    _getScore(){
        return Number(this.lab_score.string)
    },

    _gameOver() {
        this.unscheduleAllCallbacks()
        this.nd_unitCtn.removeAllChildren()
        this._curEnemies.clear()
    },

    _setPlayerHP(hp) {
        if (hp) {
            this.lab_playerHP.string = hp.toString()
        } else {
            this.lab_playerHP.string = `0`
            this._gameOver()
        }
    },

    _getPlayerHP() {
        return Number(this.lab_playerHP.string)
    },

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    init(data) {
        cc.log(cc.js.getClassName(this) + ` init data = `, data)

        if (this._widthItemNum !== data.widthItemNum || this._heightItemNum !== data.heightItemNum) {
            this._widthItemNum = Math.ceil(data.widthItemNum * 0.5) * 2
            this._heightItemNum = Math.ceil((data.heightItemNum - 4) / 3) * 3 + 4
            this._initGrid()
            this.nd_unitCtn.removeAllChildren()
            this._cdTime = Const.Game.GameStartTime
            this.lab_cdTime.node.active = true
            this._setScore(data.score)
            this._setPlayerHP(data.playerHP)
        } else {
            this._cdTime = 0
            this.lab_cdTime.node.active = false
        }
        this.lab_cdTime.string = this._cdTime.toString()
    },
});
