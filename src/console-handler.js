const chars = require('./console-logs-0.json');
const chatlogs = require('./console-logs-1.json');
const profile_names = ['redacted0', 'bin', 'ashley', 'thwomp', 'mc', 'unknown0', 'poochy', 'stu', 'redacted1', 'wendy', 'redacted2', 'jimmy', 'unknown1', 'spike', 'dry', 'redacted3', 'gooigi']
const lognames =['message0', 'message1', 'message2', 'message3', 'message4', 'message5', 'message6', 'message7', 'message8', 'message9', 'message10'];

const flatbuffers = require('flatbuffers');
const pengu = require('./SaveSchema.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = (client) => {

	client.consoleHandler = (message) => {
		let channel = message.channel;
		let content = message.content;
		const user = message.author;
		const file = message.attachments.first()?.url;
		
		if (client.config.inUse) { //Only one input into console at a time
			message.delete();
			return;
		}
		
		client.config.inUse = true;
		channel.bulkDelete((client.consoleVars.get("state") == 2 || client.consoleVars.get("state") == 6) ? 1 : 2);
		
		let userAlignment = client.marioOrWario(message); 
		let key = userAlignment.team + 'Caps';
		
		if(content.toUpperCase() == 'RESET') {
			client.consoleVars.set('state', 0);
			client.config.inUse = false;
			return channel.send("```PLEASE LOG IN TO ACCESS CONSOLE```");
		}
		
		switch(client.consoleVars.get('state')) {
			case 0:
  				if (content.toUpperCase() == 'STARBEANS') {
  					channel.send("```LOGIN SUCCESSFUL```");
  					setTimeout(() => {
  						channel.bulkDelete(1);
  						channel.send("```WELCOME, ADMIN_SFM_009```");
  						setTimeout(() => { 
  							channel.bulkDelete(1);
  							
  							
  							channel.send('```LOADING INTO DIRECTORY /SYS_MAIN/PROFILES/R/ROLE_T/CASUALTIES```');
  							
  							
  							
  							setTimeout(() => { 
  								channel.bulkDelete(1);
  								
  								//Building file directory message
  								let msg = "```PLEASE SELECT A FILE TO READ";
  								for(const char of profile_names)
  									msg += "\n- " + chars[char].file;
  								msg+= "```";
  								channel.send(msg);
  								
  								client.config.inUse = false;
  							}, 5000);
  						}, 5000);
  					}, 5000);
  					client.consoleVars.inc('state');
  				}
  			else if (content.toUpperCase() == 'CHAMELEON') {
  				channel.send("```LOGIN SUCCESSFUL```");
  					setTimeout(() => {
  						channel.bulkDelete(1);
  						channel.send("```WELCOME, PENGUIN_SO_EPIC```");
  						setTimeout(() => {
  							channel.bulkDelete(1);
  							channel.send("```LOADING INTO DIRECTORY /SUPER-FAMICOM/PICROSS/SECRETS```");
  							setTimeout(() => {
  								channel.bulkDelete(1);
  								channel.send("```TRANSMITTING FILES TO LOCAL SERVER...```");
  								setTimeout(() => {
  									channel.bulkDelete(1);
  									message.guild.channels.cache.get(userAlignment.channel_id).send("https://imgur.com/a/LBG05uh");
  									setTimeout(() => {
  										message.guild.channels.cache.get(userAlignment.other_channel_id).send("Looks like the other team has found a great discovery regarding the console... A spy was able to get you that information though, take a look! https://imgur.com/a/LBG05uh");
  									}, 7200000);
  									channel.send("```AUTO-LOG OUT INITIATED...```");
  									setTimeout(() => {
  										channel.bulkDelete(1);
  										channel.send("```PLEASE LOG IN TO ACCESS CONSOLE```");
  										client.config.inUse = false;
  									}, 5000);
  								}, 3000);
  							}, 3000);
  						}, 3000);
  						
  					}, 3000);
  			}
  			else if (content.toUpperCase() == 'BOTTLECAPS') {
  					channel.send("```LOGIN SUCCESSFUL```");
  					setTimeout(() => {
  						channel.bulkDelete(1);
  						channel.send("```WELCOME, NEW_USER_03```");
  						setTimeout(() => {
  							channel.bulkDelete(1);
  							channel.send("```LOADING INTO DIRECTORY /SYS-MAIN/TOP-SECRET/PROJECT-WARPPIPE/XTML-32```");
  							setTimeout(() => {
  								channel.bulkDelete(1);
  								channel.send("```SYSTEM TRAP IDENTIFIED! RUNNING BOTTLECAPS.EXE```");
  								setTimeout(() => {
  									channel.bulkDelete(1);
  									channel.send("```SUBMIT BOTTLECAP FILE```");
  									client.consoleVars.set('state', 3);
									client.config.inUse = false;
  								}, 3000);
  							}, 3000);
  						}, 3000);
  						
  					}, 3000);
  			}
  			else {
  					channel.send("```INVALID LOGIN```");
  					setTimeout(() => {
  						channel.bulkDelete(1);
  						channel.send("```PLEASE LOG IN TO ACCESS CONSOLE```");
  						client.config.inUse = false;
  					}, 5000);
  			}
  			break;
  			case 1:
  				let prof;
  				for(const char of profile_names) {
  					console.log(chars[char]);
  					if (chars[char].file == content.toUpperCase()) {
  						prof = chars[char];
  						break;
  					}
  				}
  			
  				if (! prof) {
  					channel.send("```INVALID FILE```");
  						setTimeout(() => { 
  							channel.bulkDelete(1);
  						
  							//Building file directory message
  							let msg = "```PLEASE SELECT A FILE TO READ";
  							for(const char of profile_names)
  								msg += "\n- " + chars[char].file;
  							msg+= "```";
  							channel.send(msg);
  							client.config.inUse = false;
  						}, 5000);
  				}
  				else {
					 channel.send("```LOADING . . .```"); 		
					 
					 setTimeout(() => { 
  							channel.bulkDelete(1);
  						
  							//Building file directory message
  							channel.send(`\`\`\`READING: ${prof.file}\n\n--- CASE PORTFOLIO: ${prof.name} ---\nAGE: ${prof.age}\nNOTES: ${prof.desc}\nSTATUS: ${prof.status}\n\nENTER 'BACK' TO RETURN TO DIRECTORY WHEN YOU ARE FINISHED READING\`\`\``);
  							client.consoleVars.inc('state');
  							client.config.inUse = false;
  						}, 5000);
  								
  				}
  				
  				
  				break;
  			case 2:
  				if (content.toUpperCase() == "BACK") {
  					channel.bulkDelete(2);
  							
  					//Building file directory message
  					let msg = "```PLEASE SELECT A FILE TO READ";
  					for(const char of profile_names)
  						msg += "\n- " + chars[char].file;
  					msg+= "```";
  					channel.send(msg);
  							
  					client.consoleVars.set('state', 1);
  					
  				}
  				client.config.inUse = false;
  				break;
			case 3:
				if (!file) {
   				channel.send("```NO BOTTLECAP FILE ENTERED```");
   				
   				setTimeout(() => { 
  						channel.bulkDelete(1);
  								
  						//Building file directory message
  						channel.send("```SUBMIT BOTTLECAP FILE```");
  								
  						client.config.inUse = false;
  					}, 3000);
   			}
   			else {
   				channel.send("```PROCESSING FILE . . .```");
   				try {
   					fetch(file)
    					.then(fileProm => {
    					    const dest = fs.createWriteStream('/home/pi/BattleBot/commands/roles/save_maybe.pgs');
    					    fileProm.body.pipe(dest);
    					}); 
   
   				setTimeout(() => { 
   					var data = new Uint8Array(fs.readFileSync('/home/pi/BattleBot/commands/roles/save_maybe.pgs'));
   					var buf = new flatbuffers.ByteBuffer(data);
	
						console.log(buf);
						var inventory = pengu.PenguinSaveData.getRootAsPenguinSaveData(buf).inventory();
						if (! inventory) {
							channel.bulkDelete(1);
							channel.send("```INVALID BOTTLECAP FILE ENTERED```");
							setTimeout(() => { 
  								channel.bulkDelete(1);
  								
  								//Building file directory message
  								channel.send("```SUBMIT BOTTLECAP FILE```");
  								
  								client.config.inUse = false;
  							}, 3000);
						}
						else {
	
						let bottleCount = 0;
	
						for (let i = 0; i < inventory.collectablesLength(); i++) {
							for (let j = 0; j < inventory.collectables(i).collectablesLength(); j++) {
								if (inventory.collectables(i).collectables(j).collectableGuid() == 'ea558f74ad0aa844da782f86d7b8e5df')
									bottleCount += inventory.collectables(i).collectables(0).collectablesLength();
							}	
						}
						let prev_caps = client.consoleVars.get('cappedUsers').filter((element) => element.id == user.id).reduce((a, b) => Math.max(a, b.caps), 0);
						if (prev_caps != null)
							bottleCount -= prev_caps;
						if (bottleCount <= 0) {
							channel.bulkDelete(1);
							channel.send("```ERROR! NO NEW CAPS FOUND TO RECYCLE.```");
							setTimeout(() => { 
  								channel.bulkDelete(1);
  								channel.send("```SUBMIT BOTTLECAP FILE```");
  								
  								client.config.inUse = false;
  							}, 3000);
						}
						else {
							client.consoleVars.math(key, "+", bottleCount);
							channel.bulkDelete(1);
							channel.send(`\`\`\`${bottleCount} CAPS INSERTED. THANK YOU FOR YOUR COMMITMENT TO RECYCLING!\`\`\``);
							client.consoleVars.push('cappedUsers', {id: user.id, caps: bottleCount + prev_caps});
							setTimeout(() => { 
								if (client.consoleVars.get(key) < userAlignment.tot_caps) {
									channel.bulkDelete(1);
									channel.send(`\`\`\`${client.consoleVars.get(key)}/${userAlignment.tot_caps} CAPS TO REACH GOAL\`\`\``);
									setTimeout(() => { 
  										channel.bulkDelete(1);
  										channel.send("```SUBMIT BOTTLECAP FILE```");
  								
  										client.config.inUse = false;
  									}, 3000);
								}
								else {
									channel.bulkDelete(1);
									channel.send("```RECYCLING GOAL REACHED!!! THE CORK AND CASK FOUNDATION IS FOREVER IN YOUR GRATITUDE!```");
									setTimeout(() => { 
  										channel.bulkDelete(1);
  										channel.send("```RETROFIT OVERRIDE... TRANSMITTING COORDINATES FOR THE SECRET OF THE 1-UP PIECE...```");
  										
  										setTimeout(() => { 
  											channel.bulkDelete(1);
  											channel.send("```PLEASE EXIT YOUR TERMINAL IMMEDIATELY. DEFINITELY DO NOT EXPLORE FILES WITH THE 'EXPLORE' COMMAND```");
  											client.consoleVars.inc('state');
											client.config.inUse = false;
  										}, 3000);
  									}, 3000);
								}
							}, 3000);
						}
						}
						}, 8000);
					} catch(error) {
						console.log(error);
    					channel.send("```INVALID BOTTLECAP FILE ENTERED```");
							setTimeout(() => { 
  								channel.bulkDelete(1);
  								
  								//Building file directory message
  								channel.send("```SUBMIT BOTTLECAP FILE```");
  								
  								client.config.inUse = false;
  							}, 3000);
    				}
				}
				break;
				
			case 4:
				if(content.toUpperCase() != 'EXPLORE')
					client.config.inUse = false;
				else {
					channel.send("```LOADING INTO DIRECTORY SYS_MAIN/NEW_FOLDER/NEW_FOLDER/NEW_FOLDER/NEW_FOLDER/...[REPEATS 87 TIMES].../BUSINESS_LOGS```");
					
					setTimeout(() => { 
  						channel.bulkDelete(1);
  								
  						let msg = "```PLEASE SELECT A FILE TO READ";
  						for(const log of lognames)
  								msg += "\n- " + chatlogs[log].file;
  						msg+= "```";
  						channel.send(msg);
  						
  						client.consoleVars.inc('state');	
  						client.config.inUse = false;
  					}, 3000);
				}
				break;
			
			case 5:
				let clog;
  				for(const log of lognames) {
  					if (chatlogs[log].file == content.toUpperCase()) {
  						clog = chatlogs[log];
  						break;
  					}
  				}
  			
  				if (! clog) {
  					channel.send("```INVALID FILE```");
  						setTimeout(() => { 
  							channel.bulkDelete(1);
  						
  							//Building file directory message
  							let msg = "```PLEASE SELECT A FILE TO READ";
  							for(const log of lognames)
  								msg += "\n- " + chatlogs[log].file;
  							msg+= "```";
  							channel.send(msg);
  							client.config.inUse = false;
  						}, 3000);
  				}
  				else {
					 channel.send("```LOADING . . .```"); 		
					 
					 setTimeout(() => { 
  							channel.bulkDelete(1);
  						
  							//Building file directory message
  							channel.send(`\`\`\`READING: ${clog.file}\n\n--- DATE OF RECORDING: ${clog.name} ---\n${clog.desc}\n\nENTER 'BACK' TO RETURN TO DIRECTORY WHEN YOU ARE FINISHED READING\`\`\``);
  							client.consoleVars.inc('state');
  							client.config.inUse = false;
  						}, 3000);
  								
  				}
  				
  				
  				break;
  			case 6:
  				if (content.toUpperCase() == "BACK") {
  					channel.bulkDelete(2);
  							
  					//Building file directory message
  					let msg = "```PLEASE SELECT A FILE TO READ";
  					for(const log of lognames)
  								msg += "\n- " + chatlogs[log].file;
  					msg+= "```";
  					channel.send(msg);
  							
  					client.consoleVars.set('state', 5);
  					
  				}
  				client.config.inUse = false;
  				break;
			
		}
  		
  		return;
  }
  
};