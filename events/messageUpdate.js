import Guild_Schema from "../utils/database/Guild_Schema.js"
import { EmbedBuilder } from "discord.js"

export default client => {
    client.on('messageUpdate', async (oldMessage, newMessage) => {

        const { guild, author, channel, channelId, guildId, createdTimestamp, content, id } = newMessage  
        if (!author || author.bot) return

        const guildSchema = await Guild_Schema.findOne({ guild_id: guildId });

        if (guildSchema && guildSchema.logdeletedandeditedmsg) {
            const logChannel = guild.channels.cache.get(guildSchema.logdeletedandeditedmsg);

            if (logChannel) {
                const nowTimeStamp = Date.now()
                const createdTimestampEdit = createdTimestamp ? Math.floor(createdTimestamp / 1000) : "Bilinmiyor";
                const deletedTimestampEdit = nowTimeStamp ? Math.floor(nowTimeStamp / 1000) : "Bilinmiyor";

                let activityrooms = "Bilinmiyor"
                if (createdTimestamp) {
                    const duration = nowTimeStamp - createdTimestamp;
                    const hours = Math.floor(duration / 3600000);
                    const minutes = Math.floor((duration % 3600000) / 60000);
                    const seconds = Math.floor((duration % 60000) / 1000);
                    const formattedDuration = ` ${hours > 0 ? `**${hours}** saat, ` : ""}${minutes > 0 ? `**${minutes}** dakika, ` : ""}${seconds > 0 ? `**${seconds}** saniye` : ""}`;
                    activityrooms = `${formattedDuration}`
                }

                const response = new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: `${author.username} (${author.id})`, iconURL: author.displayAvatarURL() })
                    .setDescription(`\`❔\`**Kullanıcının mesajı düzenlendi.**\n\n\`📢\`**Kanal Bilgileri: **\n\`-\`Kanal: <#${channelId}>\n\`-\`Kanal İsmi: ${channel.name}\n\`-\`Kanal ID: ${channelId}\n\`-\`Düzenlelen Mesaj: [Git](https://discord.com/channels/${guildId}/${channelId}/${id})\n\n**\`⏰\`Zaman Bilgileri:**\n\`-\`Gönderme: <t:${createdTimestampEdit}:f>\n\`-\`Düzenlenme: <t:${deletedTimestampEdit}:f>\n\`-\`Geçen Süre: <t:${deletedTimestampEdit}:R>\n\`-\`Düzenlenme Süresi:${activityrooms}`)

                if (oldMessage.content) response.addFields({ name: '\`💬\`Eski Mesaj İçeriği:', value: oldMessage.content })
                if (content) response.addFields({ name: '\`💬\`Yeni Mesaj İçeriği:', value: content })

                await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
            }
        }



    });

}