void function(require, exports){

	var formatUrl = function(url){
		return url.split("?")[0]
	}

	var isCurrentUrlRecorded = function(url){
		url = formatUrl(url)
		if(localStorage.getItem(url) !== null){
			return true
		}else{
			return false
		}
	}

	var record = function(url){
		if(isCurrentUrlRecorded(url)){
			return false
		}
		url = formatUrl(url)
		localStorage.setItem(url, "1")
		return true
	}

	var unrecord = function(url){
		if(!isCurrentUrlRecorded(url)){
			return false
		}
		url = formatUrl(url)
		localStorage.removeItem(url)
		return true
	}

	exports.formatUrl = formatUrl
	exports.isCurrentUrlRecorded = isCurrentUrlRecorded
	exports.record = record
	exports.unrecord = unrecord

}(window, window.url)