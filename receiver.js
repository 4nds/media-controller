(function (window, document, undefined) {
	
	'use strict';
	
	class ArrayDict extends Array {
		
		update(key, value) {
			if (key in this) {
				this[key].push(value);
			} else {
				this[key] = [value];
			}
		}
		
	}
	
	
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
			this.iframes = [];
			this.response = [];
			this.response_types = []; 
			this.functions = [];
			this.function_tasks = [];
			this.tasks = [];
			this.callbacks = new ArrayDict();
		}
		
		sendMessageToIframe_internal(id, task, data = []) {
			this.iframes[id].contentWindow.postMessage({'sender': 'parent', 'reciever_id': id,
				'task': task, 'data': data}, this.iframes[id].src);
		}
		
		sendMessageToIframe(id, task, data) {
			if (this.is_parent) {
				this.response[task] = [];
				this.response_types[task] = 'single';
				this.tasks[task] = [];
				this.sendMessageToIframe_internal(id, task, data);
			}
		}
		
		sendMessageToAllIframes(task, data) {
			if (this.is_parent) {
				this.response[task] = [];
				this.response_types[task] = 'all';
				this.tasks[task] = [];
				for (let id in this.iframes) {
					this.sendMessageToIframe_internal(id, task, data);
				}
			}
		}
		
		sendMessageToParent(task, data = []) {
			if (this.is_child) {
				window.parent.postMessage({'sender': 'child', 'sender_id': this.id,
					'task': task, 'data': data}, this.parent_url);
			}
		}
			
		receiveMessageFromParent(message) {
			if (this.is_child) {
				let task = message['task'];
				if (task == 'setup') {
					this.id = message["reciever_id"];
					this.parent_url = message['data']['url'];
					sendMessageToParent(task);
				} else if (id == message["reciever_id"]) {
					let callbacks = this.callbacks[task]
					for (let i=0; i<callbacks.length; i++) {
						let callback = callbacks[i];
						callback();	
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
				this.response[task][message['sender_id']] = data
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
			console.log('receiveMessageFromParent1:', this.receiveMessageFromParent);
			switch (message["sender"]) {
				case 'parent':
					console.log('receiveMessageFromParent2:', this.receiveMessageFromParent);
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
				if (this.iframe_elements.length) {
					for (let i=0; i<this.iframe_elements.length; i++) {
						let iframe = this.iframe_elements[i];
						if (iframe.src !== "") {
							let iframe_id = 'iframe_id_' + i.toString();
							this.iframes[iframe_id] = iframe;
						}
					}
					this.sendMessageToAllIframes('setup', {'url': window.location.href});
				}
			}
			window.addEventListener('message', this.receiveMessage);
		}
		
		add_function(f, tasks) {	// call functions after tasks have finished and response is sent form iframe, if task is ommited function is called after initialization
			
			var this_ = this;
			
			var addTask = function(task) {
				if (this_.tasks.includes(task)) {
					this_.tasks[task].push(this_.functions.length-1);
				} else {
					this_.tasks['setup'].push(this_.functions.length-1);
				}
			}
		
			this.functions.push(f);
			if (tasks.constructor === Array) {
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
		
		add_callback(f, task) {	// call callback functions after task has been initialized
			this.callbacks.update(task, f);	
		}
		
		
	}
		



	function main() {
		var messageEle = document.getElementById('message');
		console.log('Working script.')
		
		function show(response) {
			messageEle.innerHTML = 'message: ' + response['send_message']['data']['text'];
		}
		
		
		var c = new Communicator('both');
		c.initialize();
		c.add_callback(show, 'send_message');
		
		//window.addEventListener('message', receiveMessage);
	}

	window.addEventListener('load', main, false);

})(window, document);