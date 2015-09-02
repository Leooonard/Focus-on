var hasClass = function(element, className){
	if(!element.className)
		return false
	return new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)").test(element.className)
}

alert("focus on!")
chrome.extension.sendRequest({
	greeting: "hello",
	function(response){
		alert("response")
	},
})

var conditions = [
	"kw", //baidu
	"lst-ib", //google 
]

var findSearchTextBox = function(inputs){
	for(var i = 0 ; i < inputs.length ; i++){
		var input = inputs[i]
		for(var j = 0 ; j < conditions.length ; j++){
			if(input.type === "text" && input.id === conditions[j]){
				return input
			}
		}
	}
}

var inputs = document.getElementsByTagName("input")
,	searchTextBox
,	targetKeyCode = 91 // mac下command键
,	keyDownTime = -1
,	keyDownInterval = 1000

searchTextBox = findSearchTextBox(inputs)

document.body.addEventListener("keydown", function(e){
	var key = e.which
	if(key === targetKeyCode){
		var date = new Date()	
		if(keyDownTime === -1){
			keyDownTime = date.getTime()
		}else if(date.getTime() - keyDownTime < keyDownInterval){
			if(searchTextBox){
				searchTextBox.focus()
				searchTextBox.select()
			}
			keyDownTime = -1
		}else{
			keyDownTime = date.getTime()
		}
	}
}, false)