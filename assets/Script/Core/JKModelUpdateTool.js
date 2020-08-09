/**
 * 数据双向绑定
 * 数据刷新，界面刷新
 */


export default class ModelUpdateTool {
    constructor() {
        // cc.log(cc.js.getClassName(this) + ` constructor`)

        this._cpntDataMap = cc.js.createMap()
        this._cpntUpdateCallMap = cc.js.createMap()
    }

    //===========================================================================================================
    //====================================== 非绑定相关方法，不会触发刷新 ==========================================
    //===========================================================================================================

    /**
     * 根据键值，设置数据，不触发自动刷新
     * @param {String} key 键值
     * @param {Object} data 数据，不限制类型
     * @param {Boolean} isMerge 是否合并数据，默认合并，否则替换，只对键值对象有效
     */
    put(key, data, isMerge = true) {
        // cc.log(cc.js.getClassName(this) + ` put key = "${key}" data = ` + data)

        if (key + `` === key) {
            if (isMerge && data) {
                let type = Object.prototype.toString.call(data)
                if (type === '[object Array]') {
                    this._cpntDataMap[key] = data
                } else if (type === '[object Object]') {
                    this._cpntDataMap[key] = this._cpntDataMap[key] || cc.js.createMap()
                    cc.js.mixin(this._cpntDataMap[key], data)
                } else {
                    this._cpntDataMap[key] = data
                }
            } else {
                this._cpntDataMap[key] = data
            }
        } else {
            cc.error(cc.js.getClassName(this) + ` The key "${key}" you want to put is unknown!`)
        }
    }

    /**
     * 根据键值，获取数据
     * @param {String} key 键值
     */
    get(key) {
        // cc.log(cc.js.getClassName(this) + ` get key = "${key}"`)

        if (key + `` === key) {
            return cc.JK.JKUtils.copyObj(this._cpntDataMap[key])
        } else {
            cc.error(cc.js.getClassName(this) + ` The key "${key}" you want to get is unknown!`)
        }
    }

    /**
     * 根据键值，删除数据
     * @param {String} key 键值
     */
    delete(key) {
        // cc.log(cc.js.getClassName(this) + ` delete key = "${key}"`)

        if (key + `` === key) {
            delete this._cpntDataMap[key]
        } else {
            cc.error(cc.js.getClassName(this) + ` The key "${key}" you want to get is unknown!`)
        }
    }

    /**
     * 清空数据
     */
    clear() {
        // cc.log(cc.js.getClassName(this) + ` clear`)

        this._cpntDataMap = cc.js.createMap()
    }

    //===========================================================================================================
    //====================================== 绑定相关方法，会触发刷新 =============================================
    //===========================================================================================================

    /**
     * 设置指定组件数据，触发自动刷新
     * @param {String} name 组件名
     * @param {Object} data 数据对象
     */
    setCpntDataByName(name, data) {
        // cc.log(cc.js.getClassName(this) + ` setCpntDataByName ${name}`)

        this.put(name, data)
        this.updateCpntWithName(name)
    }

    /**
     * 根据组件名获取数据
     * @param {String} name 组件名
     */
    getCpntDataByName(name) {
        // cc.log(cc.js.getClassName(this) + ` getCpntDataByName ${name}`)
        
        return this.get(name)
    }

    /**
     * 清空数据，触发自动刷新
     */
    clearCpntData() {
        // cc.log(cc.js.getClassName(this) + ` clear`)

        this.clear()
        this.updateCpntWithName()
    }

    /**
     * 绑定组件刷新回调
     * @param {String} name 组件名
     * @param {Function} updateCall 回调
     */
    registCpntUpdateWithName(name, updateCall) {
        // cc.log(cc.js.getClassName(this) + ` registCpntUpdateWithName  ${name}`)

        this._cpntUpdateCallMap[name] = updateCall
    }

    /**
     * 刷新指定组件
     * @param {String} name 组件名
     */
    updateCpntWithName(name) {
        // cc.log(cc.js.getClassName(this) + ` updateCpntWithName  ${name}`)

        if (name + `` === name) {
            let updateCall = this._cpntUpdateCallMap[name]
            if (updateCall) {
                updateCall(this.getCpntDataByName(name))
            } else {
                cc.warn(cc.js.getClassName(this) + ` The updateCall of component named "${name}" is unknown!`)
            }
        } else {
            this.updateAllCpnt()
        }
    }

    /**
     * 刷新所有绑定的组件
     */
    updateAllCpnt() {
        // cc.log(cc.js.getClassName(this) + ` updateAllCpnt`)

        for (const key in this._cpntUpdateCallMap) {
            this._cpntUpdateCallMap[key](this.getCpntDataByName(key))
        }
    }
}