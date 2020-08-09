import JKGlobleMsg from 'JKGlobleMsg'
import JKUIManager from 'JKUIManager'
import JKAudioManager from 'JKAudioManager'
import JKUtils from 'JKUtils'
import JKTaskQueueTool from 'JKTaskQueueTool'
import JKConst from 'JKConst'
import JKNetManager from 'JKNetManager'
import JKGameCtrl from 'JKGameCtrl'

//task
const TaskNone = 0
const TaskActivatedGame = 10

cc.Class({
    extends: cc.Component,

    properties: {
        firstViewName: {
            default: ``,
            displayName: `初始view`,
            tooltip: `首次启动的界面名称，这个名称同时是界面预制体和组件脚本的文件名`,
        },
    },

    onLoad() {
        cc.log(cc.js.getClassName(this) + ` onLoad`)

        cc.JK = cc.js.createMap()

        // 初始化任务队列工具
        cc.JK.JKTaskQueueTool = new JKTaskQueueTool()

        // 初始化常量表
        cc.JK.JKConst = JKConst

        // 初始化工具集
        cc.JK.JKUtils = JKUtils

        // 初始全局消息管理器
        cc.JK.JKGlobleMsg = JKGlobleMsg.getInstance()

        // 初始化界面管理器
        this.nd_UIManager = this.node.getChildByName(`UIManager`)
        if (!this.nd_UIManager) {
            this.nd_UIManager = new cc.Node(`UIManager`)
            let widget = this.nd_UIManager.addComponent(cc.Widget)
            widget.isAlignTop = true
            widget.isAlignBottom = true
            widget.isAlignLeft = true
            widget.isAlignRight = true
            widget.top = 0
            widget.bottom = 0
            widget.left = 0
            widget.right = 0
            this.node.addChild(this.nd_UIManager)
        }
        cc.JK.UIManager = JKUIManager.getInstance()
        cc.JK.UIManager.init(this.nd_UIManager)

        // 初始化音频管理器
        cc.JK.JKAudioManager = JKAudioManager.getInstance()
        cc.JK.JKAudioManager.init()

        // 初始化网络管理器
        cc.JK.NetManager = JKNetManager.getInstance()
        cc.JK.NetManager.init()

        // 初始化游戏控制器
        cc.JK.JKGameCtrl = JKGameCtrl.getInstance()
    },

    onEnable() {
        cc.log(cc.js.getClassName(this) + ` onEnable`)

    },

    start() {
        cc.log(cc.js.getClassName(this) + ` start`)
        
                    this._activatedGame()
    },

    update(dt) {
        cc.JK.JKTaskQueueTool && cc.JK.JKTaskQueueTool.doCMD()
    },


    lateUpdate() {

    },

    onDisable() {
        cc.log(cc.js.getClassName(this) + ` onDisable`)

        cc.JK.JKGameCtrl && cc.JK.JKGameCtrl.onDisable(dt)
    },

    onDestroy() {
        cc.log(cc.js.getClassName(this) + ` onDestroy`)

        cc.JK.JKGameCtrl && cc.JK.JKGameCtrl.onDestroy(dt)
    },

    //==========================================================================

    //激活游戏
    _activatedGame() {
        cc.log(cc.js.getClassName(this) + ` _activatedGame`)

        cc.JK.JKGameCtrl.init(
            {
            }
        )
        cc.JK.JKGameCtrl.setGameStatus(cc.JK.JKConst.GameStatus.GameWait)

        cc.JK.UIManager.openView(this.firstViewName)
    },
});
