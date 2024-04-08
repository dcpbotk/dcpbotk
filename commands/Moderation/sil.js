import { EmbedBuilder } from "discord.js"

export const data = {
  name: "sil",
  description: "Kanaldaki mesajları siler",
  permission: "ManageMessages",
  cooldown: 10,
  async execute(interaction) {

    const { channel, options } = interaction;

    const amount = options.getInteger('miktar');
    const target = options.getUser('kullanıcı');

    const messages = await channel.messages.fetch({
      limit: amount,
    });

    const response = new EmbedBuilder()
      .setColor("Green")

    if (amount > 100) {
      response.setDescription(`Tek seferden maksimum **100** mesaj silebilirsiniz.`);
      interaction.reply({ embeds: [response] });
      return;
    }

    if (target) {
      let i = 0;
      const filtered = [];

      (await messages).filter((msg => {
        if (msg.author.id === target.id && amount > i) {
          filtered.push(msg);
          i++
        }
      }));

      await channel.bulkDelete(filtered).then((message) => {
        response.setDescription(`${target} kullanıcısının kanaldaki **son ${amount}** mesajda **${message.size}** tane bulunup başarıyla silindi.`);
        interaction.reply({ embeds: [response] });
      }).catch(error => { console.error('error:', error); });
    }
    else {
      await channel.bulkDelete(amount + 1, true).then((message) => {
        response.setDescription(`${channel} kanalından **${message.size}** mesaj başarıyla silindi.`);
        interaction.reply({ embeds: [response] }).catch(error => { console.error('error:', error); });
      });
    }
  }
};

export const slash_data = {
  name: data.name,
  description: data.description,
  options: [
    {
      name: "miktar",
      description: "Temizlenecek mesaj miktarı.",
      type: 4,
      required: true
    },
    {
      name: "kullanıcı",
      description: "Mesajları temizlenecek kullanıcıyı seçin.",
      type: 6,
      required: false
    }
  ]
}