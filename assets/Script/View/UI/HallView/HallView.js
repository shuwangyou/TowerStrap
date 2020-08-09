import JKUIView from 'JKUIView'
import * as Const from 'Const'

//task
const TaskNone = 0

export default cc.Class({
    extends: JKUIView,

    properties: {
        nd_hallUICpntCtn: cc.Node,
        hallUICpnt: cc.Prefab,
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _init(data) {
        cc.log(cc.js.getClassName(this) + ` _init`)

    },

    _onLoad() {
        cc.log(cc.js.getClassName(this) + ` _onLoad`)

        // HallUI
        this.JKModelUpdateTool.put(Const.HallView.CpntName.HallUI, {
            labBtnStartGame: `开始游戏`,
        })
        this.sc_hallUICpnt = cc.instantiate(this.hallUICpnt).getComponent(this.hallUICpnt.name)
        this.nd_hallUICpntCtn.addChild(this.sc_hallUICpnt.node)
    },

    _onEnable() {
        cc.log(cc.js.getClassName(this) + ` _onEnable`)
    },

    _start() {
        cc.log(cc.js.getClassName(this) + ` _start`)

        cc.JK.JKTaskQueueTool.addCMD({
            cmd: Const.HallView.CMD.RegistCpntUpdateWithName,
            params: {},
            call: (cmd, params) => {
                cc.log(cc.js.getClassName(this) + ` CMD.RegistCpntUpdateWithName params = `, params)

                // HallUI
                this.JKModelUpdateTool.registCpntUpdateWithName(Const.HallView.CpntName.HallUI, this._updateCpntHallUI.bind(this))
                this._updateCpntHallUI(this.JKModelUpdateTool.getCpntDataByName(Const.HallView.CpntName.HallUI))

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

    _updateCpntHallUI(data) {
        cc.log(cc.js.getClassName(this) + ` _updateCpntHallUI`)

        if (data) {
            cc.log(data)

            cc.JK.JKTaskQueueTool.addCMD({
                cmd: Const.HallView.CMD.UpdateCpntHallUI,
                params: {},
                call: (cmd, params) => {
                    cc.log(cc.js.getClassName(this) + ` CMD.UpdateCpntHallUI params = `, params)

                    this.sc_hallUICpnt.init(data)

                    this.bindBtnEvent(this.sc_hallUICpnt.getNdBtnStartGame(), (event) => {
                        cc.log(cc.js.getClassName(this) + ` onStartGame`)

                        cc.JK.UIManager.openView(`GameView`)
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
