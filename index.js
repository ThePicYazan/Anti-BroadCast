const axios = require("axios");
//=========================================================================
const { Client: Client2, EmbedBuilder, Events } = require("discord.js");
const { Client } = require("discord.js-selfbot-v13");
const client2 = new Client2({ intents: 131071 });
//=========================================================================
const { tokenbot, web, channeLog, server,blacklist } = require('./config');

client2.on(Events.ClientReady, async () => {
  await console.log(`${client2.user.username} is ready!`);
  await test();
});

async function test() {
  const response = await axios.get(web);
  const tokens = response.data.split('\n');
  for (let token of tokens) {
    if (token) {
      Login(token.trim());
    }
  }
}

async function Login(token) {
  const client1 = new Client({ checkUpdate: false });

  try {
    await client1.login(token);
    console.log(`Successfully logged in with token ${token} ${client1.user.username}`);

    client1.on("messageCreate", async (message) => {
      if (message.channel.type === "DM") {
        for (let black of blacklist) {
          if (message.content.toLowerCase().includes(black)) {
            const guild = await client2.guilds.cache.get(server);
            const member = await guild.members.cache.get(message.author.id);

            if (!member) {
              return false;
            } else {

              const embed = new EmbedBuilder();
              embed.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) });
              embed.setDescription(message.content);
              embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
              embed.setFooter({ text: "Made by YAZAN#1411 & Discord.gg/Ra3d" });

              await guild.channels.cache.get(channeLog).send({ embeds: [embed] });
              await member.ban();
            }
          }
        }
      }
    });
  } catch (error) {
    console.error(`Error logging in with token ${token}\nError: ${error}`);
  }
}

client2.login(tokenbot);