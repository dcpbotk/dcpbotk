export const data = {
  name: "mesajsil-guild",
  description: "Mesajı siler.",

  async execute(interaction) {

    const { message } = interaction
    message.delete();

  }
};