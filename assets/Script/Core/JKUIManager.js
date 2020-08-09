import JKSingle from 'JKSingle'
import JKUIView from 'JKUIView'

export default class JKUIManager extends JKSingle {
    constructor() {
        super()
    }

    _setInterval(intervalCall) {
        this._intervalCall = intervalCall instanceof Function ? intervalCall : null
    }

    //==============================================================

    /**
     * 初始化界面管理器
     * @param {cc.Node} root 管理器根节点
     */
    init(root) {
        cc.log(cc.js.getClassName(this) + ` init`)

        this._mRoot = root
        this._viewQueue = []
        this._interval = setInterval(() => {
            this._intervalCall && this._intervalCall(cc.JK.JKConst.JKUpdateDT * 0.001)
        }, cc.JK.JKConst.JKUpdateDT)
    }

    /**
     * 打开新界面
     * @param {String} viewName 界面预制体文件名
     * @param {Object} data 传入的数据
     * @param {Boolean} clear 是否清理界面缓存
     */
    openView(viewName, data, clear = false) {
        cc.log(`%c openView ${viewName}`, 'color:#0064FF;')

        if (!viewName || viewName === ``)
            cc.error(`viewName = '${viewName}' is unknown`)

        cc.loader.loadRes(`View/UI/${viewName}/${viewName}`, cc.Prefab, (err, prefab) => {
            if (err) {
                cc.error(err)
            } else {
                let lastView = this._mRoot.children[0]
                lastView && this._viewQueue.push(lastView) && (lastView.parent = null)

                let view = cc.instantiate(prefab)
                let viewSC = view.getComponent(JKUIView)
                viewSC.init && viewSC.init(data)
                viewSC.JKUpdate && this._setInterval((dt) => {
                    viewSC.JKUpdate(dt)
                })
                this._mRoot.addChild(view)
                if (clear) {
                    this._viewQueue.forEach(view => {
                        view && view.isValid && view.node.destroy()
                    })
                    this._viewQueue = []
                }
                cc.log(`viewQueue = `, this._viewQueue)
            }
        })
    }

    //关闭界面，打开上级界面，如果没有上级界面则无法关闭
    closeView(data) {
        let lastView = this._viewQueue.pop()
        if (lastView) {
            this._mRoot.children[0].destroy()
            let viewSC = lastView.getComponent(JKUIView)
            viewSC.init && viewSC.init(data)
            viewSC.JKUpdate && this._setInterval((dt) => {
                viewSC.JKUpdate(dt)
            })
            this._mRoot.addChild(lastView)
            cc.log(`viewQueue = ${this._viewQueue}`)
        } else {
            cc.error(`there must be at least one view being openning`)
        }
    }
}