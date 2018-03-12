(function (window, document, undefined) {
	
	'use strict';
	
	// A function to process messages received by the window.
	function receiveMessage(messageEle, e) {
		// Check to make sure that this message came from the correct domain.
		//if (e.origin !== "http://s.codepen.io")
		//	return;
		console.log(e.origin);

		// Update the div element to display the message.
		messageEle.innerHTML = "Message Received: " + e.data;
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