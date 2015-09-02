// 键盘处理，包括键盘事件，修改键盘。

void function(require, exports){
	var targetKeyCode = 91
	,	keyDownTime = -1
	,	keyDownInterval = 1000
	,	MAC_KEY_MAP_JSON = {
		"48":"0",
		"49":"1",
		"50":"2",
		"51":"3",
		"52":"4",
		"53":"5",
		"54":"6",
		"55":"7",
		"56":"8",
		"57":"9",
		"65":"A",
		"66":"B",
		"67":"C",
		"68":"D",
		"69":"E",
		"70":"F",
		"71":"G",
		"72":"H",
		"73":"I",
		"74":"J",
		"75":"K",
		"76":"L",
		"77":"M",
		"78":"N",
		"79":"O",
		"80":"P",
		"81":"Q",
		"82":"R",
		"83":"S",
		"84":"T",
		"85":"U",
		"86":"V",
		"87":"W",
		"88":"X",
		"89":"Y",
		"90":"Z",
		"188":",",
		"190":".",
		"191":"/",
		"16":"Shift",
		"91":"Left Command",
		"17":"Ctrl",
		"93":"Right Command",
		"18":"Alt",
		"189":"-",
		"187":"=",
		"186":";",
		"222":"'",
		"219":"[",
		"221":"]",
	}
	,	WINDOWS_KEY_MAP_JSON = {}

	var util = require.util

	var keyRecord = function(keyCode, url){
		if(localStorage.getItem(url) !== null){
			var item = localStorage.getItem(url)
			item = JSON.parse(item)
			if(typeof item !== "object"){
				var obj = {}
				obj[keyCode] = 1
				localStorage.setItem(url, JSON.stringify(obj))
			}else{
				var key = Object.keys(item)[0] //暂时只支持一个页面拥有一个快捷键
				,	val = item[key]
				delete item[key]
				item[keyCode] = val
				localStorage.setItem(url, JSON.stringify(item))
			}
			return true
		}
		return false
	}

	var keyName = function(keyCode){
		if(util.isWindows()){
			var keyName = WINDOWS_KEY_MAP_JSON[keyCode]
			if(!!keyName){
				return keyName
			}else{
				return false
			}
		}else if(util.isMacOS()){
			var keyName = MAC_KEY_MAP_JSON[keyCode]
			if(!!keyName){
				return keyName
			}else{
				return false
			}
		}else{
			return false
		}
	}

	var currentKeyName = function(url){
		if(!isCurrentKeyRecorded(url)){
			return false
		}
		var item = localStorage.getItem(url)
		item = JSON.parse(item)
		return keyName(Object.keys(item)[0].toString())
	}

	var isCurrentKeyRecorded = function(url){
		var item = localStorage.getItem(url)
		item = JSON.parse(item)
		return item !== null && typeof item === "object"
	}

	var valid = function(keyCode){
		if(util.isWindows()){
			return WINDOWS_KEY_MAP_JSON[keyCode.toString()] !== undefined
		}else if(util.isMacOS()){
			return MAC_KEY_MAP_JSON[keyCode.toString()] !== undefined
		}else{
			return false
		}
	}

	exports.keyRecord = keyRecord
	exports.keyName = keyName
	exports.currentKeyName = currentKeyName
	exports.isCurrentKeyRecorded = isCurrentKeyRecorded
	exports.valid = valid

}(window, window.key)