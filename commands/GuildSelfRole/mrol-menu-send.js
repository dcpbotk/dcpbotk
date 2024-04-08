import Guild_Schema from "../../utils/database/Guild_Schema.js";
import { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export const data = {
  name: "mrol-menu-send",
  description: "Menu-Rol menüsünü atar.",
  botpermission: ["ManageRoles"],
  cooldown: 5,

  async execute(interaction) {
    if (interaction.type !== 3) return

    const { member, guild } = interaction;

    let menuSelfRoles;

    // Menu-Rol ayarları kontrolü
    const guildSchema = await Guild_Schema.findOne({ guild_id: guild.id });

    if (guildSchema && guildSchema.registerrole) {
      menuSelfRoles = guildSchema.registerrole;
    }


    if (!menuSelfRoles) {
      const response = new EmbedBuilder()
        .setAuthor({ name: "Bot • Menu-Rol Ayarları" })
        .setDescription(`\`❕\`<@${member.id}>, menu rol ayarları hatalı.\n\`❔\`Menu rol ayarlarını\`/menu-rol-ayarları\` açın. \`Roller\` kısmını belirleyin.`)
        .setColor("Red");
      interaction.reply({ embeds: [response], ephemeral: true });

      return;
    }


    // Rolleri select-Menu için uyarla
    let selectMenuroles
    if (guildSchema && guildSchema.selfrolemenu) {
      let selfRolesMenuArray = guildSchema.selfrolemenu.split(',');
      selfRolesMenuArray = selfRolesMenuArray.map(item => item.trim());
      selectMenuroles = await Promise.all(selfRolesMenuArray.map(async item => {
        try {
          const role = await guild.roles.fetch(item);
          return {
            setLabel: role.name,
            setValue: item
          };
        } catch (error) {
          return null;
        }
      }));
    }

    selectMenuroles = selectMenuroles.filter(role => role !== null);   

    if (selectMenuroles.length <= 0) {
      const response = new EmbedBuilder()
        .setAuthor({ name: "Bot • Menu-Rol Ayarları" })
        .setDescription(`\`❕\`<@${member.id}>, menu rol ayarları hatalı.\n\`❔\`Menu rol ayarlarını\`/menu-rol-ayarları\` açın. \`Roller\` kısmını belirleyin.`)
        .setColor("Red");
      interaction.reply({ embeds: [response], ephemeral: true });
      return;
    }
    const maxValues = selectMenuroles.length >= 10 ? 10 : selectMenuroles.length;

    const row1 = new ActionRowBuilder()
      .setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("mrol-menu-rolekle")
          .setPlaceholder("Rol Ekle")
          .setMaxValues(maxValues)
          .addOptions(
            ...selectMenuroles.map(option => new StringSelectMenuOptionBuilder()
              .setLabel(option.setLabel)
              .setValue(option.setValue)
            )
          )
      );

    const row2 = new ActionRowBuilder()
      .setComponents(
        new StringSelectMenuBuilder()
          .setCustomId("mrol-menu-rolkaldir")
          .setPlaceholder("Rol Kaldır")
          .setMaxValues(maxValues)
          .addOptions(
            ...selectMenuroles.map(option => new StringSelectMenuOptionBuilder()
              .setLabel(option.setLabel)
              .setValue(option.setValue)
            )
          )
      );

    await interaction.message.delete();
    await interaction.channel.send({ components: [row1, row2] });

  }
};