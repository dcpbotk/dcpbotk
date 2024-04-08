import fs from 'fs';
import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export const data = {
  name: "log-ayarları",
  description: "Sunucudaki log ayarlarını düzenler.",
  permission: ["Administrator"],
  botpermission: ["Administrator"],
  cooldown: 10,

  async execute(interaction) {

    const { guildId } = interaction

    let selectMenuArgs
    try {
      const data = fs.readFileSync('utils/embed_data/guildlogdata.json', 'utf8');
      selectMenuArgs = JSON.parse(data);
    } catch (error) {
      console.error('JSON parse edilirken bir hata oluştu:', error.message);
    }
    
    if (!selectMenuArgs) {
      const response = new EmbedBuilder()
        .setDescription(`\`❌\`Gömülü veri okunamadı. Bot sahibinin görmesi gereken hata.`)
        .setColor("Red")
      try { await interaction.update({ embeds: [response] });} 
      catch (error) {console.error('Güncelleme hatası:', error);}
      return;
    }

    const msgLogSettings = await Promise.all(selectMenuArgs.map(async (arg) => {
      try {
        const logchannelid = await Guild_Schema.findOne({ guild_id: guildId });
        if (logchannelid && logchannelid[arg.schemaKey]) {
          return `\`➕\`**${arg.setLabel}:** <#${logchannelid[arg.schemaKey]}>`;
        }
      } catch (error) {
        console.error(error);
      }
      return `\`➕\`**${arg.setLabel}:** Kapalı`;
    }));

    const response = new EmbedBuilder()
      .setAuthor({ name: "Bot • Sunucunun Log Ayarları" })
      .setDescription(`\`💡\`Tüm ayarları aşağıdaki menüden düzenleyebilirsiniz.\n\n${msgLogSettings.join("\n")}`)
      .setColor("Orange")
      .setFooter({ text: 'Bot • Creative by K', iconURL: interaction.guild.iconURL({ dynamic: true }) });

    const row1 = new ActionRowBuilder()
      .setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("log-ayarları-kanal")
          .setPlaceholder("Log Kanallarını Düzenle")
          .addOptions(
            ...selectMenuArgs.map(option => new StringSelectMenuOptionBuilder()
              .setLabel(option.setLabel)
              .setValue(option.setValue)
            )
          )
      );

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('mesajsil-guild')
          .setLabel('Sonlandır')
          .setStyle('Danger'),
      );

    interaction.reply({ embeds: [response], components: [row1, row2] });

  }
};

export const slash_data = {
  name: data.name,
  description: data.description,
}