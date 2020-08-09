import JKModelUpdateTool from 'JKModelUpdateTool'

export default cc.Class({
    extends: cc.Component,

    properties: {

    },

    init(data) {
        cc.log(cc.js.getClassName(this) + ` init`)

        this.JKModelUpdateTool = this.JKModelUpdateTool || new JKModelUpdateTool()
        this._init()
    },

    onLoad() {
        cc.log(cc.js.getClassName(this) + ` onLoad`)

        this.sc_blockInputEvents = this.getComponent(cc.BlockInputEvents) || this.node.addComponent(cc.BlockInputEvents)

        this._onLoad()
    },

    onEnable() {
        cc.log(cc.js.getClassName(this) + ` onEnable`)

        //初始化临时变量
        //点击事件
        this._btnEvents = []
        this._btnDT = 0

        this._onEnable()
    },

    start() {
        cc.log(cc.js.getClassName(this) + ` start`)

        this._start()
    },

    JKUpdate(dt) {
        //点击延迟
        if (this._btnDT > 0) {
            this._btnDT -= dt
        }

        this._update(dt)
    },


    lateUpdate(dt) {

        this._lateUpdate(dt)
    },

    onDisable() {
        cc.log(cc.js.getClassName(this) + ` onDisable`)

        this._onDisable()
    },

    onDestroy() {
        cc.log(cc.js.getClassName(this) + ` onDestroy`)

        //解绑所有点击事件
        this.unBindAllEvents()

        this._onDestroy()
    },

    //====================================================================
    //=============================内部方法===============================
    //====================================================================

    _init(data) {
        cc.log(cc.js.getClassName(this) + ` _init`)
        cc.warn(`子类 init 方法没有复写！`)
    },

    _onLoad() {
        cc.log(cc.js.getClassName(this) + ` _onLoad`)
        cc.warn(`子类 onLoad 方法没有复写！`)
    },

    _onEnable() {
        cc.log(cc.js.getClassName(this) + ` _onEnable`)
        cc.warn(`子类 onEnable 方法没有复写！`)
    },

    _start() {
        cc.log(cc.js.getClassName(this) + ` _start`)
        cc.warn(`子类 start 方法没有复写！`)
    },

    _update(dt) {

    },


    _lateUpdate(dt) {

    },

    _onDisable() {
        cc.log(cc.js.getClassName(this) + ` _onDisable`)
        cc.warn(`子类 onDisable 方法没有复写！`)
    },

    _onDestroy() {
        cc.log(cc.js.getClassName(this) + ` _onDestroy`)
        cc.warn(`子类 onDestroy 方法没有复写！`)
    },

    //====================================================================
    //=============================外部方法===============================
    //====================================================================

    /**
     * 查找组件对象
     * @param {String} path 目标节点路径
     * @param {cc.Object} type 对象类型
     * @param {cc.Node} parent 父节点，默认当前界面
     */
    find(path, type, parent = this.node) {
        cc.log(cc.js.getClassName(this) + ` find`)

        if (path + `` === path) {
            let taregt = cc.find(path, parent)
            return type ? taregt : taregt.getComponent(type)
        } else {
            cc.warn(`path is unknown!`)
        }

        return
    },

    /**
     * 绑定点击事件
     * @param {cc.Node} tarNode 目标节点
     * @param {Function} call 回调函数
     * @param {cc.Object} target 回调对象
     * @param {Number} CDTime 按钮冷却时间/秒
     */
    bindBtnEvent(tarNode, call, taregt, CDTime) {
        cc.log(cc.js.getClassName(this) + ` bindEvent`)

        if (tarNode) {
            if (call) {
                let event = {
                    tarNode: tarNode,
                    call: () => {
                        CDTime = CDTime || cc.JK.JKConst.ClickCDTime
                        if (!this._btnDT || this._btnDT <= 0) {
                            call()
                            this._btnDT = CDTime
                        } else {
                            cc.warn(`click too fast!`)
                        }
                    },
                    taregt: taregt || this,
                }
                this._btnEvents.push(event)
                tarNode.on(cc.Node.EventType.TOUCH_END, event.call, event.taregt)
            } else {
                cc.warn(`call is unknown!`)
            }
        }
    },

    /**
     * 解绑所有点击事件
     */
    unBindAllEvents(){
        cc.log(cc.js.getClassName(this) + ` unBindAllEvents`)

        this._btnEvents.forEach(event => {
            if (event) {
                event.tarNode.off(cc.Node.EventType.TOUCH_END, event.call, event.taregt)
                event.call = null
                event.taregt = null
                event = null
            }
        })
        this._btnEvents = null
    },
})
