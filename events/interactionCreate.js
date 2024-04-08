import cooldown_control from "../utils/cooldown_control.js";
import { EmbedBuilder } from "discord.js"

export default client => {

    const { embed } = client
    client.on('interactionCreate', interaction => {
        if (!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) return

        const command = client.commands.get(interaction.commandName || interaction.customId)
        if (!command) return

        // check member permissions
        if (command.data.permission && command.data.permission?.length > 0) {
            if (!interaction.channel.permissionsFor(interaction.member).has(command.data.permission)) {
                const response = new EmbedBuilder()
                    .setDescription(`\`❌\`Bu komutu kullanmak için gerekli yetkiniz yok.\n\`${command.data.permission}\``)
                    .setColor("Red")

                interaction.reply({ embeds: [response], ephemeral: true })
                return
            }
        }

        // check bot permissions
        if (command.data.botpermission && command.data.botpermission?.length > 0) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(command.data.botpermission)) {
                const response = new EmbedBuilder()
                    .setDescription(`\`❌\`Bu komutu kullanmak için botun gerekli yetkisi yok.\n\`${command.data.botpermission}\``)
                    .setColor("Red")

                interaction.reply({ embeds: [response], ephemeral: true })
                return
            }
        }

        // Cooldown_control
        if (command.data.cooldown) {
            const cooldown = cooldown_control(command, interaction.member.id)
            if (command.cooldown) {
                const response = new EmbedBuilder()
                    .setDescription(`\`⌛\`Bu komutu tekrar kullanmak için \`${cooldown}\` saniye beklemelisiniz.`)
                    .setColor("Red")

                interaction.reply({ embeds: [response], ephemeral: true })
                return
            }
        }

        //Ececute Command
        try {
            command.data.execute(interaction)
        } catch (e) {
            interaction.reply({ embeds: [embed(`\`❌\`Bu komutu kullanırken bir hata oluştu.`, "RED")] })
            console.log(e)
        }

    });

}