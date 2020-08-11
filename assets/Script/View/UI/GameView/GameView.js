import JKUIView from 'JKUIView'
import * as Const from 'Const'

//task
const TaskNone = 0

export default cc.Class({
    extends: JKUIView,

    properties: {
        nd_gameCpntCtn: cc.Node,
        gameCpnt: cc.Prefab,
        nd_gameUICpntCtn: cc.Node,
        gameUICpnt: cc.Prefab,
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _init(data) {
        cc.log(cc.js.getClassName(this) + ` _init`)

    },

    _onLoad() {
        cc.log(cc.js.getClassName(this) + ` _onLoad`)

        this.sc_gameUICpnt = cc.instantiate(this.gameUICpnt).getComponent(this.gameUICpnt.name)
        this.nd_gameUICpntCtn.addChild(this.sc_gameUICpnt.node)

        // Game
        this.JKModelUpdateTool.put(Const.GameView.CpntName.Game, {
            widthItemNum: 4 + Const.Game.GridWidth,
            heightItemNum: 4 + Const.Game.GridHeight,
            score: Const.Game.Tower.Expenditure * (Math.ceil(Const.Game.GridHeight / 3) + 1) * 2,
            playerHP: Const.Game.PlayerHP,
        })
        this.sc_gameCpnt = cc.instantiate(this.gameCpnt).getComponent(this.gameCpnt.name)
        this.nd_gameCpntCtn.addChild(this.sc_gameCpnt.node)

        // GameUI
        this.JKModelUpdateTool.put(Const.GameView.CpntName.GameUI, {
            labBtnClose: `退出游戏`,
        })
    },

    _onEnable() {
        cc.log(cc.js.getClassName(this) + ` _onEnable`)
    },

    _start() {
        cc.log(cc.js.getClassName(this) + ` _start`)

        cc.JK.JKTaskQueueTool.addCMD({
            cmd: Const.GameView.CMD.RegistCpntUpdateWithName,
            params: {},
            call: (cmd, params) => {
                cc.log(cc.js.getClassName(this) + ` CMD.RegistCpntUpdateWithName params = `, params)

                // Game
                this.JKModelUpdateTool.registCpntUpdateWithName(Const.GameView.CpntName.Game, this._updateCpntGame.bind(this))
                this._updateCpntGame(this.JKModelUpdateTool.getCpntDataByName(Const.GameView.CpntName.Game))

                // GameUI
                this.JKModelUpdateTool.registCpntUpdateWithName(Const.GameView.CpntName.GameUI, this._updateCpntGameUI.bind(this))
                this._updateCpntGameUI(this.JKModelUpdateTool.getCpntDataByName(Const.GameView.CpntName.GameUI))

                cc.JK.JKTaskQueueTool.doneCMD(cmd)
            },
        })
    },

    _update(dt) {
        
    },


    _lateUpdate() {

    },

    _onDisable() {
        cc.log(cc.js.getClassName(this) + ` _onDisable`)
    },

    _onDestroy() {
        cc.log(cc.js.getClassName(this) + ` _onDestroy`)
    },

    _updateCpntGame(data) {
        cc.log(cc.js.getClassName(this) + ` _updateCpntGame`)

        if (data) {
            cc.log(data)

            this.sc_gameCpnt.init(data)
        }
    },

    _updateCpntGameUI(data) {
        cc.log(cc.js.getClassName(this) + ` _updateCpntGameUI`)

        if (data) {
            cc.log(data)

            cc.JK.JKTaskQueueTool.addCMD({
                cmd: Const.GameView.CMD.UpdateCpntGameUI,
                params: {},
                call: (cmd, params) => {
                    cc.log(cc.js.getClassName(this) + ` CMD.UpdateCpntGameUI params = `, params)

                    this.sc_gameUICpnt.init(data)

                    this.bindBtnEvent(this.sc_gameUICpnt.getNdBtnClose(), (event) => {
                        cc.log(cc.js.getClassName(this) + ` onClose`)

                        cc.JK.UIManager.closeView()
                    })

                    cc.JK.JKTaskQueueTool.doneCMD(cmd)
                },
            })
        }
    },

    //====================================================================
    //=============================外部方法===============================
    //====================================================================
})
