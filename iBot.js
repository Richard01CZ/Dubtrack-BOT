var isIBotRunning;
if(!isIBotRunning) {
	if (typeof Array.prototype.indexOf !== "function") {
	    Array.prototype.indexOf = function (item) {
	        for(var i = 0; i < this.length; i++) {
	            if (this[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    };
	};
	if(typeof String.prototype.replaceAll !== "function") {
		String.prototype.replaceAll = function(oldString, newString) {
			var theStr = this;
			var index = theStr.indexOf(oldString);
			while(index != -1) {
				theStr = theStr.replace(oldString, newString);
				index = theStr.indexOf(oldString);
			}
			return theStr;
		};
	};
	// Plug.DJ Ported API for Dubtrack.FM
	API = {
		getDJ: function() {
			return Dubtrack.room.player.activeSong.attributes.user.attributes.username;
		},
		getMedia: function() {
			return Dubtrack.room.player.activeSong.attributes.songInfo.name;
		},
		getRole: function(User) {
			if(User.attributes.roleid != null) {
				var type = User.attributes.roleid.type.toLowerCase();
				switch(type) {
				case "dj":
					return "DJ";
					break;
				case "vip":
					return "VIP";
					break;
				case "mod":
					return "Moderator";
					break;
				case "manager":
					return "Manager";
					break;
				case "co-owner":
					return "Co-Owner (or Owner)";
					break;
				}
			} else {
				return "Role not found! (Most likely means default user)";
			}
		},
		chatLog: function(msg) {
			Dubtrack.room.chat._messagesEl.append("<li class='chat-system-loading system-error'>" + msg + "</li>");
			document.getElementsByClassName("chat-main")[0].scrollIntoView(false);
		},
		sendChat: function(msg) {
			$("#chat-txt-message").val(msg);
			Dubtrack.room.chat.sendMessage();
		},
		setVolume: function(value) {
			Dubtrack.playerController.setVolume(value);
		},
		CHAT: "realtime:chat-message",
		ADVANCE: "realtime:room_playlist-update",
		USER_JOIN: "realtime:user-join",
		USER_LEAVE: "realtime:user-leave",
		on: function(theEvent, theFunc) {
			Dubtrack.Events.bind(theEvent, theFunc);
		},
		off: function(theEvent, theFunc) {
			Dubtrack.Events.unbind(theEvent, theFunc);
		}
	};
	// Custom stuff
	IBot = {
		iBot: "iBot v1.0.0",
		Tools: {
			lookForUser: function(username) {
				var found = false;
				for(var i = 0; i < Dubtrack.room.users.collection.length; i++) {
					if(username.toLowerCase() == Dubtrack.room.users.collection.at(i).attributes._user.username.toLowerCase()) {
						found = true;
					}
				}
				if(found) {
					return true;
				} else {
					return false;
				}
			}
		}
	};
	function userJoinMsg(data) {
		API.sendChat(":wave: Welcome/Welcome back to the room @" + data.user.username + "! :wave:");
	}
	function userLeaveMsg(data) {
		API.sendChat(":wave: Goodbye @" + data.user.username + "! :wave:");
	}
	function commandHandler(data) {
		var msg = data.message;
		var user = data.user.username;
		var userId = data.user._id;
		
		if(msg.substring(0, 1) == "!") {
			var cmd = msg.substring(1);
			if(cmd.startsWith("cookie")) {
				var UN = cmd.substring(8);
				if(UN != "") {
					if(IBot.Tools.lookForUser(UN)) {
						API.sendChat(":cookie: *hands @" + UN + " a cookie, a note on it reads 'With love, from @" + user + "'* :cookie:");
					} else {
						API.sendChat(":x: User not found! :x:");
					}
				} else {
					API.sendChat(":cookie: *hands you a cookie (for @" + user + ")* :cookie:");
				}
			} else {
				switch (cmd) {
				case "help":
					API.sendChat(IBot.iBot + " user commands: help, cookie @{User}, dj, song, list, autodub");
					break;
				case "dj":
					API.sendChat("Current DJ: @" + API.getDJ() + "!");
					break;
				case "song":
					API.sendChat("Current Song: " + API.getMedia() + "!");
					break;
				case "autodub":
					API.sendChat("Recommended Dubtrack.FM Extensions: iWoot: http://xxskhxx.comoj.com/tools.php, MikuPlugin: http://mikuplugin.me, and/or DubX: https://dubx.net");
					break;
				default:
					API.sendChat("Command: " + cmd + ", was not found!");
					break;
				}
			}
		}
	}
	function nextSongMsg() {
		API.sendChat(":musical_note: Now playing: " + API.getMedia() + "! DJ: " + API.getDJ() + ":musical_note:");
	}
	function connectAPI() {
		API.on(API.CHAT, commandHandler);
		API.on(API.USER_JOIN, userJoinMsg);
		API.on(API.USER_LEAVE, userLeaveMsg);
		/*
		* Leaving commented until I can fix the double sending problem
		* API.on(API.ADVANCE, nextSongMsg);
		*/
	}
	// Just like iWoot, CONNECT EVERYTHING!
	function startUp() {
		connectAPI();
		document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
		isIBotRunning = true;
		API.sendChat(IBot.iBot + " Started!");
	}
	startUp();
} else {
	Dubtrack.helpers.displayError("Error!", "iBot is already running!");
}
