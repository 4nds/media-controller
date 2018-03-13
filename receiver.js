(function (window, document, undefined) {
	
	'use strict';
	var id, parent_url;
	
	class Communicator {
		
		constructor(type) {
			//type can be: 'parent', 'iframe' or 'both'
			if (type == 'parent' || type == 'iframe' || type == 'both')	{
				this.type = type;	
			} else {
				console.log('Wrong type for Communicator class, argument type must be "parent", "iframe" or "both".');
			}
			this.is_child = this.type == 'child' || this.type == 'both';
			this.is_parent = this.type == 'parent' || this.type == 'both';
			//this.id = '';
			//this.parent_url = '';
			//this.iframe_elements;
			this.iframes = [];
			this.response = [];
			this.response_types = []; 
			this.functions = [];
			this.function_tasks = [];
			this.tasks = [];
		}
		
		sendMessageToIframe_internal(id, task, data) {
			if (data === undefined) { data = [] };
			this.iframes[id].contentWindow.postMessage({'sender': 'parent', 'reciever_id': id,
				'task': task, 'data': data}, this.iframes[id].src);
		}
		
		sendMessageToIframe(id, task, data) {
			if (this.is_parent) {
				this.response.push({key: task, value: []});
				this.response_types.push({key: task, value: 'single'})
				this.tasks.push({key: task, value: []});
				this.sendMessageToIframe_internal(id, task, data);
			}
		}
		
		sendMessageToAllIframes(task, data) {
			if (this.is_parent) {
				this.response.push({key: task, value: []});
				this.response_types.push({key: task, value: 'all'})
				this.tasks.push({key: task, value: []});
				for (id in this.iframes) {
					this.sendMessageToIframe_internal(id, task, data);
				}
			}
		}
		
		sendMessageToParent(task, data) {
			if (this.is_child) {
				if (data === undefined) { data = [] };
				window.parent.postMessage({'sender': 'child', 'sender_id': this.id,
					'task': task, 'data': data}, this.parent_url);
			}
		}
			
		receiveMessageFromParent(message) {
			if (this.is_child) {
				if (message["task"] == 'setup') {
					this.id = message["reciever_id"];
					this.parent_url = message['data']['url'];
					sendMessageToParent(message["task"]);
				} else if (id == message["reciever_id"]) {
					switch (message["task"]) {
						case 'find_videos':
							day = "Monday";
							break;
					}
				}
			}
		}
		
		receiveMessageFromChild(message) {
			
			var call_functions = function(task) {
				let functions = this.tasks[task];
				for (let i=0; i<functions.length; i++) {
					let function_number = functions[i];
					let index = this.function_tasks[function_number].indexOf(task);
					if (index > -1) {
						this.function_tasks[function_number].splice(index, 1);
					}
					if (this.function_tasks[function_number].length == 0) {
						this.functions[function_number](this.response);
					}
				}
			}
			
			if (this.is_parent) {
				let task = message['task'];
				this.response[task].push({key: message['sender_id'], value: data});
				if (this.response_types['task'] == 'all') {
					if (this.response[task].length == this.iframes.length) {
						call_functions(task);
					}
				} else if (this.response_types['task'] == 'single') {
					call_functions(task);
				}
			}
		}
		
		receiveMessage(e) {
			let message = e.data;
			switch (message["sender"]) {
				case 'parent':
					this.receiveMessageFromParent(message);
					break;
				case 'child':
					this.receiveMessageFromChild(message);
					break;
			}		
		}
		
		initialize() {
			if (this.is_parent) {
				this.iframe_elements = document.getElementsByTagName('iframe');
				if (iframe_elements.length) {
					for (let i=0; i<iframe_elements.length; i++) {
						let iframe = iframe_elements[i];
						if (iframe.src !== "") {
							let iframe_id = 'iframe_id_' + i.toString();
							console.log('iframe_id:',iframe_id);
							this.iframes.push({key: iframe_id, value: iframe});
						}
					}
					this.sendMessageToAllIframes('setup', {'url': window.location.href});
				}
			}
			window.addEventListener('message', this.receiveMessage);
		}
		
		call(f, tasks) {	// call functions after tasks have finished and response is sent form iframe, if task is ommited function is called after initialization
			
			var addTask = function(task) {
				if (this.tasks.includes(task)) {
					this.tasks[task].push(this.functions.length-1);
				} else {
					this.tasks['setup'].push(this.functions.length-1);
				}
			}
		
			this.functions.push(f);
			if (variable.constructor === Array) {
				this.function_tasks.push(tasks);
				for (let i=0; i<tasks.length; i++) {
					addTask(tasks[i]);
				}
			} else {
				let task = tasks;
				this.function_tasks.push([task]);
				addTask(task);	
			}
		}
		
		
	}
	
	/*
	function sendMessageToParent(task, data) {
		if (data === undefined) { data = [] };
		window.parent.postMessage({'sender': 'child', 'sender_id': id,
			'task': task, 'data': data}, parent_url);
	}
	
	function receiveMessageFromParent(message) {
		if (message["task"] == 'setup') {
			id = message["reciever_id"];
			parent_url = message['data']['url'];
		} else if (id == message["reciever_id"]) {
			switch (message["task"]) {
				case 'find_videos':
					day = "Monday";
					break;
			}
		}
		sendMessageToParent(message["task"]);
	}
	
	function receiveMessageFromChild(message) {
		
	}
	
	function receiveMessage(e) {
		let message = e.data;
		switch (message["sender"]) {
			case 'parent':
				receiveMessageFromParent(message);
				break;
			case 'child':
				receiveMessageFromChild(message);
				break;
		}		
	}
	*/

	function main() {
		var messageEle = document.getElementById('message');
		console.log('Working script.')
		
		
		var c = new Communicator('both');
		
		
		//window.addEventListener('message', receiveMessage);
	}

	window.addEventListener('load', main, false);

})(window, document);