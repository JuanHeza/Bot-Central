const TelegramBot = require('node-telegram-bot-api');
//const { createCanvas } = require('canvas')
const fs = require("fs")
const { Color } = require("./colorBot")

const rgbTemplate = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/
const hslTemplate = /hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/
const hslTemplate2 = /hsl\((\d{1,3}),([0-1]*\.?\d{0,4}),([0-1]*\.?\d{0,4})/;
const hsvTemplate = /hsv\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)/
const hsvTemplate2 = /hsv\((\d{1,3}),([0-1]*\.?\d{0,4}),([0-1]*\.?\d{0,4})/;
const hexTemplate = /#([a-fA-F0-9]{3,6}$)/

// Create a bot that uses 'polling' to fetch new updates
const colorBot = new TelegramBot(process.env['color_token'], { polling: true });
let cb = new Color();
colorBot.on("callback_query", (msg) => {
    console.log(msg)
    colorBot.answerCallbackQuery(msg.id, { text: "Your color is Saved 😁", show_alert: true })
});

colorBot.on("inline_query", (msg) => {
    const chatId = msg.id;
    console.log(msg)
    const resp = [
        { type: "photo", reply_markup: { inline_keyboard: buildKeyboard("solid", msg.query) }, ...generatePicture("solid", msg.query) },
        { type: "photo", reply_markup: { inline_keyboard: buildKeyboard("shades", msg.query) }, ...generatePicture("shades", msg.query) },
        { type: "photo", reply_markup: { inline_keyboard: buildKeyboard("tint", msg.query) }, ...generatePicture("tint", msg.query) },
        { type: "photo", reply_markup: { inline_keyboard: buildKeyboard("hue", msg.query) }, ...generatePicture("hue", msg.query) },
        { type: "photo", reply_markup: { inline_keyboard: buildKeyboard("gradient", msg.query) }, ...generatePicture("gradient", msg.query) }
    ];
    colorBot.answerInlineQuery(chatId, resp)
});

colorBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let match = { hex: null, rgb: null, hsl: null, hsv: null, text: msg.text, valid: false }
    msg.text = msg.text.replaceAll(" ", "").toLowerCase()
    switch (true) {
        case (hsvTemplate.exec(msg.text) || hsvTemplate2.exec(msg.text))?.length > 0:
            match.hsv = (hsvTemplate.exec(msg.text) || hsvTemplate2.exec(msg.text)).slice(1, 4);
            break;
        case (hslTemplate.exec(msg.text) || hslTemplate2.exec(msg.text))?.length > 0:
            match.hsl = (hslTemplate.exec(msg.text) || hslTemplate2.exec(msg.text)).slice(1, 4);
            break;
        case (rgbTemplate.exec(msg.text))?.length > 0:
            match.rgb = (rgbTemplate.exec(msg.text)).slice(1, 4);
            break;
        case (hexTemplate.exec(msg.text))?.length > 0:
            match.hex = (hexTemplate.exec(msg.text));
            break;
    }
    match.valid = ( match.hex || match.hsl || match.hsv || match.rgb ) != null
    if (match.valid) {
        generatePicture()
    }

    console.log({ msg: msg, match: match })

    // send a message to the chat acknowledging receipt of their message
    colorBot.sendMessage(chatId, `Your message is ${match.valid ? "Valid" : "Invalid"}`);
});
function buildKeyboard(type = "", color = "") {
    let buttons = [
        { text: "Tint", type: "tint", callback_data: JSON.stringify({ type: "tint", color: color }) },
        { text: "Solid", type: "solid", callback_data: JSON.stringify({ type: "solid", color: color }) },
        { text: "Shades", type: "shades", callback_data: JSON.stringify({ type: "shades", color: color }) },
        { text: "Gradient", type: "gradient", callback_data: JSON.stringify({ type: "gradient", color: color }) },
        { text: "Pallete", type: "pallete", callback_data: JSON.stringify({ type: "pallete", color: color }) },
        { text: "Hue", type: "hue", callback_data: JSON.stringify({ type: "hue", color: color }) }
    ]
    buttons = buttons.filter(e => e.text.toLowerCase() != type.toLowerCase())
    type = type[0].toUpperCase() + type.slice(1)
    let keyboard = [
        [{ text: "Save", callback_data: JSON.stringify({ type: type, color: color }) }],
        buttons.slice(0, 2),
        buttons.slice(2)
    ]
    return keyboard
}
function generatePicture(type = "solid", color = "#000000") {
    let size = 0
    switch (type) {
        case "gradient":
            size = 20
            break
        case "hue":
            size = 40
            break
        case "tint":
            size = 60
            break
        case "shades":
            size = 80
            break
        case "solid":
            size = 100
            break
    }

    /*
        const canvas = createCanvas(100, 100);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = match.text;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./test.png", buffer);
    */
    let obj = {
        id: type,
        photo_url: `https://placekitten.com/g/${size}/${size}`,
        thumb_url: `https://placekitten.com/g/${size}/${size}`,
        caption: `${type.toUpperCase()} - ${color}`
    }
    return obj
}
function CleanPictures() { }