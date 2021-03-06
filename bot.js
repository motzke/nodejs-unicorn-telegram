const { Telegraf } = require('telegraf')
const UNICORN = require('unicornhat-mini');
const settings = require('./settings')

const MAX_MESSAGE_LENGTH = -1; // -1  for infinite
const MAX_QUEUE_LENGTH = -1; // -1 for infinity
const DISPLAY_TIMEOUT = 500; // in ms
let MESSAGE_QUEUE = [];

let unicorn = new UNICORN();
const bot = new Telegraf(settings.botAuthToken)

MESSAGE_QUEUE.push("Welcome to unicorn-telegram ...");

bot.start((ctx) => ctx.reply('Welcome'))
//bot.help((ctx) => ctx.reply('Send me a sticker'))
//bot.on('sticker', (ctx) => ctx.reply('👍'))
//bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
bot.on('text', (ctx) => {
  // Explicit usage
  //ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  //ctx.reply(`Hello ${ctx.state.role}`)

  MESSAGE_QUEUE.push(ctx.update.message.text);
  console.log(`puhsed ${ctx.update.message.text} to queue of length ${MESSAGE_QUEUE.length} `);
})

function displayMessage(text) {
  text = `   ${text}`;
  unicorn.scrollText(text);
  console.log(text, MESSAGE_QUEUE.length);
}

function debugLength() {
  //console.error(`Queue has a length of ${MESSAGE_QUEUE.length}`);
}

let current_text = "";
setInterval(function(){
  if (unicorn.busy) {
    console.error("busy...");
    debugLength();
  } else if (MESSAGE_QUEUE.length > 1) {
    current_text = MESSAGE_QUEUE[0];
    MESSAGE_QUEUE = MESSAGE_QUEUE.slice(1);
    displayMessage(current_text);
  } else if (MESSAGE_QUEUE.length == 1) {
    current_text = MESSAGE_QUEUE.pop();
    displayMessage(current_text);
  } else {
    debugLength();
  }
}, DISPLAY_TIMEOUT);




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
