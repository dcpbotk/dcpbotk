import Guild_Schema from "../utils/database/Guild_Schema.js"
import { EmbedBuilder } from "discord.js"

export default client => {
    client.on('guildMemberRemove', async (member) => {
        const { user, guild } = member;
        const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });
        if (guildSchema && guildSchema.logguildinput) {

            const logChannel = guild.channels.cache.get(guildSchema.logguildinput);
            if (logChannel) {
                const response = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`\`👋\`<@${user.id}> sunucudan ayrıldı.`)
                await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
            }
        }
    });
}