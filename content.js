//3件事，拿一次初始数据。监听keydown。监听extension发来的改动。

var STOP_METHOD = "stopFocuson"
,	UPDATE_METHOD = "updateFocuson"
,	SELECTOR_METHOD = "chooseSelector"
,	UNSELECTOR_METHOD = "unchooseSelector"


var targetKeyCode
,	keyDownInterval = 1000
,	targetElement

var focus = function(){
	try{
		if(!!targetElement){
			targetElement.focus()
			targetElement.select()
		}
	}catch(e){}
}

var findElement = function(elementFeature){
	var element
	if(!!elementFeature.id){
		element = document.getElementById(elementFeature.id)
		if(!!element){
			return element
		}
	}

	if(!!elementFeature.className){
		//把className中的第一个类名拿出来
		var firstClassName = (elementFeature.className.split(" ")[0]).trim()
		var backupElements = document.querySelectorAll("." + firstClassName)
		for(var i = 0 ; i < backupElements.length ; i++){
			if(backupElements[i].className === elementFeature.className){
				return backupElements[i]
			}
		}
	}

	return null
}

var getSelector = function(element){
	element = element || {}
	var selector = {
		id: element.id,
		className: element.className,
	}

	return JSON.stringify(selector)
}

var keyDownTime = -1
var keyDown = function(event){ 
	var keyCode = event.which
	if(keyCode === targetKeyCode){
		var date = new Date()	
		if(keyDownTime === -1){
			keyDownTime = date.getTime()
		}else if(date.getTime() - keyDownTime < keyDownInterval){
			focus()
			keyDownTime = -1
		}else{
			keyDownTime = date.getTime()
		}
	}
}

var lastTarget
var choose = function(event){
	if(!!lastTarget){
		lastTarget.style.borderStyle = "none"
	}
	var target = event.target
	target.style.borderWidth = "2px"
	target.style.borderColor = "red"
	target.style.borderStyle = "solid"
	lastTarget = target
	event.preventDefault()
}

chrome.extension.sendMessage({
	method: "getInitState"
}, function(response){
	response = response || {}
	var state = response.state
	,	url = response.url
	,	keyCode = response.keyCode
	,	selector = response.selector

	if(!!state){
		//有初始状态，需要监听keydown。
		targetKeyCode = parseInt(keyCode)
		targetElement = findElement(JSON.parse(selector))
		document.body.addEventListener("keydown", keyDown, false)
	}
})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	var method = request.method
	if(method === STOP_METHOD){
		document.removeElementListener("keydown", keyDown, false)
	}else if(method === UPDATE_METHOD){
		var state = request.state
		,	url = request.url
		,	keyCode = request.keyCode
		,	selector = request.selector

		if(!!state){
			//有初始状态，需要监听keydown。
			targetKeyCode = parseInt(keyCode)
			targetElement = findElement(JSON.parse(selector))
			document.body.removeEventListener("keydown", keyDown, false)
			document.body.addEventListener("keydown", keyDown, false)
		}
	}else if(method === SELECTOR_METHOD){
		[].forEach.call(document.querySelectorAll("input"), function(input){
			if(input.type === "text"){
				input.addEventListener("focus", choose, false)
			}
		})
		document.body.addEventListener("click", choose, false)
	}else if(method === UNSELECTOR_METHOD){
		;[].forEach.call(document.querySelectorAll("input"), function(input){
			if(input.type === "text"){
				input.removeEventListener("focus", choose, false)
			}
		})
		document.body.removeEventListener("click", choose, false)
		lastTarget.style.borderStyle = "none"

		var response = {}
		response.selector = getSelector(lastTarget)
		sendResponse(response)
	}
})
