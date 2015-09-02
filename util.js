//一些通用的方法

void function(require, exports){

	var q = function(selector){
		return document.querySelector(selector)
	}

	var qa = function(selector){
		return document.querySelectorAll(selector)
	}

	var alertTime = 1000 //警告显示时间。
	var alertRemoveTime = 500 //警告消失动画时间。
	var alertID = "Container" //警告dom id。
	var alert = function(content){
		if(document.body.firstChild.id === alertID){
			document.body.firstChild.remove()
		}

		var alertContainer = document.createElement("div")
		alertContainer.id = alertID
		alertContainer.classList.add("alert")
		alertContainer.textContent = content
		document.body.insertBefore(alertContainer, document.body.firstChild)

		setTimeout(function(){
			alertContainer.style.opacity = "0"
			setTimeout(function(){
				alertContainer.remove()
			}, alertRemoveTime)
		}, alertTime)
	}

	var logTime = 1000
	,	logRemoveTime = 500
	,	logID = "Container"
	var log = function(content){
		if(document.body.firstChild.id === logID){
			document.body.firstChild.remove()
		}

		var logContainer = document.createElement("div")
		logContainer.id = logID
		logContainer.classList.add("log")
		logContainer.textContent = content
		document.body.insertBefore(logContainer, document.body.firstChild)

		setTimeout(function(){
			logContainer.style.opacity = "0"
			setTimeout(function(){
				logContainer.remove()
			}, logRemoveTime)
		}, logTime)
	}

	var isWindows = function(){
		var regex = /Windows/i
		return regex.test(window.navigator.userAgent)
	}

	var isMacOS = function(){
		var regex = /Macintosh/i
		return regex.test(window.navigator.userAgent)
	}

	exports.q = q
	exports.qa = qa
	exports.alert = alert
	exports.log = log
	exports.isWindows = isWindows
	exports.isMacOS = isMacOS

}(window, window.util)