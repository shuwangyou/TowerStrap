import JKSingle from 'JKSingle'
import JKTaskQueueTool from 'JKTaskQueueTool'

//game
let GameStatus = null

//task
const TaskNone = 0

export default class JKGameCtrl extends JKSingle {
    constructor() {
        super()
    }

    //==============================================================

    _update(dt) {
        
    }

    _onDisable() {
        cc.log(cc.js.getClassName(this) + ` _onDisable`)

    }

    _onDestroy() {
        cc.log(cc.js.getClassName(this) + ` _onDestroy`)

    }

    //==============================================================

    //初始化游戏
    init(data) {
        cc.log(cc.js.getClassName(this) + ` init`)

        if (data) {
            GameStatus = cc.JK.JKConst.GameStatus
            this._status = GameStatus.GameWait
        } else {
            cc.error(`data = ${data} is unknown!`)
        }
    }

    update(dt) {
        this._update(dt)
    }
    
    onDisable() {
        cc.log(cc.js.getClassName(this) + ` onDisable`)

        this._onDisable(dt)
    }

    onDestroy() {
        cc.log(cc.js.getClassName(this) + ` onDestroy`)

        this._onDestroy()
    }

    //设置游戏状态
    setGameStatus(status = GameStatus.GameWait) {
        cc.log(cc.js.getClassName(this) + ` setGameStatus`)

        switch (status) {
            //等待
            case GameStatus.GameWait:
                cc.log(cc.js.getClassName(this) + ` GameWait`)
                
                this._status = GameStatus.GameWait

                break
            //运行
            case GameStatus.GameRun:
                cc.log(cc.js.getClassName(this) + ` GameRun`)
                
                this._status = GameStatus.GameRun

                break
            //暂停
            case GameStatus.GamePause:
                cc.log(cc.js.getClassName(this) + ` GamePause`)
                
                this._status = GameStatus.GamePause

                break

            default:
                cc.error(`status = ${status} is unknown`)
                break;
        }
    }
}