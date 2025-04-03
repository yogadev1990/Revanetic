const ResponFormatter = require("../lib/responFormatter");
const handlers = require("./August/handlers.js");
const PREFIX = "/";
const Validator = require("./August/validator.js");
const validator = new Validator();
const axios = require("axios");
const StickerWa = require("./August/stickerWa");

class Augustbot {
  async process(req, res) {
    const {
      device,
      message,
      bufferImage,
      from,
      name,
      participant,
      admin,
      botadmin,
      participantCount,
      groupname,
      key,
    } = req.body;

    const responFormatter = new ResponFormatter();
    
    if (!message.startsWith(PREFIX))
      {
        if (await validator.containsLink(message)) {
          await axios.post(`${process.env.WA_BOT_URL}/delete-message`, {
            api_key: process.env.WA_BOT_API_KEY,
            sender: device,
            number: from + "@g.us",
            key: key,
          });
          return res.send(responFormatter.line("Maaf, link tidak diizinkan di grup ini.").responAsText());
        } else if (await validator.containsBadWords(message)) {
          await axios.post(`${process.env.WA_BOT_URL}/delete-message`, {
            api_key: process.env.WA_BOT_API_KEY,
            sender: device,
            number: from + "@g.us",
            key: key,
          });
          return res.send(responFormatter.line("Maaf, pesan toxic tidak diizinkan di grup ini.").responAsText());
        } else {
          return;
        }
      };

    const [command, ...args] = message.slice(PREFIX.length).trim().split(" ");

    const context = {
      device,
      groupname,
      from,
      name,
      participantCount,
      bufferImage,
      admin,
      botadmin,
      args,
    };

    let response;
    if (from === process.env.OWNER) {
      switch (command) {
        case "addbadword":
          response = await validator.BadWords( args, true );
          break;
        case "deletebadword":
          response = await validator.BadWords( args, false );
          break;
        case "addwhitelist":
          response = await validator.whitelist( args, true );
          break;
        case "deletewhitelist":
          response = await validator.whitelist( args, false );
          break;
        default:
          response = await handlers.default();
          break;
      }
    } else {
        switch (command) {
          case "add":
            response = await handlers.add(context);
            break;
          case "kick":
            response = await handlers.kick(context);
            break;
          case "promote":
            response = await handlers.promote(context);
            break;
          case "demote":
            response = await handlers.demote(context);
            break;
          case "antitoxic":
            response = await handlers.antiToxic(context);
            break;
          case "antilink":
            response = await handlers.antiLink(context);
            break;
          case "welcomemsg":
            response = await handlers.welcomeMsg(context);
            break;
          case "outmsg":
            response = await handlers.outMsg(context);
            break;
          default:
            response = await handlers.default();
            break;
          case "menu":
            response = await handlers.menu();
            break;
          case "rulesgc":
            response = await handlers.rulesedit(context);
            break;
          case "rules":
            response = await handlers.rules(context);
            break;
          case "alltag":
            response = await handlers.alltag(context);
            break;
          case "randomtag":
            response = await handlers.randomtag(context);
            break;
          case "chizu":
            response = await handlers.chizu(context);
            break;
          case "rules":
            response = await handlers.rules();
            break;
          case "infobot":
            response = await handlers.infoBot();
            break;
        }
    } 
    if (response) {
      if (command === "sticker" && bufferImage) {
        return res.send(
          responFormatter.responSticker(await StickerWa.create(bufferImage))
        ); // Kirim stiker, eksekusi berhenti di sini
      } else {
        return res.send(responFormatter.line(response).responAsText()); // line 275
      }
    }
        
  };
  async processGrup(req, res) {
    const {
      groupId,
      participants,
      action,
      groupname,
      participantsCount,
    } = req.body;

    if (!groupId || !participants || !action) {
      return res.status(400).json({ message: "Parameter wajib diisi. Data yang didapat:" + JSON.stringify(req.body) });
    }

    const responFormatter = new ResponFormatter();
    const from = groupId.replace("@c.us", "").replace("@s.whatsapp.net", "").replace("@g.us", "");
  
    const context = {
      from,
      participants,
      action,
      groupname,
      participantsCount,
    };
      let response;
      if (action === "add") {
        response = await handlers.welcome(context);
      } else if (action === "remove") {
        response = await handlers.out(context);
      }
  
      res.send(responFormatter.line(response).responAsText());
    }
  
}

module.exports = Augustbot;