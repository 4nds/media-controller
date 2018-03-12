(function (window, document, undefined) {
	
	'use strict';
	var id;
	
	//window.parent.postMessage();
	//({'id': id, 'task': task}, iframe.src)
	console.log(window.parent);
	
	function receiveMessage(messageEle, e) {
		let message = e.data;
		if (message["task"] == 'setup_id') {
			id = message["id"];
		} else if (id == message["id"]) {
			switch (message["task"]) {
				case 'find_videos':
					day = "Monday";
					break;
			}
		}
				
	}
	

	function main() {
		// Get a reference to the <div> on the page that will display the message text.
		var messageEle = document.getElementById('message');
		console.log('Working script.')
		// Setup an event listener that calls receiveMessage() when the window receives a new MessageEvent.
		window.addEventListener('message', receiveMessage.bind(null, messageEle));
		
		
		return;
	}

	window.addEventListener('load', main, false);

})(window, document);