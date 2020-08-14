export default class JKAStart {
    constructor(widthNum, heightNum, gridMap) {
        this._widthNum = widthNum
        this._heightNum = heightNum
        this._gridMap = gridMap
    }

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _startSearch(sc_starItemGrid, sc_endItemGrid) {
        this._getClosestOpenSCItems(sc_starItemGrid, sc_starItemGrid, sc_endItemGrid)
    }

    _getClosestOpenSCItems(sc_curItemGrid, sc_starItemGrid, sc_endItemGrid) {
        sc_curItemGrid.isClose = true
        this._closeItems.set(this._closeItems.size, sc_curItemGrid)

        let gridPoss = [
            cc.v2(sc_curItemGrid.gridPos.x + 1, sc_curItemGrid.gridPos.y),
            cc.v2(sc_curItemGrid.gridPos.x, sc_curItemGrid.gridPos.y + 1),
            cc.v2(sc_curItemGrid.gridPos.x - 1, sc_curItemGrid.gridPos.y),
            cc.v2(sc_curItemGrid.gridPos.x, sc_curItemGrid.gridPos.y - 1),
            cc.v2(sc_curItemGrid.gridPos.x + 1, sc_curItemGrid.gridPos.y + 1),
            cc.v2(sc_curItemGrid.gridPos.x - 1, sc_curItemGrid.gridPos.y + 1),
            cc.v2(sc_curItemGrid.gridPos.x - 1, sc_curItemGrid.gridPos.y - 1),
            cc.v2(sc_curItemGrid.gridPos.x + 1, sc_curItemGrid.gridPos.y - 1),
        ]
        gridPoss.forEach(gridPos => {
            let x = gridPos.x,
                y = gridPos.y
            if (x >= 0 && y >= 0 && x < this._widthNum && y < this._heightNum) {
                let sc_item = this._gridMap.get(x).get(y)
                if (sc_item !== sc_curItemGrid) {
                    if (sc_item.moveAbled && !sc_item.isClose && !sc_item.isOpen) {
                        this._openSCItems.push(sc_item)
                        if (!sc_item.last) {
                            sc_item.last = sc_curItemGrid
                        }
                    }
                }
            }
        })
        if (this._openSCItems.length > 0) {
            // let stepSCItems = []
            for (let index = 0; index < this._openSCItems.length; index++) {
                let sc_item = this._openSCItems[index]
                if (sc_item !== sc_endItemGrid) {
                    if (!sc_item.isOpen) {
                        sc_item.isOpen = true
                        let curOffX = Math.abs(sc_item.gridPos.x - sc_item.last.gridPos.x),
                            curOffY = Math.abs(sc_item.gridPos.y - sc_item.last.gridPos.y),
                            expectOffX = Math.abs(sc_endItemGrid.gridPos.x - sc_item.gridPos.x),
                            expectOffY = Math.abs(sc_endItemGrid.gridPos.y - sc_item.gridPos.y)
                        sc_item.curStepNum = sc_item.last.curStepNum + curOffX + curOffY + (curOffX !== 0 && curOffY !== 0 && (- 0.5))
                        sc_item.expectStepNum = expectOffX + expectOffY + (expectOffX !== 0 && expectOffY !== 0 && (- 0.5))
                        let sumNum = sc_item.curStepNum + sc_item.expectStepNum
                        sc_item.sumNum = sumNum
                    }
                } else {
                    this._showResult(true, sc_starItemGrid, sc_endItemGrid)
                    return true
                }
            }
            if (this._getClosestOpenSCItems(this._openSCItems.sort((a, b) => a.sumNum - b.sumNum).shift(), sc_starItemGrid, sc_endItemGrid)) {
                return true
            }
        } else {
            this._showResult(false, sc_starItemGrid, sc_endItemGrid)
            return true
        }
        return false
    }

    _showResult(success, sc_starItemGrid, sc_endItemGrid) {
        if (success) {
            this._steps = []
            this._findLast(sc_endItemGrid)
            // this._isSmart = false
            if (this._isSmart) {
                this._steps = this._optimizeResult(this._steps)
            }
            this._steps.forEach(sc_item => {
                sc_item.getComponent(sc_item.name).nd_spWay.active = true
            })
            this._resultCall && this._resultCall(this._steps)
        } else {
            this._resultCall && this._resultCall(null)
        }
        this._resultCall = null
    }

    _optimizeResult(steps) {
        let dealIndexes = []
        for (let index = 0; index < steps.length; index++) {
            let sc_item = steps[index]
            if (sc_item !== this.sc_starItemGrid && sc_item !== this.sc_endItemGrid) {
                let itemPos = cc.v2(sc_item.gridPos),
                    sc_last = sc_item.last,
                    lastPos = sc_last && sc_last.gridPos && cc.v2(sc_last.gridPos),
                    vector1 = lastPos && itemPos.sub(lastPos),
                    sc_next = sc_item.next,
                    nextPos = sc_next && sc_next.gridPos && cc.v2(sc_next.gridPos),
                    vector2 = nextPos && nextPos.sub(itemPos)
                if (vector1 && vector2) {
                    if (!cc.Vec2.strictEquals(vector1, vector2)) {
                        let vector3 = vector1.add(vector2),
                            x3 = vector3.x,
                            y3 = vector3.y,
                            unitX3 = vector3.div(Math.abs(x3)),
                            unitY3 = vector3.div(Math.abs(y3)),
                            allMoveAbled = true
                        for (let i = 0; i < Math.abs(x3); i++) {
                            let gridPos = lastPos.add(unitX3.scale(cc.v2(i + 0.5, i + 0.5))),
                                tempX1 = Math.ceil(gridPos.x),
                                tempX2 = Math.floor(gridPos.x),
                                tempY = Math.round(gridPos.y),
                                tempSCItem1 = this._gridMap.get(tempX1).get(tempY),
                                tempSCItem2 = this._gridMap.get(tempX2).get(tempY)
                            tempSCItem1.getComponent(tempSCItem1.name).nd_spSearch.active = true
                            tempSCItem2.getComponent(tempSCItem2.name).nd_spSearch.active = true
                            if (!tempSCItem1.moveAbled || !tempSCItem2.moveAbled) {
                                allMoveAbled = false
                            }
                        }
                        for (let j = 0; j < Math.abs(y3); j++) {
                            let gridPos = lastPos.add(unitY3.scale(cc.v2(j + 0.5, j + 0.5))),
                                tempY1 = Math.ceil(gridPos.y),
                                tempY2 = Math.floor(gridPos.y),
                                tempX = Math.round(gridPos.x),
                                tempSCItem1 = this._gridMap.get(tempX).get(tempY1),
                                tempSCItem2 = this._gridMap.get(tempX).get(tempY2)
                            tempSCItem1.getComponent(tempSCItem1.name).nd_spSearch.active = true
                            tempSCItem2.getComponent(tempSCItem2.name).nd_spSearch.active = true
                            if (!tempSCItem1.moveAbled || !tempSCItem2.moveAbled) {
                                allMoveAbled = false
                            }
                        }
                        if (allMoveAbled) {
                            dealIndexes.push(index)
                            break
                        }
                    }
                }
            }
        }
        let tempSteps = []
        dealIndexes.forEach(index => {
            steps[index] = null
        })
        steps.forEach(sc_item => {
            if (sc_item) {
                tempSteps.push(sc_item)
                sc_item.last = tempSteps[tempSteps.length - 2] || sc_item.last
                sc_item.last && (sc_item.last.next = sc_item)
            }
        })
        if (dealIndexes.length > 0) {
            return this._optimizeResult(tempSteps)
        } else {
            return steps
        }
    }

    _findLast(sc_curItemGrid) {
        if (sc_curItemGrid) {
            this._steps.unshift(sc_curItemGrid)
            sc_curItemGrid.last && (sc_curItemGrid.last.next = sc_curItemGrid)
            this._findLast(sc_curItemGrid.last)
        }
    }

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    searchWay(sc_starItemGrid, sc_endItemGrid, call, isSmart = true) {
        this._gridMap.forEach((value, x) => {
            value.forEach((sc_item, y) => {
                this.resetSCItem(sc_item)
            })
        })
        this._openSCItems = []
        this._closeItems = new Map()
        this._resultCall = call
        this._isSmart = isSmart

        this._startSearch(sc_starItemGrid, sc_endItemGrid)
    }

    initSCItem(sc_item, gridPos) {
        sc_item.gridPos = gridPos
        sc_item.moveAbled = true
        this.resetSCItem(sc_item)
    }

    resetSCItem(sc_item) {
        sc_item.getComponent(sc_item.name).nd_spSearch.active = false
        sc_item.getComponent(sc_item.name).nd_spWay.active = false
        sc_item.isClose = false
        sc_item.isOpen = false
        sc_item.last = null
        sc_item.next = null
        sc_item.curStepNum = 0
    }

    setMoveAbled(sc_item, bool) {
        sc_item.moveAbled = bool
    }
}