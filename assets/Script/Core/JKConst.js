// const test = `this is a test`

// audio
// 音乐默认音量
const DefaultMusicVolume = 0.5
// 音效默认音量
const DefaultEffectVolume = 0.5

// UI
// JKUpdate 刷新间隔/毫秒
const JKUpdateDT = 50
// 按钮点击默认CD/秒
const ClickCDTime = 0.2

// game
// 游戏状态
const GameStatus = {
    // 等待
    GameWait: ``,
    // 运行
    GameRun: ``,
    // 暂停
    GamePause: ``,
}
autoFill(GameStatus)

function autoFill(obj) {
    let cnt = 0
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = cnt++
        }
    }
}

export default {
    // test,
    
    // audio
    DefaultMusicVolume,
    DefaultEffectVolume,

    // UI
    JKUpdateDT,
    ClickCDTime,

    // game
    GameStatus,
}