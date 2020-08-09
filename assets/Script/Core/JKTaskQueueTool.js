/**
 * 任务队列
 */

export default class TaskQueueTool {
    constructor() {
        cc.log(cc.js.getClassName(this) + ` constructor`)
    }

    /**
     * 添加命令任务
     * @param {Object} cmd 命令对象 cmd = {
                                        cmd: Number,
                                        data: Object,
                                        call: Function,
                                    }
     * @param {Boolean} immediately 是否立刻执行，默认false异步队列执行（每帧一步）
     * @example
     * this._ctrl.addCMD({
            cmd: Const.HallView.CMD.RegistCpntUpdateWithName,
            data: {},
            call: (cmd, params) => {
                // ....
                this._ctrl.doneCMD(cmd)
            },
        })
     */
    addCMD(cmd, immediately = false) {
        // cc.log(cc.js.getClassName(this) + ` addCMD ${cmd.cmd} immediately = ${immediately}`)
        
        this._CMDList = this._CMDList || []
        if (cmd) {

            if (immediately) {
                this.doCMD(cmd)
            } else {
                this._CMDList.push(cmd)
            }
        }
    }

    /**
     * 执行命令任务
     * @param {Object} immediatelyCMD 传入则立刻执行
     */
    doCMD(immediatelyCMD) {
        if (immediatelyCMD) {
            // cc.log(cc.js.getClassName(this) + ` doCMD ${immediatelyCMD.cmd}`)
            this._doingCMD = true
            immediatelyCMD.call(immediatelyCMD.cmd, immediatelyCMD.params)
        } else {
            if (!this._doingCMD) {
                this._CMDList = this._CMDList || []
                let cmd = this._CMDList[0]
                if (cmd) {
                    // cc.log(cc.js.getClassName(this) + ` doCMD ${cmd.cmd}`)
                    this._doingCMD = true
                    cmd = this._CMDList.shift()
                    cmd.call(cmd.cmd, cmd.params)
                }
            }
        }
    }

    /**
     * 完成一次任务命令后回调，一边开始下一个命令任务
     * @param {Object} cmd 当前完成的命令对象 cmd = {
                                                    cmd: Number,
                                                    data: Object,
                                                    call: Function,
                                                }
     */
    doneCMD(cmd) {
        // cc.log(cc.js.getClassName(this) + ` doneCMD ${cmd}`)

        this._doingCMD = false
    }
}