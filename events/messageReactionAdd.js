const { Events } = require('discord.js');

// Tracks msg reacts for the April Fools event
module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        //non-cached reacts need to have the full react cached first
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch(error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        const client = user.client;
        if(reaction.emoji.name.startsWith('lx')) {
            const reactionDBid = reaction.message.id + ` ${reaction.emoji.name}`;
            // Me adding luigi emotes to the db
            if(user.id === client.maker) {
                client.luigiEmotes.ensure(reactionDBid, false);
                console.log(`${user.displayName} added ${reaction.emoji.name} on '${reaction.message.content}'`);

                const msgData = client.luigiEmotes.get('editMsg');
                const trackedMsg = await client.guilds.cache.get(msgData.guildId).channels.cache.get(msgData.channelId).messages.fetch(msgData.id);
                
                trackedMsg.edit({embeds: [client.createLuigiEmbed()]});
            }
            else {
                //If the react has this post-emote combo, and I'm not adding it,
                //someone else is adding it
                if(client.luigiEmotes.has(reactionDBid)) {
                    const participatingUsers = client.luigiEmotes.ensure('participatingUsers', []);

                    //If this is the first react clicked on, add them to participating user list
                    if(! participatingUsers.includes(user.id))
                        client.luigiEmotes.push('participatingUsers', user.id);

                    //If first time react has been clicked, mark it as clicked in the db
                    if(!client.luigiEmotes.get(reactionDBid)) {
                        client.luigiEmotes.set(reactionDBid, true);
                        const luigisLeft = client.luigiEmotes.filter((v) => v===false).size;
                        console.log(`${user.displayName} found the Luigi at ${reaction.message.id}. ${luigisLeft} Luigis left`);

                        //Edit the tracked msg to decrement the Luigis left to find
                        const msgData = client.luigiEmotes.get('editMsg');
                        const trackedMsg = await client.guilds.cache.get(msgData.guildId).channels.cache.get(msgData.channelId).messages.fetch(msgData.id);
                        
                        trackedMsg.edit({embeds: [client.createLuigiEmbed()]});
                    }
                }
            }
        }

        
    },
};