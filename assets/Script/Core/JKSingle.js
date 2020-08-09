export default class JKSingle {
    constructor() {
    }

    //需子类实现方法
    // constructor() {
    //     super()
    // }

    static _initInstance() {
        return new this()
    }

    static getInstance() {
        this._instance = this._instance || this._initInstance()
        return this._instance
    }
}