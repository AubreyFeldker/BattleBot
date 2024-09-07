const { SlashCommandBuilder, PermissionFlagsBits, Collection } = require('discord.js');

let valids = new Collection();

valids.set(".UNLOCK", {message: "I'm tredging through a deep, dark pit...",
	await: 10,
	deeper: {message: "I have no idea where I'm at now, feels like somewhere impossibly deep...",
		await: 10,
		deeper: {message: "... ... ...",
			await: 10,
			deeper: {message: "Oh, I've found something! Let's see here.",
				await: 10,
				deeper: {message: "It seems I've come up against a door with a description on it. It says...\n ```THREE QUESTIONS AWAIT YOU NEXT. ANSWER ALL THREE TO GET WHAT YOU COVET.\nWHO ARE THEY?\nWHERE ARE THEY KEPT?\nWHAT CAN THEY SHARE?```\nInteresting! There also seems to be a thumb drive embedded into the wall? Let me transfer the files over to you.",
					await: 10,
					deeper: {message: "https://drive.google.com/drive/folders/1Ux1NvsnoXMuA-nfv3DOmOZv4XpwspL_V",
						await: 10
					}
				}
			}
		}
	}
});

valids.set("T.ODE", {message: "This one is deeeeeeeeeep underwater...",
	await: 10,
	deeper: {message: "Ok, now I'm at some underwater internet cables. Do I just hook into them or something...?",
		await: 10,
		deeper: {message: "Woahhhhhh, I got a new file! And since I'm already hooked up to the internet, thiswillgettoyousuperduperfaaaast-",
			await: 10,
			deeper: {message: "https://cdn.discordapp.com/attachments/415992268391055380/1282027346039279716/THISTIMEFORABSOLUTECERTAIN.png",
				await: 2
			}
		}
	}
});

valids.set("T.ODD", {message: "This one is deeeeeeeeeep underwater...",
	await: 10,
	deeper: {message: "Ok, now I'm at some underwater internet cables. Do I just hook into them or something...?",
		await: 10,
		deeper: {message: "Woahhhhhh, I got a new file! And since I'm already hooked up to the internet, thiswillgettoyousuperduperfaaaast-",
			await: 10,
			deeper: {message: "https://cdn.discordapp.com/attachments/415992268391055380/1282027346039279716/THISTIMEFORABSOLUTECERTAIN.png",
				await: 2
			}
		}
	}
});

valids.set("default", {message: "I found something! Commencing excavation process...",
	await: 10,
	deeper: {message: "Nevermind, just a rock. The key you provided must not have been correct.",
		await: 10
	}
});

async function decodePath(client, channel, path) {
	setTimeout(async () => {
		channel.send(path.message);
		if (path.deeper)
			await decodePath(client, channel, path.deeper);
	}, path.await * 1000)
}

module.exports = {
        category: 'misc',
        data: new SlashCommandBuilder()
                .setName('decode')
                .setDescription('Using the powers of advanced math, decode messages and find secrets. (1-Up Piece Arc Command)')
        .addStringOption(option =>
                option.setName('message')
                .setDescription('The message to decode')
                .setRequired(true)
        ),
        async execute(interaction, client) {
			const canDecode = client.settings.ensure('canDecode', true);

			if(! canDecode)
				return interaction.reply({content: "Something else is being decoded right now!", ephemeral: true});

			client.settings.set('canDecode', false);
			interaction.reply(`I will try decoding \`${interaction.options.getString('message')}\`. Commencing decoding process...`);
			const channel = interaction.channel;
			setTimeout(async () => { 
				channel.send('Coordinates found... Commencing scouting process...');
				const path = valids.get(interaction.options.getString('message').toUpperCase()) ?? valids.get('default');
				await decodePath(client, channel, path);
				client.settings.set('canDecode', true);
			}, 5000);
        },
};