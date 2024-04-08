import Guild_Schema from "../utils/database/Guild_Schema.js"
import { EmbedBuilder } from "discord.js"
const userActivity = new Map();

export default client => {
    client.on('voiceStateUpdate', async (oldState, newState) => {

        const guild = newState.guild || oldState.guild;
        const guildId = guild.id;

        if (newState.channel && !oldState.channel) {
            const { member, channelId, channel } = newState

            const nowTimeStamp = Date.now()
            userActivity.set(`${guildId}-${member.id}`, nowTimeStamp);

            const membersInChannel = channel?.members;
            let roomsusers = ""
            if (membersInChannel) {
                const memberIDs = membersInChannel.filter((m) => m.user.id !== member.id).map((m) => `\n${m.user.username} (${m.user.id}ses)`)
                if (memberIDs.length < 1) roomsusers = ""
                else roomsusers = `\n\`\`\`arm\n|Kanalda "${memberIDs.length}" kullanıcı var|${memberIDs}\`\`\``
            }
 
            const guildSchema = await Guild_Schema.findOne({ guild_id: guildId });
            if (guildSchema && guildSchema.logchannelinputoutput) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelinputoutput);

                if (logChannel) {
                    const nowTimeStampEdit = Math.floor(nowTimeStamp / 1000)
                    const response = new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `${member.user.username} (${member.id})`, iconURL: member.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kanala giriş yaptı.**\n\n\`📢\`**Kanal Bilgileri: **\n\`-\`Kanal: <#${channelId}>\n\`-\`Kanal İsmi: ${channel.name}\n\`-\`Kanal ID: ${channelId}\n\n**\`⏰\`Zaman Bilgileri:**\n\`-\`Tarih: <t:${nowTimeStampEdit}:D>\n\`-\`Saat: <t:${nowTimeStampEdit}:T>\n\`-\`Geçen Süre: <t:${nowTimeStampEdit}:R>${roomsusers}`)

                    await logChannel.send({ embeds: [response] }).catch((error) => {console.log(error.message)});
                }

            }
        }
        
        if (!newState.channel && oldState.channel) {

            const { member, channelId, channel } = oldState
            const nowTimeStamp = Date.now()

            const startTime = userActivity.get(`${guildId}-${member.id}`);
            
            const membersInChannel = channel?.members;
            let roomsusers = ""
            if (membersInChannel) {
                const memberIDs = membersInChannel.filter((m) => m.user.id !== member.id).map((m) => `\n${m.user.username} (${m.user.id}ses)`)
                if (memberIDs.length < 1) roomsusers = ""
                else roomsusers = `\n\`\`\`arm\n|Kanalda "${memberIDs.length}" kullanıcı var|${memberIDs}\`\`\``
            }

            let activityrooms = "Bilinmiyor"
            if (startTime) {
                const duration = nowTimeStamp - startTime;
                const hours = Math.floor(duration / 3600000);
                const minutes = Math.floor((duration % 3600000) / 60000);
                const seconds = Math.floor((duration % 60000) / 1000);
                const formattedDuration = `${hours > 0 ? `**${hours}** saat, `:""}${minutes > 0 ? `**${minutes}** dakika, `:""}${seconds > 0 ? `**${seconds}** saniye`:""}`;
                activityrooms = `${formattedDuration}`
            }

            userActivity.delete(`${guildId}-${member.id}`);

            const guildSchema = await Guild_Schema.findOne({ guild_id: guildId });

            if (guildSchema && guildSchema.logchannelinputoutput) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelinputoutput);

                if (logChannel) {
                    const nowTimeStampEdit = Math.floor(nowTimeStamp / 1000)
                    const response = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: `${member.user.username} (${member.id})`, iconURL: member.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kanaldan çıkış yaptı.**\n\n\`📢\`**Kanal Bilgileri: **\n\`-\`Kanal: <#${channelId}>\n\`-\`Kanal İsmi: ${channel.name}\n\`-\`Kanal ID: ${channelId}\n\n**\`⏰\`Zaman Bilgileri:**\n\`-\`Kaldığı Süre: ${activityrooms}\n\`-\`Tarih: <t:${nowTimeStampEdit}:D>\n\`-\`Saat: <t:${nowTimeStampEdit}:T>\n\`-\`Geçen Süre: <t:${nowTimeStampEdit}:R>${roomsusers}`)

                    await logChannel.send({ embeds: [response] }).catch((error) => {console.log(error.message)});
                }    
            }

        }

        if (newState.channel && oldState.channel && oldState.channel !== newState.channel) {

            const osChannelId = oldState.channelId
            const osChannel = oldState.channel
            const nsMember = newState.member
            const nsChannelId = newState.channelId
            const nsChannel = newState.channel
            const nowTimeStamp = Date.now()

            const startTime = userActivity.get(`${guildId}-${nsMember.id}`);
            
            const membersInChannelos = osChannel?.members;
            let roomsusersos = ""
            if (membersInChannelos) {
                const memberIDs = membersInChannelos.filter((m) => m.user.id !== nsMember.id).map((m) => `\n${m.user.username} (${m.user.id}ses)`)
                if (memberIDs.length < 1) roomsusersos = ""
                else roomsusersos = `\n\`\`\`arm\n|Eski kanalda "${memberIDs.length}" kullanıcı var|${memberIDs}\`\`\``
            }
            
            const membersInChannelns = nsChannel?.members;
            let roomsusersns = ""
            if (membersInChannelns) {
                const memberIDs = membersInChannelns.filter((m) => m.user.id !== nsMember.id).map((m) => `\n${m.user.username} (${m.user.id}ses)`)
                if (memberIDs.length < 1) roomsusersns = ""
                else roomsusersns = `\n\`\`\`arm\n|Yeni kanalda "${memberIDs.length}" kullanıcı var|${memberIDs}\`\`\``
            }

            let activityrooms = "Bilinmiyor"
            if (startTime) {
                const duration = nowTimeStamp - startTime;
                const hours = Math.floor(duration / 3600000);
                const minutes = Math.floor((duration % 3600000) / 60000);
                const seconds = Math.floor((duration % 60000) / 1000);
                const formattedDuration = `${hours > 0 ? `**${hours}** saat, `:""}${minutes > 0 ? `**${minutes}** dakika, `:""}${seconds > 0 ? `**${seconds}** saniye`:""}`;
                activityrooms = `${formattedDuration}`
            }
            userActivity.delete(`${guildId}-${nsMember.id}`);
            userActivity.set(`${guildId}-${nsMember.id}`, nowTimeStamp);

            const guildSchema = await Guild_Schema.findOne({ guild_id: guildId });

            if (guildSchema && guildSchema.logchannelinputoutput) {
                const logChannel = guild.channels.cache.get(guildSchema.logchannelinputoutput);

                if (logChannel) {
                    const nowTimeStampEdit = Math.floor(nowTimeStamp / 1000)
                    const response = new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: `${nsMember.user.username} (${nsMember.id})`, iconURL: nsMember.displayAvatarURL() })
                        .setDescription(`\`❔\`**Kanaldan kanala geçiş yaptı.**\n\n\`📢\`**Kanal Bilgileri: **\n\`-\`Eski Kanal: <#${osChannelId}>\n\`-\`Eski Kanal İsmi: ${osChannel.name}\n\`-\`Eski Kanal ID: ${osChannelId}\n\`+\`Yeni Kanal: <#${nsChannelId}>\n\`+\`Yeni Kanal İsmi: ${nsChannel.name}\n\`+\`Yeni Kanal ID: ${nsChannelId}\n\n**\`⏰\`Zaman Bilgileri:**\n\`-\`Öncesinde Kaldığı Süre: ${activityrooms}\n\`-\`Tarih: <t:${nowTimeStampEdit}:D>\n\`-\`Saat: <t:${nowTimeStampEdit}:T>\n\`-\`Geçen Süre: <t:${nowTimeStampEdit}:R>${roomsusersos}${roomsusersns}`)

                    await logChannel.send({ embeds: [response] }).catch((error) => {console.log(error.message)});
                }    
            }

        }




    });

}