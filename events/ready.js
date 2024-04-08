export default client => {

    client.once('ready', async () => {       

        console.log(`Bot: ${client.user.username} olarak giriş yapıldı.`);   });

}