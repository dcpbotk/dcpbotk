import Guild_Schema from "../utils/database/Guild_Schema.js"
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js"

export default client => {
    client.on('guildMemberAdd', async (member) => {
        const { user, guild } = member;

        const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });

        // Giriş-Çıkış Mesajları
        if (guildSchema && guildSchema.logguildinput) {

            const logChannel = guild.channels.cache.get(guildSchema.logguildinput);
            if (logChannel) {
                const response = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`\`✅\`Hey <@${user.id}>, sunucumuza hoşgeldin.`)
                await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
            }
        }

        // Kayıt sistemi
        if (guildSchema && guildSchema.registersystem) {
            const logChannel = guild.channels.cache.get(guildSchema.registerchannel);
            
            if (logChannel) {

                const response = new EmbedBuilder()
                    .setThumbnail(user.displayAvatarURL())
                    .setColor("Orange")
                    .setDescription(`\`✅\`<@${user.id}> kullanıcısı sunucuya katıldı.\n\`-\`Kullanıcı Adı: ${user.username}\n\`-\`Üyelik Tarihi: <t:${Math.floor(user.createdTimestamp / 1000)}:R>\n\`-\`Katılma Tarihi: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`)
                    .setFooter({ text: user.id });
                    
            if (guildSchema.registersystem === "Buton+Komut") {

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('kayıtbutton')
                        .setLabel('Kayıt Et')
                        .setStyle('Success'),
                );
                    await logChannel.send({ embeds: [response], components: [row] }).catch((error) => { console.log(error.message) });

                }
                else if (guildSchema.registersystem === "Komut") {
                    await logChannel.send({ embeds: [response] }).catch((error) => { console.log(error.message) });
                }

            }

        }

        // Sunucuya giriş rolü verme
        if (guildSchema && guildSchema.memberdaddRole) {
            await member.roles.add(guildSchema.memberdaddRole)
        }
    })
}