var INIT_METHOD = "getInitState"

var formatUrl = function(url){
	return url.split("?")[0]
}

var selecting = false

window.toggleSelecting = function(){
	selecting = !selecting
	return !selecting
}

window.getSelecting = function(){
	return selecting
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	var method = request.method
	,	url = formatUrl(sender.url)
	,	response = {}

	if(method === INIT_METHOD){
		var storedItem = localStorage.getItem(url)
		,	storedKey = undefined
		,	storedSelector = undefined
		if(!!storedItem){
			var tempArray = Object.keys(JSON.parse(storedItem))
			if(tempArray.length > 0){
				storedItem = JSON.parse(storedItem)
				storedKey = tempArray[0]
				storedSelector = storedItem[storedKey]
			}
		}
		if(storedItem === null){
			response = {
				state: false
			}
		}else if(storedSelector === "selecting"){
			localStorage.removeItem(url)
			response = {
				state: false
			}
		}else{
			response = {
				state: true,
				url: url,
				keyCode: storedKey,
				selector: storedSelector,
			}
		}
	}
	sendResponse(response)
})