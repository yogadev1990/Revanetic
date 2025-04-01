const ResponFormatter = require("../lib/responFormatter");
const handlers = require("./Amamiya/handlers");
const PREFIX = "/";

class Amamiyabot {
  async process(req, res) {
    const { from, message, bufferImage } = req.body;

    // Pastikan pesan ada dan diawali dengan prefix
    if (!message || !message.startsWith(PREFIX)) {
      return res.status(400).json({ error: "Invalid command or missing prefix" });
    }

    const responFormatter = new ResponFormatter();
    const [command, ...args] = message.slice(PREFIX.length).trim().split(" ");

    let response;
    if (("participant" in req.body)) {
      switch (command) {
        case "status":
          response = await handlers.status();
          break;
        case "menu":
          response = await handlers.menu();
          break;
        case "amamiya":
          response = await handlers.amamiya();
          break;
        case "ai":
          response = await handlers.ai(from, args);
          break;
        case "analisis":
          response = await handlers.analisis(bufferImage);
          break;
        case "obat":
          response = await handlers.obat(args.join(" "));
          break;
        default:
          response = await handlers.default();
          break;
      }
    }

    if (response) {
      return res.send(responFormatter.line(response).responAsText());
    }
  }
}

module.exports = Amamiyabot;
