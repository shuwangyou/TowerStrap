/**
 * A*
 */
class APathfindingHex {
	constructor(allOldC) {
		this._allC = []

		allOldC.forEach(oldC => {
			let newC = new Coordinate(oldC.x, oldC.y)
			newC.isBlock = oldC.isBlock
			newC.speed = oldC.speed
			this._allC.add(newC)
		})
	}

	/**
	 * 查找节点数否存在
	 * @param {Coordinate} inC 纯坐标点
	 * @param {Coordinate} allC 网格
	 */
	_findC(inC, allC) {
		return allC.includes(inC)
	}

	/**
	 * 单位操作，计算附近节点权值，如果找到终点则返回true
	 * @param {Coordinate} curC 当前节点
	 * @param {Coordinate} desC 终点
	 */
	_makeOne(curC, desC) {
		this._closeList.push(curC)
		delete this._openList[this._openList.indexOf(curC)]
		let nearListC = curC.findNear()
		nearListC.forEach(coordinate => {
			let temp = this._findC(coordinate, allC)
			if (temp != null && temp.isBlock == false) {
				let isColose = false
				for (let i = 0; i < this._closeList.length; i++) {
					const tempCC = this._closeList[i]
					if (tempCC.equals(temp)) {
						isColose = true
						break
					}
				}
				if (!isColose) {
					let tempG = curC.G + temp.speed
					if (tempG < temp.G || temp.parent === null) {
						temp.parent = curC
						temp.G = tempG
						temp.H = this._calcuH(temp, desC)
						temp.F = temp.G + temp.H
					}
					let exist = false
					this._openList.forEach(tempOC => {
						if (tempOC.equals(temp)) {
							exist = true
						}
					})
					if (!exist) {
						this._openList.add(temp)
					}
					if (temp.equals(desC)) {
						//找到目的地
						temp.addToPath(this._pathC)
						return true
					}
				}
			}
		})
		return false
	}

	/**
	 * 找到当前期望最快的路径点
	 */
	_findMinFinOpen() {
		//先找最小值
		let minF = 99999,
			minIndex = 0
		for (let index = 0; index < this._openList.length; index++) {
			if (this._openList[index].F < minF) {
				minF = this._openList[index].F
				minIndex = index
			}
		}

		return this._openList[minIndex] || null
	}

	/**
	 * 计算当前点到终点的期望值
	 * @param {Coordinate} srcC 
	 * @param {Coordinate} desC 
	 */
	_calcuH(srcC, desC) {
		let srcCX = srcC.x * 10,
			srcCY = -srcC.y * 10
		if (srcC.x % 2 !== 0) {
			srcCY -= 5
		}
		let desCX = desC.x * 10,
			desCY = -desC.y * 10
		if (desC.x % 2 !== 0) {
			desCY -= 5
		}
		let _x = Math.abs(srcCX - desCX),
			_y = Math.abs(srcCY - desCY)
		return Math.sqrt(_x * _x + _y * _y)
	}

	//==============================================================================
	//==============================================================================
	//==============================================================================

	/**
	 * 开始寻路
	 * @param {Coordinate} oldStartC 起点
	 * @param {Coordinate} oldDesC 终点
	 */
	start(oldStartC, oldDesC) {
		let startC = this._findC(oldStartC, this._allC),
			desC = this._findC(oldDesC, this._allC)
		if (startC === null || desC === null) {
			cc.log("起点或者终点有误")
			return null
		}
		if (startC.isBlock || desC.isBlock) {
			cc.log("起点或者终点无法通过")
			return null
		}
		this._openList = []
		this._closeList = []
		this._pathC = []
		let isFind = this._makeOne(startC, desC),
			count = 0
		while (isFind === false && this._openList.length > 0) {
			let minC = this._findMinFinOpen()
			if (minC != null) {
				isFind = _makeOne(minC, desC)
			}
			count++
		}
		cc.log("计算量:" + count)
		return this._pathC
	}
}




/**
 * 多边形网格单位数据对象
 */
class Coordinate {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.isBlock = false
		this.parent = null
		this.speed = null
		this.F = null
		this.G = null
		this.H = null
		this._up = cc.js.createMap()
		this._down = cc.js.createMap()
		this._upLeft = cc.js.createMap()
		this._upRight = cc.js.createMap()
		this._downLeft = cc.js.createMap()
		this._downRight = cc.js.createMap()
	}

	setGridPos(x, y) {
		this.x = x
		this.y = y
		this._setUp()
		this._setDown()
		this._setUpL()
		this._setUpR()
		this._setDownL()
		this._setDownR()
	}

	getGridPos() {
		let gridPos = cc.js.createMap()
		gridPos.x = this.x
		gridPos.y = this.y

		return gridPos
	}

	_setUp() {
		this._up.x = this.x
		this._up.y = this.y - 1
	}

	_setDown() {
		this._up.x = this.x
		this._up.y = this.y + 1
	}

	_setUpL() {
		if (this.x % 2 == 0) {
			this._up.x = this.x - 1
			this._up.y = this.y - 1
		} else {
			this._up.x = this.x - 1
			this._up.y = this.y
		}
	}

	_setUpR() {
		if (this.x % 2 == 0) {
			this._up.x = this.x + 1
			this._up.y = this.y - 1
		} else {
			this._up.x = this.x + 1
			this._up.y = this.y
		}
	}

	_setDownL() {
		if (this.x % 2 == 0) {
			this._up.x = this.x - 1
			this._up.y = this.y
		} else {
			this._up.x = this.x - 1
			this._up.y = this.y + 1
		}
	}

	_setDownR() {
		if (this.x % 2 == 0) {
			this._up.x = this.x + 1
			this._up.y = this.y
		} else {
			this._up.x = this.x + 1
			this._up.y = this.y + 1
		}
	}

	_findUp() {
		return this._up
	}

	_findDown() {
		return this._down
	}

	_findUpL() {
		return this._upLeft
	}

	_findUpR() {
		return this._upRight
	}

	_findDownL() {
		return this._downLeft
	}

	_findDownR() {
		return this._downRight
	}

	//===========================================================================
	//===========================================================================
	//===========================================================================

	equals(obj) {
		inC = obj
		if (inC.x == x && inC.y == y) {
			return true
		}
		return false
	}

	findNear() {
		res = []
		res.push(this._findUp())
		res.push(this._findUpR())
		res.push(this._findDownR())
		res.push(this._findDown())
		res.push(this._findDownL())
		res.push(this._findUpL())
		return res
	}

	addToPath(pathC) {
		pathC.push(this)
		if (this.parent != null) {
			this.parent.addToPath(pathC)
		}
	}
}