const { checkDelay, saveDelayed, checkBotStatus, setOFF, setON } = require("../lib/helpers.js");
const ResponFormatter = require("../lib/responFormatter.js");
const Iklan = require("./Revanda/Iklan.js");
const GeminiAi = require("./Revanda/geminiAi.js");

class Revandabot {
  async process(req, res) {
    const { from, message } = req.body; // Pastikan message tersedia di req.body
    const responFormatter = new ResponFormatter();
    const iklan = new Iklan();

    if ('participant' in req.body) {
      const canSendAd = await checkDelay(from);
      if (canSendAd) {
        await saveDelayed(from);
        return res.send(responFormatter.line(iklan.getIklan()).responAsText());
      } else return;
    }

    // Jika pesan berasal dari OWNER
    if (from === process.env.OWNER) {
      if (message.startsWith("/on")) {
        const args = message.slice(3).trim(); // Mengambil args setelah "/on"
        if (args) {
          await setON(args);
          const msg = responFormatter.line(`Bot aktif, Reason: ${args}`).responAsText();
          return res.send(msg);
        } else {
          const msg = responFormatter.line("Tolong sertakan alasan untuk perintah /on").responAsText();
          return res.send(msg);
        }
      } else if (message === "/off") {
        await setOFF();
        const msg = responFormatter.line("Bot balas pribadi sudah dimatikan.").responAsText();
        return res.send(msg);
      } else {
        const msg = responFormatter.line("Perintah tidak dikenali.").responAsText();
        return res.send(msg);
      }
    }

    // Jika pesan berasal dari pengguna lain dan bot aktif
    if (checkBotStatus().isActive) {
      const response = await GeminiAi.run(from, message);
      return res.send(responFormatter.line(response).responAsText());
    }

    return res.status(400).send("Permintaan tidak valid.");
  }
}

module.exports = Revandabot;
