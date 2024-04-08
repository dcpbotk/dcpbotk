import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { EmbedBuilder } from "discord.js"

export const data = {
  name: "mrol-menu-rolekle",
  description: "Kullanıcıya rol ekle.",
  botpermission: ["ManageRoles"],
  cooldown: 5,

  async execute(interaction) {
    if (interaction.type !== 3) return
    const { member, values, guild } = interaction;
    await interaction.deferReply({ ephemeral: true });


    // Kullanım rolü kontrolü
    let selfRoleMenuDId
    const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });
    if (guildSchema && guildSchema.selfrolemenud) {
      selfRoleMenuDId = guildSchema.selfrolemenud;
    }

    if (selfRoleMenuDId && (!member.roles.cache.some(role => role.id === selfRoleMenuDId))) {
      const response = new EmbedBuilder()
        .setDescription(`\`❕\`<@${member.id}>, malesef işlem yapamadınız.\n\`❔\`Bunu <@&${selfRoleMenuDId}> rolü olmadan bunu kullanamazsınız.`)
        .setColor("Red")
      interaction.editReply({ embeds: [response], ephemeral: true });
      return;
    }


    const response = new EmbedBuilder()
      .setColor("Orange");

    try {
      await member.roles.add(values)
      response.setDescription(`\`✅\`<@${member.id}>, ${values.map(roleId => `<@&${roleId}>`)} rolleri başarıyla eklendi.`)
      await interaction.editReply({ embeds: [response], ephemeral: true });
    } catch (error) {
      response.setDescription(`\`❌\`<@${member.id}>, roller eklenirken hata oluştu.\n\`❕\`Seçilen rollerden en az birini eklemeye veya kaldırmaya iznim yok.`)
      await interaction.editReply({ embeds: [response], ephemeral: true });
    }

  }
};