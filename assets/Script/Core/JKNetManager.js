import JKSingle from 'JKSingle'

export default class JKNetManager extends JKSingle {
    constructor() {
        super()
    }

    //============================================================================

    //初始化网络管理器
    init(){
        cc.log(cc.js.getClassName(this) + ` init`)
    }
}