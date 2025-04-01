const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const Revandabot = require("./src/core/Revandabot.js");
const RevandaBot = new Revandabot();
const Chizurubot = require("./src/core/Chizurubot.js")
const ChizuruBot = new Chizurubot();
const Amamiyabot = require("./src/core/Amamiyabot.js");
const AmamiyaBot = new Amamiyabot();
const Augustbot = require("./src/core/August.js");
const AugustBot = new Augustbot();
const helpers = require("./src/lib/helpers.js");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3210;

//create src/data/contacts.json if not exist
const fs = require("fs");
const pathcontact = `${__dirname}/src/data/contacts.json`;
if (!fs.existsSync(pathcontact)) {
  fs.writeFileSync(pathcontact, "[]");
}

app.use(bodyParser.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Ngapain kesini?");
});
app.post("/revanda", RevandaBot.process);
app.post("/chizuru", ChizuruBot.process);
app.post("/august", AugustBot.process);
app.post("/august-grup", AugustBot.processGrup);
app.post("/chizuru-grup", ChizuruBot.processGrup);
app.post("/amamiya", AmamiyaBot.process);
app.post("/addsubs", async (req, res) => {
  const { device, from, duration } = req.body;

  if (!from || !duration) {
    return res.status(400).json({ message: "Parameter 'from' dan 'duration' wajib diisi." });
  }

  try {
    const durationInDays = parseInt(duration, 10);
    if (isNaN(durationInDays) || durationInDays <= 0) {
      return res.status(400).json({ message: "Durasi harus berupa angka positif." });
    }
    const fromNumber = from.replace("@c.us", "").replace("@s.whatsapp.net", "").replace("@g.us", "");
    await helpers.saveSubscription(fromNumber, durationInDays);
    axios.post(`${process.env.WA_BOT_URL}/send-message`, {
      api_key: process.env.WA_BOT_API_KEY,
      sender: device,
      number: from,
      message: `Langganan untuk nomor ${from} telah ditambahkan selama ${durationInDays} hari.`
    });
    return res.status(200).json({ message: `Langganan untuk ${from} telah ditambahkan selama ${durationInDays} hari.` });
  } catch (error) {
    console.error("Error menambahkan langganan:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat menambahkan langganan." });
  }
});
//url static
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
