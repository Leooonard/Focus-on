void function(require, exports){
	var util = require.util
	,	url = require.url
	,	key = require.key

	window.addEventListener("load", function(){
		chrome.tabs.query({
			currentWindow: true,
			active: true,
		}, function(tabs){
			var currentTab = tabs[0]
			,	currentUrl = currentTab.url
			currentUrl = url.formatUrl(currentUrl)

			var tempUrl
			,	tempKey
			,	tempSelector

			var inputSelector = util.q("#inputSelector")
			,	keyRecorder = util.q("#keyRecorder")
			,	urlRecorder = util.q("#urlRecorder")

			var selectingText = "正在选择目标元素，点击确定"
			,	unselectingText = "选择目标元素，点击修改"
			,	urlRecordedText = "当前域名已在规则列表内，点击删除"
			,	urlUnrecordedText = "当前域名未在规则列表内，点击添加"
			,	keyRecordedText = "当前快捷键已记录($key)，点击修改"
			,	keyUnrecordedText = "当前快捷键未记录，点击添加"

			var storedItem = localStorage.getItem(currentUrl)
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

			if(storedSelector === "selecting"){
				keyRecorder.style.display = "none"
				urlRecorder.style.display = "none"
				inputSelector.classList.add("unrecorded")
				inputSelector.textContent = selectingText
				inputSelector.addEventListener("click", function(e){
					chrome.tabs.sendMessage(currentTab.id, {
						method: "unchooseSelector"
					}, function(response){
						var selector = JSON.parse(response.selector)
						var selectorID = selector.id
						,	selectorClassName = selector.className
						console.log(response)
						if(!selectorID && !selectorClassName){
							util.alert("该目标元素无法使用，请重新选择。")
						}else{
							util.log("记录成功！该页面已支持快捷键操作。")
							inputSelector.classList.remove("unrecorded")
							inputSelector.classList.add("recorded")
							var tempObj = {}
							tempObj[storedKey] = JSON.stringify({
								id: selectorID,
								className: selectorClassName
							})
							localStorage.setItem(currentUrl, JSON.stringify(tempObj))
							chrome.tabs.sendMessage(currentTab.id, {
								method: "updateFocuson",
								state: true,
								url: currentUrl,
								keyCode: storedKey,
								selector: JSON.stringify({
									id: selectorID,
									className: selectorClassName
								})
							})
						}
					})
				}, false)
			}else if(typeof((storedSelector)) === "object"){

			}else{
				// 初始化状态
				inputSelector.style.display = "none"
				keyRecorder.style.display = "none"
				urlRecorder.classList.add("unrecorded")
				urlRecorder.textContent = urlUnrecordedText
				urlRecorder.addEventListener("click", function(e){
					/*
						记录下url的代码。（不放到localstorage中）
					*/

					tempUrl = currentUrl
					util.log("当前域名记录成功！接下去，请选择快捷键")
					urlRecorder.style.display = "none"
					keyRecorder.style.display = "block"
					keyRecorder.classList.add("unrecorded")
					keyRecorder.textContent = keyUnrecordedText
					var keyCode = -1
					,	keyDown = function(event){
							keyCode = event.which
							var keyName = key.keyName(keyCode)
							if(!!keyName){
								keyName = "选择的按键是：" + keyName
								util.log(keyName)
							}else{
								keyName = "很抱歉，当前不支持该按键。"
								util.alert(keyName)
							}
						}
					document.body.addEventListener("keydown", keyDown, false)

					keyRecorder.addEventListener("click", function(e){
						/*
							记录下key的代码。（不放到localstorage中）
						*/
						if(keyCode === -1){
							util.alert("很抱歉，您选择的快捷键当前不支持。")
							return
						}

						tempKey = keyCode
						document.body.removeEventListener("keydown", keyDown, false)
						util.log("快捷键记录成功！接下去，请选择目标内容")
						keyRecorder.style.display = "none"
						inputSelector.style.display = "block"
						inputSelector.classList.add("unrecorded")
						inputSelector.textContent = unselectingText
						inputSelector.addEventListener("click", function(e){
							/*
								把前面记得两个数据存了，selecto记为“selecting”
							*/

							var tempObj = {}
							tempObj[tempKey] = "selecting"
							localStorage.setItem(tempUrl, JSON.stringify(tempObj))
							chrome.tabs.sendMessage(currentTab.id, {
								method: "chooseSelector"
							}, function(response){})
							window.close()
						}, false)
					}, false)
				}, false)
			}

			return

			if(chrome.extension.getBackgroundPage().getSelecting()){
				inputSelector.classList.add("recorded")
				inputSelector.textContent = selectingText
			}else{
				inputSelector.classList.add("unrecorded")
				inputSelector.textContent = unselectingText
			}

			if(url.isCurrentUrlRecorded(currentUrl)){
				urlRecorder.classList.add("recorded")
				urlRecorder.textContent = recordedText
			}else{
				urlRecorder.classList.add("unrecorded")
				urlRecorder.textContent = unrecordedText
			}

			if(key.isCurrentKeyRecorded(currentUrl)){
				keyRecorder.classList.add("recorded")
				keyRecorder.textContent = keyRecordedText.replace("$key", key.currentKeyName(currentUrl))
			}else{
				keyRecorder.classList.add("unrecorded")
				keyRecorder.textContent = keyUnrecordedText
			}

			inputSelector.addEventListener("click", function(e){
				if(chrome.extension.getBackgroundPage().getSelecting()){
					chrome.tabs.sendMessage(currentTab.id, {
						method: "unchooseSelector"
					}, function(response){
						var selector = response.selector
						inputSelector.classList.remove("unrecorded")
						inputSelector.classList.add("recorded")
						inputSelector.textContent = selectingText
						util.log(selector)
					})
				}else{
					chrome.tabs.sendMessage(currentTab.id, {
						method: "chooseSelector"
					}, function(response){})
					window.close()
				}
				chrome.extension.getBackgroundPage().toggleSelecting()
			}, false)

			
			keyRecorder.addEventListener("click", function(e){
				if(keyRecording){
					document.body.removeEventListener("keydown", keyDown, false)
					if(key.valid(keyCode) && key.keyRecord(keyCode, currentUrl)){
						keyRecorder.textContent = keyRecordedText.replace("$key", key.keyName(keyCode))
						keyRecorder.classList.add("recorded")
						keyRecorder.classList.remove("unrecorded")
					}else{
						//修改失败

						if(key.isCurrentKeyRecorded(currentUrl)){
							util.alert("修改失败")
							keyRecorder.textContent = keyRecordedText.replace("$key", key.currentKeyName(currentUrl))
							keyRecorder.classList.add("recorded")
							keyRecorder.classList.remove("unrecorded")
						}else{
							keyRecorder.textContent = keyUnrecordedText
							keyRecorder.classList.remove("recorded")
							keyRecorder.classList.add("unrecorded")
						}
					}
				}else{
					document.body.addEventListener("keydown", keyDown, false)
					keyRecorder.textContent = keyRecordingText
					keyRecorder.classList.remove("recorded")
					keyRecorder.classList.add("unrecorded")
					keyCode = -1
				}
				keyRecording = !keyRecording
			}, false)

			urlRecorder.addEventListener("click", function(e){
				if(url.isCurrentUrlRecorded(currentUrl)){
					if(url.unrecord(currentUrl)){
						urlRecorder.classList.remove("recorded")
						urlRecorder.classList.add("unrecorded")
						urlRecorder.textContent = unrecordedText
					}else{
						util.alert("删除失败")
					}
				}else{
					if(url.record(currentUrl)){
						urlRecorder.classList.remove("unrecorded")
						urlRecorder.classList.add("recorded")
						urlRecorder.textContent = recordedText
					}else{
						util.alert("添加失败")
					}
				}
			}, false)

		})
	}, false)
}(window, window)