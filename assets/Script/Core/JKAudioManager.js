import JKSingle from 'JKSingle'

export default class JKAudioManager extends JKSingle {
    constructor() {
        super()
    }

    /**
     * 播放音频
     * @param {String} resUrl 音源文件名称
     * @param {Boolean} loop 是否循环
     * @param {Number} volume 音量
     * @param {Boolean} isMusic 是否为背景音乐
     */
    _play(resUrl, loop, volume, isMusic) {
        volume = volume || (isMusic ? cc.JK.JKConst.DefaultMusicVolume : cc.JK.JKConst.DefaultEffectVolume)
        this._getCatch(resUrl)
            .then((audioClip) => {
                let aid = cc.audioEngine.play(audioClip, loop, volume)
                if (isMusic) {
                    if (this._musicId) {
                        cc.audioEngine.stop(this._musicId)
                    }
                    this._musicId = aid
                }
            })
            .catch((err) => {
                cc.error(err)
            })
    }

    /**
     * 获取缓存音频
     * @param {String} resUrl 音频地址
     */
    _getCatch(resUrl) {
        let audio = this._catch[resUrl],
            p
        if (!audio) {
            p = new Promise((resolve, reject) => {
                cc.loader.loadRes(resUrl, cc.AudioClip, (err, audioClip) => {
                    if (err) {
                        reject(err)
                    } else {
                        this._catch[resUrl] = audioClip
                        resolve(audioClip)
                    }
                })
            })
        } else {
            p = new Promise((resolve, reject) => {
                resolve(audio)
            })
        }
        return p
    }

    //==============================================================

    init() {
        cc.log(cc.js.getClassName(this) + ` init`)

        this._catch = {}
        this._musicId = null
    }

    /**
     * 播放背景音乐
     * @param {String} fileName 音源文件名称
     * @param {Boolean} loop 是否循环
     * @param {Number} volume 音量
     */
    playMusic(fileName, loop, volume) {
        if (fileName + `` !== fileName) {
            cc.error(cc.js.getClassName(this) + ` playMusic's param fileName = ${fileName} is unknown`)
            return
        }
        fileName = `Audio/` + fileName
        this._play(resUrl, loop, volume, true)
    }

    /**
     * 播放音效
     * @param {String} fileName 音源文件名称
     * @param {Boolean} loop 是否循环
     * @param {Number} volume 音量
     */
    playEffect(fileName, loop, volume) {
        if (fileName + `` !== fileName) {
            cc.error(cc.js.getClassName(this) + ` playEffect's param fileName = ${fileName} is unknown`)
            return
        }
        fileName = `Audio/` + fileName
        this._play(resUrl, loop, volume, false)
    }
}