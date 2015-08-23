var hasClass = function(element, className){
	if(!element.className)
		return false
	return new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)").test(element.className)
}

var inputs = document.getElementsByTagName("input")
,	searchTextBox
,	targetKeyCode = 91 // mac下command键
,	keyDownTime = -1
,	keyDownInterval = 1000

Array.prototype.forEach.call(inputs, function(input){
	if(input.type === "text" && hasClass(input, "s_ipt")){
		searchTextBox = input
	}
})

document.body.addEventListener("keydown", function(e){
	var key = e.which
	if(key === targetKeyCode){
		var date = new Date()	
		if(keyDownTime === -1){
			keyDownTime = date.getTime()
		}else if(date.getTime() - keyDownTime < keyDownInterval){
			searchTextBox.focus()
			searchTextBox.select()
			keyDownTime = -1
		}else{
			keyDownTime = date.getTime()
		}
	}
}, false)