import { EmbedBuilder } from "discord.js"
import register_commands from "../../utils/bot/register_commands.js";

export const data = {
    name: "komutları-yapılandır",
    description: "Tüm komutları günceller.",
    cooldown: 60,
    async execute(interaction) {
        
        await register_commands(interaction.guild)
            .then((registeredCommands) => {
                let registeredCommandsLog = ""
                if (registeredCommands) registeredCommandsLog = `\n\n\`💡\`**Yapılandırılan Komutlar:**\n${registeredCommands.map(command => `\`${command.name}\``).join(' | ')}`

                const response = new EmbedBuilder()
                    .setDescription(`\`✅\`Komutlar başarıyla yapılandırıldı.${registeredCommandsLog}`)
                    .setColor("Orange")
                    .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });


                interaction.reply({ embeds: [response] });
            })
            .catch((error) => {
                const response = new EmbedBuilder()
                    .setDescription(`\`❌\`Komutlar yapılandırılırken hata bulundu.`)
                    .setColor("Red")

                interaction.reply({ embeds: [response] });
                console.log(error.message)
            });
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
}