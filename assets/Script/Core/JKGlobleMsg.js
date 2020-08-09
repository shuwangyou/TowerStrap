import JKSingle from 'JKSingle'

export default class JKGlobleMsg extends JKSingle {
    constructor() {
        super()

        this._msgsMap = {}
    }

    //==============================================================

    /**
     * 注册一条消息
     * @param {*} msg 消息内容，不能为空值 "" null undefined [] {} NaN
     * @param {Function} call 回调
     * @param {*} target 调用对象
     * @param  {...any} args 一个或多个参数（“，”分隔）,回调时会传入一个包含所有参数组成的数组
     */
    register(msg, call, target = this, ...args) {
        cc.log(cc.js.getClassName(this) + ` register`)

        if (msg) {
            if (call instanceof Function) {
                let callObj = { call: call, args: (args.length > 0 ? args : []) }
                target = !cc.JK.JKUtils.isInvalidValue(target) || this
                if (this._msgsMap[msg]) {
                    if (this._msgsMap[msg][target]) {
                        this._msgsMap[msg][target].push(callObj)
                    } else {
                        this._msgsMap[msg][target] = [callObj]
                    }
                } else {
                    this._msgsMap[msg] = {}
                    this._msgsMap[msg][target] = [callObj]
                }
            } else {
                cc.warn(`call is unknown!`)
            }
        } else {
            cc.warn(`msg is unknown!`)
        }
    }

    /**
     * 
     * @param {*} msg 消息内容，不能为空值 "" null undefined [] {} NaN
     * @param {Function} call 
     * @param {*} target 
     */
    unRegister(msg, call, target = this) {
        cc.log(cc.js.getClassName(this) + ` unRegister`)

        if (msg && this._msgsMap[msg]) {
            if (call) {
                target = !cc.JK.JKUtils.isInvalidValue(target) || this
                let callObjs = this._msgsMap[msg][target]
                if (callObjs && callObjs.length > 0) {
                    for (let index = 0; index < callObjs.length; index++) {
                        let callObj = callObjs[index]
                        if (call === callObj.call) {
                            callObjs.splice(index, 1)
                            break
                        }
                    }
                }
            } else {
                cc.warn(`clear all ths calls bound on this msg!`)

                this._msgsMap[msg] = null
            }
        }
    }

    /**
     * 广播一条消息
     * @param {*} msg 消息内容，不能为空值 "" null undefined [] {} NaN
     */
    sendMsg(msg) {
        cc.log(cc.js.getClassName(this) + ` sendMsg`)

        if (msg) {
            if (this._msgsMap[msg]) {
                for (const key in this._msgsMap[msg]) {
                    if (this._msgsMap[msg].hasOwnProperty(key)) {
                        let callObjs = this._msgsMap[msg][key] || []
                        callObjs.forEach(callObj => {
                            callObj && callObj.call && callObj.call(callObj.args)
                        })
                    }
                }
            } else {
                cc.warn(`no call bind this msg!`)
            }
        } else {
            cc.warn(`msg is unknown!`)
        }
    }
}