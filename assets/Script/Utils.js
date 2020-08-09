// function test() {
    // cc.log(`this is a test`)
// }

/**
 * 是否为无效的空数值 "",null,undefined,[],{},NaN
 * @param {*} value 要判断的值
 * @return {Boolean}
*/
function isInvalidValue(value) {
    let isInvalid = false

    if (!value) { // "",null,undefined,NaN
        isInvalid = true
    } else if (!value.length) { // []
        isInvalid = true
    } else if (value.length == 0) { // []
        isInvalid = true
    } else if ($.isEmptyObject(value)) { // Object 普通对象使用 for...in 判断，有 key 即为 false
        isInvalid = true
    }

    return isInvalid
}

/**
 * 拷贝对象，只拷贝一层
 * @param {Object} obj 待拷贝的对象
 * @return {Object} obj 拷贝的新对象
 */
function copyObj(obj) {
    // cc.log('Utils copyObj')

    let newObj = null
    if (obj) {
        let type = Object.prototype.toString.call(obj);
        if (type == '[object Array]') {
            newObj = []
            obj.forEach(element => {
                newObj.push(element)
            })
        } else if (type == '[object Object]') {
            if (obj.hasOwnProperty) {
                newObj = {}
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const element = obj[key]
                        newObj[key] = element
                    }
                }
            } else {
                newObj = cc.js.createMap()
                cc.js.mixin(newObj, obj)
            }
        } else {
            newObj = obj
        }
    } else {
        newObj = obj
    }

    return newObj
}

/**
 * 给数字加上','
 * @param {*} num 需要转换的数字
 * @param {*} dividenum 每隔几位分割一次 ex:1,000  3位 / 10,00  2位  
 */
function changeNumToStr(num, dividenum) {
    var str = "" + num;
    var retstr = "";
    var index = str.indexOf(".", 0);
    let fspos = str.indexOf("-", 0);
    if (fspos > -1) {
        retstr += '-';
    }
    if (index > 0) {
        let strend = str.substr(index + 1, 2);
        let length = index;
        let beginpos = 0;
        if (fspos > -1) {
            beginpos = 1;
            length--;
        }
        let fenduan = parseInt(length / dividenum);
        if (length % dividenum != 0) {
            fenduan++;
        }
        let endpos = dividenum - (fenduan * dividenum - length);
        for (var i = 0; i < fenduan; ++i) {
            if (i < fenduan - 1) {
                retstr += str.substr(beginpos, endpos) + ",";
            } else {
                retstr += str.substr(beginpos, endpos)
            }
            beginpos += endpos;
            endpos = dividenum;
        }
        retstr += "." + strend;
    } else {
        let length = str.length;
        let beginpos = 0;
        if (fspos > -1) {
            beginpos = 1;
            length--;
        }
        let fenduan = parseInt(length / dividenum);
        if (length % dividenum != 0) {
            fenduan++;
        }
        let endpos = dividenum - (fenduan * dividenum - length);
        for (let i = 0; i < fenduan; ++i) {
            if (i < fenduan - 1) {
                retstr += str.substr(beginpos, endpos) + ",";
            } else {
                retstr += str.substr(beginpos, endpos)
            }
            beginpos += endpos;
            endpos = dividenum;
        }
        retstr += "";
    }
    return retstr;
}

/**
* 数字转整数 如 100000 转为10万
* @param {需要转化的数} num 
* @param {需要保留的小数位数} point 
*/
function transNumber(num, point) {
    let numStr = num.toString()
    // 十万以内直接返回
    if (numStr.length < 6) {
        return numStr;
    }
    //大于8位数是亿
    else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
    }
    //大于6位数是十万 (以10W分割 10W以下全部显示)
    else if (numStr.length > 5) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
    }
}

/**
 * 格式化整数
 * @param {Number} str 文本
 */
function formatInt(...params) {
    var as = [].slice.call(arguments),
        fmt = as.shift(),
        i = 0
    return fmt.replace(/%(\w)?(\d)?([dfsx])/ig, function (_, a, b, c) {
        var s = b ? new Array(b - 0 + 1).join(a || '') : ''
        if (c == 'd') s += parseInt(as[i++])
        return b ? s.slice(b * -1) : s
    })
}

export default {
    // test,
    isInvalidValue,
    copyObj,
    changeNumToStr,
    transNumber,
    formatInt,
}