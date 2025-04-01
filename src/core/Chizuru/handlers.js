const { formatMenu } = require("./formatmenu");
const StickerWa = require("./stickerWa");
const GeminiAi = require("./geminiAi");
const ToramNews = require("./infoMT");
const hargaslot = require("./hargaslot");
const moeAPI = require("./moeAPI");
const downloaderApi = require("./downloaderApi");
const axios = require("axios");
const DyeExtractor = require("./dyeExtractor");
const fillstat = require("./fillstat");
const token = process.env.TORAM_API_TOKEN;
const auth = { headers: { Authorization: `Bearer ${token}` } };
const { checkSubscription, saveGroupSettings, loadSubscriptions } = require("../../lib/helpers.js");

const toramnews = new ToramNews();
const dyeExtractor = new DyeExtractor();
const hargaSlot = new hargaslot();
const moeApi = new moeAPI();
const dowloaderAPI = new downloaderApi();
const fillStat = new fillstat();

const handlers = {
  async welcome({ groupname, from, participants, participantsCount }) {
				const taggedParticipants = participants.map((participants) => `@${participants.split("@")[0]}`).join(" ");
				const {groupSettings} = await checkSubscription(from);
				const welcomeMessage = groupSettings.welcomeMsg;
    return `*Chizuru-chan🌸*
							
Selamat datang di *${groupname}* kak ${taggedParticipants}. Semoga betah disini ya🌸
        
${welcomeMessage}
          
Grup: ${groupname}
Jumlah member: ${participantsCount} member`;
  },

  async out({ participants }) {
    const taggedParticipants = participants.map((participant) => `@${participant.split("@")[0]}`).join(" ");
    return `*Chizuru-chan🌸*

Selamat jalan kak ${taggedParticipants}, karangan bunganya Chizu titip admin ya...🌸`;},

  async status({ groupname, from, statusVIP, remainingTime, participantCount }) {
    return `*𝐂𝐡𝐢𝐳𝐮𝐫𝐮-𝐜𝐡𝐚𝐧🌸*\n\n*${groupname}* (${from}@g.us)\nStatus VIP: ${statusVIP}\nSisa Langganan: ${remainingTime}\nJumlah Member: ${participantCount}\n\nPerpanjang durasi layanan Chizu hanya di revandastore.com`;
  },
  
  async menu() {
    return formatMenu();
  },

  async chizu({ name }) {
    return `*𝐂𝐡𝐢𝐳𝐮𝐫𝐮-𝐜𝐡𝐚𝐧🌸*\n\nどうも ありがとう ございます ~~\nIya tau, chizu cantik, makasih kak ${name}<3\nKetik */menu* untuk membuka list command yaa.`;
  },

  async sticker({ bufferImage }) {
    if (!bufferImage) {
      return "Please send an image with the command /sticker.";
    }
    const sticker = await StickerWa.create(bufferImage);
    return sticker; // Return sticker object for further processing
  },

  async lvlingChar({ args }) {
    if (args.length < 2) {
      return "Format salah. Gunakan /lvlchar [miniboss/boss] [lvl].";
    }
  
    const type = args[0].toLowerCase();
    const rawlv = parseInt(args[1], 10);
    let typem = "";
  
    if (type === "boss") typem = "Boss";
    else if (type === "miniboss") typem = "Miniboss";
    else return "Tipe harus 'boss' atau 'miniboss'.";
  
    if (isNaN(rawlv)) {
      return "Level harus berupa angka.";
    }
  
    try {
      const response = await axios.get(
        `https://torampedia.my.id/api/v1/leveling?level=${rawlv}&tipe=${typem}&range=9`,
        auth
      );
      const users = response.data.data;
  
      if (users.length === 0) {
        return "Tidak ada hasil untuk pencarian ini.";
      }
  
      // Hitung bonus EXP terlebih dahulu
      const usersWithBonus = users.map((data) => {
        const bonusExp = bonusexp(data.exp, rawlv, data.level);
        return { ...data, bonusExp }; // Tambahkan bonusExp ke data
      });
  
      // Urutkan berdasarkan bonus EXP (descending)
      const sorted = usersWithBonus.sort((a, b) => b.bonusExp - a.bonusExp);
  
      // Ambil 10 hasil teratas setelah diurutkan
      const topResults = sorted.slice(0, 10);
  
      // Buat template output
      return `*𝐂𝐡𝐢𝐳𝐮𝐫𝐮-𝐜𝐡𝐚𝐧🌸*\n\nSiap tuan, data ini diambil dari torampedia.my.id, sesuai permintaan<3\n╔═════════════\n${topResults
        .map((data) => bosstemplate(data, rawlv))
        .join("\n")}\n╚══〘 *Torampedia Database* 〙══`;
    } catch (error) {
      return `Terjadi kesalahan dalam pencarian. ${error.message}`;
    }
  },

  async lvlingBs({ args }) {
    if ((args.length < 1)) {
      return "Format salah. Gunakan /lvlbs [tec/non].";
    } else if (args[0] === "non") {
        return `*𝐂𝐡𝐢𝐳𝐮𝐫𝐮-𝐜𝐡𝐚𝐧🌸*
󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖
List untuk Non-Full TEC char:
- Lv 1-10: Baju Pengelana (Armor)
- Lv 8-18: Zirah Kulit (Armor)
- Lv 15-35: Tapal Minotaur (Tinju)
- Lv 35-50: Hard Knuckles (Tinju)
- Lv 50-65: Berserker Blade (THS)
- Lv 60-70: Folium Staff (Tongkat)/Phyto Blade (OHS)
- Lv 70-90: Pedang Indigo (OHS)
- Lv 85-100: Pedang Prajurit (OHS)
- Lv 100-120: Fusee Trahison (Bowgun)/Jubah Suci (Armor)
- Lv 120-140: Tombak Baskara (Tombak)
- Lv 140-155: Tombak Ignis (Tombak)
- Lv 155-165: Jubah Bulu Surgawi (Armor)
- Lv 165-170: Bakung Lelabah merah (Katana)
- Lv 170-175: Pedang Indigo (OHS)
- Lv 175-185: Zirah Pepagan (Armor)
- Lv 185-190: Busur/Pedang Vulture (Busur/THS)
- Lv 190-195: Senjata Venena II
- Lv 195-200: Pedang/Cakar Arachnida (OHS/Tinju)
- Lv 200-205: Baju Kaisar Iblis (Armor)
- Lv 205-210: Dara (Armor)
- Lv 210-215: Ular Putih (Katana)
- Lv 215-225: Pedang Dalam (OHS)
- Lv 225-230: Pedang Bara Api (Katana)
- Lv 230-240: Kostum Pengelabu (Armor)
- Lv 240-260: Jubah Pendeta Air (Armor)
	
> *Gunakan Perlengkapan DEX Untuk Meningkatkan Sedikit Difficulty*
> *Gunakan Perlengkapan STR Untuk Meningkatkan Sedikit Success Rate*`;
    } else if (args[0] === "tec") {
        return `*𝐂𝐡𝐢𝐳𝐮𝐫𝐮-𝐜𝐡𝐚𝐧🌸*
󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖
List untuk Full TEC CHAR:
- Lv 1-10: Baju Pengelana (Armor)
- Lv 10-140: Tombak Baskara (Tombak)/Baju Diomedea (Armor)
- Lv 140-185: Zirah Pepagan (Armor)
- Lv 185-200: Pedang/Cakar Arachnida (OHS/Tinju)
- Lv 200-240: Kostum Pengelabu (Armor)
- Lv 240-260: Jubah Pendeta Air (Armor)`;
    } else {
        return "Format salah. Gunakan /lvlingbs [tec/non].";
    }
  },

  async lvlingAlche() {
    return `*𝐂𝐡𝐢𝐳𝐮𝐫𝐮-𝐜𝐡𝐚𝐧🌸*
󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖󠇖
List Leveling Prof Alchemist:
╔═════════════
╠➥ Lv 1-10: Revita I
╠➥ Lv 10-30: Revita II
╠➥ Lv 31-55: Revita III
╠➥ Lv 56-80: Revita IV     
╠➥ Lv 81-105: Revita V
╠➥ Lv 106-135: Revita VI
╠➥ Lv 136-240: Orichalcum 
╠➥ Lv 241+: Orichalcum Murni
╚═════════════
						
Tingkatan padu/lock & Prof minimum:
╔═════════════
╠➥ Lock 1: Prof Alche Lv 0
╠➥ Lock 2: Prof Alche Lv 50
╠➥ Lock 3: Prof Alche Lv 100
╠➥ Lock 4: Prof Alche Lv 150
╠➥ Lock 5: Prof Alche Lv 200
╚═════════════`
  },

  async cariItem({ args }) {
    if (args.length < 1) {
      return "Tuliskan nama item yang ingin dicari setelah /item.";
    }
  
    const item = args.join("%20");
  
    try {
      const response = await axios.get(`https://torampedia.my.id/api/v1/item/${item}`, auth);
      const items = response.data.data;
  
      if (!items || items.length === 0) {
        return "Item tidak ditemukan.";
      }
  
      let itemDetails = `*Chizuru-chan🌸*\n\nBerikut informasi item yang ditemukan:\n`;
  
      items.forEach(item => {
        const nameId = item.name_id || "Tidak ada nama ID";
        const nameEn = item.name_en || "Tidak ada nama EN";
        const rarity = item.rarity || "Tidak ada informasi rarity";
        const proc = item.proc_to || "Tidak ada informasi";
        const sellPrice = item.sell_price ? `${item.sell_price} Spina` : "Tidak ada informasi harga jual";
        const amountPrice = item.amount_price ? `${item.amount_price} pt` : "";
        const dyes = item.dye
          ? `🎨 Dye A: ${item.dye.A}, Dye B: ${item.dye.B}, Dye C: ${item.dye.C}`
          : "Tidak ada informasi dye";
        const stats = item.stats.length
          ? item.stats.map(stat => `• ${stat.name}: ${stat.value}`).join("\n")
          : "Tidak ada informasi statistik";
        const droppedBy = item.dropped_by.length
          ? item.dropped_by.map(monster => `• ${monster.name_id} (Lv ${monster.level}, ${monster.type})`).join("\n")
          : "Tidak ada informasi monster drop";
  
        itemDetails += `\n*Nama:* ${nameId} (${nameEn})\n`;
        itemDetails += `*✨ Rarity:* ${rarity}\n`;
        itemDetails += `*💰 Harga Jual:* ${sellPrice}\n`;
        itemDetails += `*⏳ Dapat diproses:* ${proc} ${amountPrice}\n`;
       // itemDetails += `${dyes}\n`;
        itemDetails += `*📊 Stat:*\n${stats}\n`;
        itemDetails += `*📍 Diperoleh Dari:*\n${droppedBy}\n`;
        itemDetails += `*🔗 Link:* https://torampedia.my.id/item/${item.slug}\n`;
        itemDetails += `═════════════════════\n`;
      });
  
      return itemDetails;
    } catch (error) {
      return `Terjadi kesalahan dalam pencarian item. ${error.message}`;
    }
  },  

  async cariMonster({ args }) {
    if (args.length < 1) {
        return "Tuliskan nama monster yang ingin dicari setelah /monster."; 
    } else {
        const monsterName = args.join("%20");
        try {
            const response = await axios.get(`https://torampedia.my.id/api/v1/monster/${monsterName}`, auth);
            const monsters = response.data.data;

            if (!monsters || monsters.length === 0) {
                return "Monster tidak ditemukan.";
            }

            let monsterDetails = `*Chizuru-chan🌸*\n\nBerikut informasi monster yang ditemukan:\n`;

            monsters.forEach(monster => {
                const name = monster.name_en || monster.name_id;
                const level = monster.level;
                const element = monster.element || "Tidak diketahui";
                const exp = monster.exp || "0";
                const hp = monster.hp || "0";
                const mapName = monster.map ? (monster.map.name_en || monster.map.name_id) : "Tidak diketahui";
                const link = monster.id;

                const drops = monster.items.map(item => {
                    return `• ${item.name_en || item.name_id} (${item.rarity || "Tidak diketahui"})`;
                }).join('\n') || "Tidak ada informasi drop.";

                monsterDetails += `\n*👹 Nama:* ${name}\n`;
                monsterDetails += `*🎚️ Level:* ${level}\n`;
                monsterDetails += `*🔥 Elemen:* ${element}\n`;
                monsterDetails += `*🎖️ Base Exp:* ${exp}\n`;
                monsterDetails += `*❤️ HP:* ${hp}\n`;
                monsterDetails += `*📍 Lokasi:* ${mapName}\n`;
                monsterDetails += `*📦 Drops:*\n${drops}\n`;
                monsterDetails += `*🔗 Link:* https://toram-id.com/monster/${link}\n`;
                monsterDetails += `═════════════════════\n`;
            });

            return monsterDetails;
        } catch (error) {
            return `Terjadi kesalahan dalam pencarian monster. ${error.message}`;
        }
    }
  },


  async racikRumus() {
    return `*Chizuru-chan🌸*

Untuk menggunakan fitur ini, silahkan ketikkan stat yang ingin diisi, maksimal 8 list stat. PENTING: STAT MINUS WAJIB BERNILAI -1. Contoh:
---------------
/Weapon pot: 116

LIGHT 1
DTD% 22
CD 20
CD% 3
CR 28
HPREGEN -1
MPREGEN -1
DODGE -1
---------------
/Armor pot: 98

DTD% 22
CD 22
CD% 11
CR 28
M% -1
MPIERCE% -1
ACC -1
ACC% -1
---------------
*List prefix stat:*
A% (ATK%)
A (ATK)
M% (MATK%)
M (MATK)
S% (STR%)
S (STR)
D% (DEX%)
D (DEX)
I% (INT%)
I (INT)
V% (VIT%)
V (VIT)
AG% (AGI%)
AG (AGI)
CD% (Critical Damage%)
CD (Critical Damage)
CR% (Critical Rate%)
CR (Critical Rate)
DTF% (% luka ke Api)
DTE% (% luka ke Bumi)
DTW% (% luka ke Air)
DTA% (% luka ke Angin)
DTL% (% luka ke Cahaya)
DTD% (% luka ke Gelap)
ASPD (Kecepatan Serangan)
ASPD% (Kecepatan Serangan%)
CSPD (Kecepatan Merapal)
CSPD% (Kecepatan Merapal%)
FIRE (Unsur Api (no matching))
WATER (Unsur Air (no matching))
EARTH (Unsur Bumi (no matching))
WIND (Unsur Angin (no matching))
LIGHT (Unsur Cahaya (no matching))
DARK (Unsur Gelap (no matching))
FIREM (Unsur Api (matching))
WATERM (Unsur Air (matching))
EARTHM (Unsur Bumi (matching))
WINDM (Unsur Angin (matching))
LIGHTM (Unsur Cahaya (matching))
DARKM (Unsur Gelap (matching))
ACC (Accuracy)
DODGE (Dodge)
ACC% (Accuracy%)
DODGE% (Dodge%)
STAB% (Stability%)
MPIERCE% (Magic Pierce%)
PPIERCE% (Penetrasi Fisik%)
HPREGEN (Natural HP Regen)
MPREGEN (Natural MP Regen)
HPREGEN% (Natural HP Regen%)
MPREGEN% (Natural MP Regen%)
DEF (DEF)
MDEF (MDEF)
DEF% (DEF%)
MDEF% (MDEF%)
MRES% (Kekebalan Sihir%)
PRES% (Kekebalan Fisik%)`
  },

  async hargaSlot({ args }) {
    if (args.length < 1) {
      return "Tuliskan kategori item yang ingin dicek harganya setelah perintah. Contoh: /hargaslot knuck";
    }
  
    const input = args.join(" ").toLowerCase(); // Gabungkan argumen menjadi satu string
    const category = await hargaSlot.findCategory(input); // Cari kategori berdasarkan alias
  
    if (!category) {
      return "Maaf, kategori tersebut tidak ditemukan. Coba gunakan nama lain.";
    }
  
    return `*Chizuru-chan🌸*\n\n${category.title}:\n- Prime: ${category.prime}\n- Piercer: ${category.piercer}\n\nPM chizu bila harga berubah kak^^`;
  },  

  async bahanTas() {
    return `*Chizuru-chan🌸*

¤ 50-51
- Kulit Colon x1 (Colon; Tanah Pembangunan)
¤ 51-52
- Kulit Berkualitas x1 (Lavarca; Dataran Rakau)
¤ 52-53
- Spina x1.000
¤ 53-54
- Kulit Minotaur x1 (Minotaur; Kuil Runtuh: Area Terlarang)
- Pecahan Kristal Jingga x1 (Cobre; Danau Icule)
¤ 54-55
- Kulit Anjing Hutan x1 (Anjing Hutan; Hutan Marbabo: Bagian Dalam)
- Lencana Goblin x1 (Boss Goblin; Gua Ribisco: Bagian Dalam)
¤ 55-56
- Spina x2.000
¤ 56-57
- Bulu Mochelo x1 (Mochelo; Lereng Merapi A3)
- Kain Linen x10 (Crow Killer; Dusun Douce)
¤ 57-58
- Bulu Naga Giok x1 (Forestia; Tanah Kaos)
- Tanduk Berkualitas x10 (Bandot; Tanah Tinggi Yorl)
¤ 58-59
- Sabuk Bos Roga x1 (Boss Roga; Gua Bawah Tanah Saham: Ujung)
- Kain Beludu x10 (Orc Petarung; Gua Bawah Tanah Saham)
¤ 59-60
- Spina x4.000
¤ 60-61
- Cakar Beruang x2 (Violaccoon; Padang Darkanon)
- Sheeting Fabric x20 (Cassy; Makam Ratu Kuno: Area 2)
¤ 61-62
- Rantai Kukuh x2 (Pendekar Bertopeng; Tanah Tinggi Pertanian)
- Kain Polister x20 (Boneka Pengembara; Kota Hilang)
¤ 62-63
- Sisik Naga Sabana x2 (Naga Sabana Yelb; Desa Albatif)
- Kulit Serigala Alien x20 (Serigala Luar; Gerbang Dunia Lain: Area 1)
¤ 63-64
- Spina x8.000
¤ 64-65
- Jubah Sobek x2 (Goovua; Gurun Akaku: Bukit)
- Kulit Tupai x20 (Rodentail; Maia Diela)
¤ 65-66
- Tanduk Elang Zamrud x2 (Elang Zamrud; Teras Kerikil)
- Bulu Kambing x20 (Koza; Jurang Dunkel)
¤ 66-67
- Sayap Naga Senja x2 (Naga Senja; Benteng Solfini: Atap)
- Bulu Halus x20 (Little Snow Boar; Lembah Es Polde)
¤ 67-68
- Spina x16.000
¤ 68-69
- Rantai Penyucian x2 (Cerberus; Mata Air Kelahiran: Puncak)
- Kain Goyah x20 (Jewel Eye; Mata Air Kelahiran: Tengah)
¤ 69-70
- Benang Aranea x2 (Aranea; Taman Sublimasi: Pusat)
- Benang Laba-Laba Kecil x20 (Aramia; Taman Sublimasi: Area 2)
¤ 70-71
- Kain Dewi Tiruan x3 (Imitacia; Istana Gelap: Aula Besar)
- Kain Apung x10 (Flying Executioner; Buaian Prajurit)
- Tapak Lembut x20 (Bunny Summoner; Sungai Kegelapan)
¤ 71-72
- Surai Hewan Iblis x3 (Memecoleous; Istana Gelap: Area2)
- Bantalan Tapak Keras x10 (Manticore; Istana Gelap: Area1)
- Bulu Bayangan Hitam x20 (Shadow Fly; Istana Gelap: Area1)
¤ 72-73
- Spina 32.000
¤ 73-74
- Bulu Tapir x3 (Tapir; Graben Membara: Permukaan)
- Bulu Kaku x10 (Wooly; Graben Membara: Permukaan)
- Minyak Anti Karat x20 (Ornis Demi Machina; Garis Pertahanan Artileri Otomatis)
¤ 74-75
- Kain Kuno x3 (Proto Leon; Reruntuhan Singolaire: Lantai 3)
- Kulit Pohon Lunak x10 (Floral Bee; Situs Simcracker)
- Rambut Potum Kotor x20 (Slum Potum; Klaspe Kumuh)
¤ 75-76
- Tulang Raksasa Merah x3 (Dusk Machina; Pabrik Demi Machina Kecil: Area 2)
- Mantel Hitam Sobek x10 (Rugos Demi Machina; Pabrik Demi Machina Kecil: Area 2)
- Rantai Putus x20 (Machina Penyiksa; Pabrik Demi Machina Kecil: Area 2)
¤ 76-77
- Sisik Chimera x3 (Mozto Machina; Pabrik Demi Machina Besar: Bagian Terdalam)
- Benda Pendar Aneh x10 (Horn Machina; Pabrik Demi Machina Besar)
- Tentakel Tangguh x20 (Ledon Machina; Pabrik Demi Machina Besar)
¤ 77-78
- Spina x64.000
¤ 78-79
- Jubah Roh Hutan x3 (Lalvada; Hutan Monster: Bagian Dalam)
- Taring Tanaman x10 (Nepenthe; Hutan Monster)
- Kain Felt x20 (Naga Boneka; Mansion Lufenas)
¤ 79-80
- Aloi Lyark x3 (Gwaimol; Penjara Cuervo: Atap)
- Baju Penjaga Robek x10 (Sipir Lyark; Penjara Cuervo: Lantai 2)
- Kain Lembu x20 (Lyark Spesialis; Laboratorium Brahe: Area 2)
¤ 80-81
- Kain Bercahaya x4 (Seraph Machina: Menara Penembus Bumi: Sisi Dalam)
- Kulit Sintetis Rusak x20 (Lyark Brawler: Sekitar Alun-Alun Droma)
- Cawat Pengeksekusi x20 (Volo: Sekitar Alun-Alun Droma Area 2)
¤ 81-82
- Potongan Baju K. Kecil x4 (Venena: Istana Ultimea: Takhta)
- Pecahan Zirah Keras x20 (High Tigris: Istana Ultimea Gudang Demi Machina)
- Kulit Ular x20 (Ular Kolam: Reservoir Copia)
¤ 82-83
- Spina x100.000
¤ 83-84
- Kulit Mama Fluck x4 (Mama Fluck: Gua Pelupa)
- Daun Besar Colon x20 (Leedle Colon: Dataran Rokoko)
- Bulu Garis Vertikal x20 (Rakun Tambun: Hutan Curonne)
¤ 84-85
- Kain Rohani Mardula x4 (Mardula: Serambi Dewa Berkah)
- Kain Berkilau Misterius x20 (Malaikat Gelembung: Koridor Heresi/Kuil Para Dewa/Serambi Dewa Pembangunan/Serambi Dewa Istimewa)
- Bulu Kelabu x20 (Haliabubo: Reruntuhan G. Mithurna: Koridor Atas)
¤ 85-86
- Mantel Carbuncle x4 (Carbuncle: Serambi Dewa Pembangunan)
- Kain Rajut x20 (Malaikat Gelembung: Koridor Heresi)
- Ekor Beruang Berkantong x20 (Oddy: Kuil Para Dewa: Area 4/Serambi Dewa Pembangunan)
¤ 86-87
- Bulu Raja Piton x4 (Raja Piton: Pegunungan Elf: Kuil)
- Bulu Putih Lebat x20 (Bandot: Taman Es &Salju)
- Bulu Abu Kaku x20 (Silveria: Pegunungan Elf)
¤ 87-88
- Ingot Kuno x4 (Golem Preman: Kuil Naga Kegelapan: Tengah)
- Taring Serigala Es x20 (Corloup: Pegunungan Elf)
- Kain Gelap x20 (Soul Reaper: Kuil Naga Kegelapan)
¤ 88-89
- Spina x200.000
¤ 89-90
- Taring Tuscog x4 (Tuscog: Jalan Eryldan: Sekitar Hutan Ein)
- Sutra Ulat x20 (Tikus Lumut: Hutan Ein)
- Bulu Manusia Serigala x20 (Wolfret: Jalan Eryldan)
¤ 90-91
- Serpihan Kayu Kuzto x5 (Kuzto; Distrik Labilans: Alun-Alun)
- Bulu Cerpelai x20 (Satwal; Distrik Fabriska)
- Sabuk Pinggang Misterius x30 (Moculus; Distrik Fractum: Area 1)
¤ 91-92
- Kantong Kristal x5 (Nemopirania; Distrik Racetacula: Area 1)
- Ekor Lembut x20 (Alpoca; Distrik Labiland)
- Papula Kuat x30 (Toksinaria; Distrik Racetacula: Area 1)
¤ 92-93
- Sayap Repthon x5 (Repthon; Zona Riset Delzton: Area Terdalam)
- Kancing Polong x20 (Colon Marquis; Reruntuhan Mansion Lufenas Tua)
- Kain Perca Jas Panjang x30 (Gulingkar; Zona Riset Delzton: Area 1)
¤ 93-94
- Rambut Kaisar Siluman x5 (Venena Metacoenubia; Neo Plastida)
- Kain Merah Sobek x20 (Potum Bandit Gurun; Gurun Pasir Geist: Area 1) 
- Kulit Karatan x30 (Jasman; Reruntuhan Elban Urban)
¤ 94-95
- Spina x300.000
¤ 95-96
- Tulang Pisteus x5 (Pisteus; Pesisir Ducia: Area Terdalam)
- Kain Phantom x20 (Flooray; Dasar Tebing Lunagent)
- Bulu Berang-Berang Laut x30 (Lutris; Pesisir Ducia: Area 3)
¤ 96-97
- Sayap Arachnidemon x5 (Arachnidemon; Lembah Arche: Area Terdalam)
- Belenggu Logam x20 (Besy; Lembah Arche)
- Kulit Ular Aneh x30 (Coofer; Reruntuhan Kota Rokoko)
¤ 97-98
- Jangat Berlendir x5 (Datuk Nezim; Lahan Basah Nezim)
- Kain Enty x20 (Enty; Rimba Penyihir)
- Poros Kokoh x30 (Orang2an Sawah Seram; Rimba Penyihir: Area 2)
¤ 98-99
- Perca Gendam Geni x5 (Hexter; Rimba Penyihir: Area Terdalam)
- Piring Kappa x20 (Kappadon; Lahan Basah Nezim)
- Bulu Gagak x30 (Orang2an Sawah Seram; Rimba Penyihir: Area 2)
¤ 99-100
- Inti Latebra Menggeliat x5 (Trocostida; Nov Diela: Area 1)
- Cairan Lekat x20 (Juvestida; Nov Diela: Area 1)
- Kulit Pelik x30 (Mata Jahat; Padang Morga: Area 1)`;
  },

  async bahanMQ() {
    return `*Chizuru-chan🌸*

List bahan MQ:
- Sisik naga, Hard Dragon Skin (2pcs)
- Daging domba, Lamb Meat (1pcs)
- Sulur, Vine (3pcs)
- Paruh tebal, Thick Beak (3pcs)
- Sayap peri, Fairy Feather (3pcs)
- Koin ksatria, Swordsman Stone Coin (20pcs)
- Kulit kodok pasir, Sand Frog Skin (5pcs)
- Cakar binatang buas, Beast Claw (3pcs)
- Daging tikus pasir, Sand Mole Meat (1pcs)
- Taring bergerigi, Jagged Fang (10pcs)
- Kristal saham, Saham Crystal (5pcs)
- Permata jiwa, Spiritual Gemstone (1pcs)
- Anggur rokoko, Rokoko grape (5pcs)
- Kayu labilan, Labilan Woods (10pcs)
- Tanduk Patah, Broken Horn (20pcs)
- Bijih Berkembang, Growing Ore (5pcs)
- Batu Jabali, Jabali Stone (5pcs)`;
  },

  async kodeLive() {
    return `*Chizuru-chan🌸*

*Kode Reward Live Streaming*
Tanggal : 20 Mei 2024
Kode : dl1400man
Tipe Chat : Ucap
Lokasi : Pakar Padu Kota Sofya
Limit : 13.59 WIB
Hadiah :
- 100x Pecahan Orb
- 3x Life Potion`;
  },

  async infoFarmMats() {
    return `*Chizuru-chan🌸*
		
List spot farm mats:

~ Logam
1. Bone Dragonewt (Makam Ratu Kuno: Area 1)
Monster Lv: 45
Drop: Pelat Abu-Abu
2. Malaikat Gelembung (Kuil Para Dewa: Area 2)
Monster Lv: 143
Drop: Halo Terputus, Kerikil dewa
3. Laduro (Terowongan Cobaan)
Monster Lv: 214
Drop: Mineral Cantik
	
~ Kain
1. Underground Nemico (Saluran Bawah Tanah Ultimea: Tenggara)
Monster Lv: 109
Drop: Syal Lembut
2. Potum Semedi (Koridor Heresi)
Monster Lv: 134
Drop: Celemek Robek, Sayap Nirwana
3. Laduro (Terowongan Cobaan)
Monster Lv: 214
Drop: Kain Maling

~ Kayu
1. Machina Tumbuhan (Pembuangan Peligro)
Monster Lv: 93
Drop: Kayu Terkontaminasi, Kayu Peligro
1. Ivy (Kuil Naga Kegelapan: Tengah)
Monster Lv: 208
Drop: Sulur Rambat, Batang Tebal Muda
2. Pohon Parasit (Distrik Altoale)
Monster Lv: 152
Drop: Akar Pengisap Kehidupan, Benih Gulma, Daun Kering
	
~ Fauna 
1. Bone Dragonewt (Makam Ratu Kuno: Area 1)
Monster Lv: 45
Drop: Tulang Naga
2. Underground Nemico (Saluran Bawah Tanah Ultimea: Tenggara)
Monster Lv: 109
Drop: Kuping Kelelawar
		
~ Obat 
1. Grape Jelly (Saluran Bawah Tanah Ultimea: Tenggara)
Monster Lv: 110
Drop: Agar-Agar Merah Ungu, Cairan Asam Manis

~ Mana 
1. Summershell (Item[Event Summer])
2. Laduro (Terowongan Cobaan)
Monster Lv: 214
Drop: Bola Mata Redup`;
  },

  async infoDye() {
    const response = await dyeExtractor.scrapeDye();
    return response;
  },

  async infoAilment() {
    return `*Chizuru-chan🌸*

Berikut adalah daftar efek status buruk yang dapat diberikan kepada monster dan player:
1) Bergidik
- ke monster: Interupsi aksinya sejenak (Singkat)
- ke player: Interupsi tindakan mereka sejenak (Singkat)

2) Jatuh
- ke monster: Interupsi aksinya sejenak (Sedang)
- ke player: Interupsi tindakan mereka sejenak (Sedang)

3) Pingsan
- ke monster: Interupsi aksinya sejenak (Lama)
- ke player: Interupsi tindakan mereka sejenak (Lama)

4) Knock Back (Terpelanting)
- ke monster: Interupsi aksinya sejenak, terpelanting ke belakang untuk beberapa jarak
- ke player: Interupsi aksinya sejenak, terpelanting ke belakang untuk beberapa jarak

5) Poison (Racun)
- ke monster: Menimbulkan beberapa kerusakan untuk setiap tindakan selama 10 detik
- ke player: Menimbulkan kerusakan sebesar 5% dari sisa HP pada setiap tindakan, kerusakan ini tidak dapat membunuh pemain

6) Ignite (Terbakar)
- ke monster: Menimbulkan beberapa kerusakan untuk setiap 1 detik (3 detik) selama 10 detik
- ke player: Menimbulkan kerusakan sebesar 15% dari sisa HP terkini, kerusakan ini tidak dapat membunuh pemain

7) Freeze (Beku)
- ke monster: Mengurangi kecepatan gerak hingga 50%, berlangsung selama 10 detik. Dapat digunakan kembali saat durasi berakhir
- ke player: Mengurangi 50% kecepatan gerak (moontion speed) dan Ayunan Dewa (Godspeed Wield), Memiliki durasi 10 detik.

8) Slow (Lambat)
- ke monster: Mengurangi kecepatan gerakan target sebesar 50% (25% untuk bos). Memiliki durasi 10 detik
- ke player: Menurunkan 50% kecepatan berjalan (movement speed), durasi efek 10 detik. Evasion, Evasion recharge dan Shukuchi dinonaktifkan

9) Stop (Berhenti)
- ke monster: Mengikat musuh ke posisinya saat ini selama 10 detik, memiliki cooldown 60 detik. Lebih efektif untuk monster dan bos mini. Pola serangan seperti garis lurus atau serangan rapalan dapat digunakan saat mendapatkan debuff berhenti.
- ke player: Tidak dapat berpindah tempat atau berjalan, durasi 10 detik. Masih bisa menggunakan skil gerak (motion) dan rapalan seperti slash dapat digunakan saat mendapatkan debuff berhenti. Tidak dapat Evasion, Evasion recharge dan Shukuchi terhenti.

10) Dizzy (Pening)
- ke monster: Menurunkan tingkat guard dan evasion sebesar 100% (Boss 50%)
- ke player: Menonaktifkan Evasion dan Guard recharge

11) Dazzled (Silau)
- ke monster: Flee -50%
- ke player: -

12) Paralysis (Lumpuh)
- ke monster: Tingkatkan penundaan tindakan
- ke player: Mengurangi 50% ASPD (Attack Speed/Kecepatan Serangan)

13) Blind (Buta)
- ke monster: Mengurangi akurasi 50%
- ke player: Penurunan Akurasi sebesar 20% untuk serangan dalam jarak 7m, dan 40% untuk 8m ke atas

14) Fear (Takut)
- ke monster: 30% kemungkinan untuk membatalkan tindakan
- ke player: 30% peluang gagal mengeluarkan skill

15) Lethargy (Lesu)
- ke monster: Output kerusakan berkurang 30%
- ke player: Output kerusakan berkurang 30%

16) Weaken (Lemah)
- ke monster: Mengurangi MDEF target sebesar 25%.
- ke player: Menambah Biaya konsumsi MP untuk semua keterampilan +100

17) Bleed (Berdarah)
- ke monster: Tidak dapat menggunakan skill fisik
- ke player: Tidak dapat menggunakan skill fisik

18) Silence (Bisu)
- ke monster: Tidak dapat menggunakan skill sihir
- ke player: Tidak dapat menggunakan skill sihir

19) Confused
- ke monster: -
- ke player: -

20) Armor Break (Pecah Zirah)
- ke monster: DEF & MDEF -50%
- ke player: Mengurangi kekebalan fisik dan sihir hingga 50%, tidak dapat menggunakan Guard

21) Fatigue (Lelah)
- ke monster: Mengurangi stabilitas 50%, pada serangan durasi terakhir akan mengalami graze.
- ke player: Mengurangi stabilitas 50%, pada serangan durasi terakhir akan mengalami graze.

22) Sleep (Tidur)
- ke monster: Melumpuhkan untuk waktu yang lama, bangun saat menerima serangan, Bos memulihkan 3% dari HP maksimal saat bangun
- ke player: Melumpuhkan untuk waktu yang lama, bangun saat menerima serangan, mengaktifkan regenerasi alami

23) Mana Explosion (Ledakan Mana)
- ke monster: -
- ke player: Setelah durasi berakhir, konsumsi semua mp menjadi 0 dan memberikan damage sama dengan konsumsi mp x10

24) Sick (Sakit)
- ke monster: Menurunkan resistensi status buruk sebesar -50% (masih dapat terkena bahkan jika Anda memiliki resistensi status buruk 100%)
- ke player: Menurunkan resistensi status buruk sebesar -50% (masih dapat terkena bahkan jika Anda memiliki resistensi status buruk 100%)

25) Curse (Terkutuk)
- ke monster: Menurunkan CRT damage pemain sebesar -50%
- ke player: Menurunkan CRT damage pemain sebesar -50%

26) Item Disable
- ke monster: -
- ke player: Tidak dapat menggunakan barang

27) Overdrive (Lari)
- ke monster: -
- ke player: Mengonsumsi HP saat MP tidak mencukupi untuk melakukan skill, juga menerapkan tenacity (Gigih) ke semua skill dalam kombo (tidak mengganti tag yang ada)

28) Suction (Pengisapan)
- ke monster: Menarik ke pusat serangan, 50% peluang tarik untuk Bos
- ke player: Menarik ke pusat serangan, saat terkena menonaktifkan evasion dan Guard selama 1 detik

29) Petrified (Kaku)
- ke monster: Menghindar Mutlak +100%, & menghapus aggro saat ini sebesar 99%
- ke player: Menghindar Mutlak +100%, & menghapus aggro saat ini sebesar 99%

30) Inversion (Inversi)
- ke monster: -
- ke player: Mengganti HP% dan MP% Anda saat ini`;
  },

  async ninjaScroll() {
    return `*Chizuru-chan🌸*

"Ninja kok jadi petani?" ~Chizu

Rapid Aqua Vortex + Throwing Kunai:
THS, STAFF, BOWGUN
BOWGUN, THS, MD
BOWGUN, MD, HALBERD
BOW, OHS, KNUCKLE
BOW, KATANA, OHS
BOW, KATANA, KNUCKLE
OHS, BOW, KATANA
STAFF, THS, MD
STAFF, THS, HALBERD

Rumus lainnya:
https://torampedia.my.id/tools/ninja_simulator`;
  },

  async kalkulatorQuest () {
    return `*Chizuru-chan🌸*

Tools mq calculator dapat dengan mudah diakses disini kak, selalu diperbarui setiap update.
https://torampedia.my.id/tools/mq_calculator`;
  },

  async buffFood() {
    return `*Chizuru-chan🌸*
		
Jangan lupa izin kalau mau maling (ʘᴗʘ✿)

MAX HP★		
Code: 1010032	LVL 10
Code: 1010084	LVL 10
Code: 1011945	LVL 10
Code: 1234567	LVL 10
Code: 3011143	LVL 10
Code: 7121252	LVL 9
Address: Sofya-A-420	LVL 9

MAXMP★
Code: 3204544	LVL 10
Code: 6010021	LVL 10
Code: 6070013	LVL 10
Code: 1011212	LVL 10
Code: 1016646	LVL 10
Code: 4011793	LVL 10
Code: 1010013	LVL 10
Code: 4011793	LVL 10
Code: 1011212	LVL 10

AMPR★		
Code: 1011010	LVL 10
Code: 3063101	LVL 10
Code: 1010006	LVL 10
Code: 1011010	LVL 10
Code: 1023040	LVL 10
Code: 3062728	LVL 10
Code: 1010017	LVL 10
Code: 1010092	LVL 10
Code: 5240001	LVL 10
Code: 1010050	LVL 10
Code: 1019696	LVL 10
Code: 3226325	LVL 10
Code: 5010103	LVL 10
Code: 2011111	LVL 8

CRITICAL RATE★		
Code: 1010006	LVL 10
Code: 1010092	LVL 10
Code: 1010017	LVL 10
Code: 1010050	LVL 10
Code: 1011010	LVL 10
Code: 1012000	LVL 10
Code: 7162029	LVL 10
Code: 1100000	LVL 10
Code: 1069927   LVL 10
Code: 1012000   LVL 10
Code: 3061206   LVL 9
Code: 3246969   LVL 9
Code: 7190311   LVL 9
Code: 1010011   LVL 9 

WEAPON ATK★
Code: 1010029   LVL 10
Code: 1010099   LVL 10
Code: 6010024   LVL 10
Code: 1011126   LVL 10
Code: 2020404   LVL 10
Code: 2010136   LVL 10
Code: 3070028   LVL 9
Code: 7162029   LVL 9

STR★
Code: 1110033   LVL 10
Code: 1011069   LVL 10
Code: 7031997   LVL 10 
Code: 7070777   LVL 10
Code: 4016699   LVL 10
Address: Elscaro-A-1   LVL 9

DEX★
Code: 5010092   LVL 10
Code: 1010106   LVL 10
Code: 7011001   LVL 10
Code: 2020222   LVL 10
Code: 1010058   LVL 10
Code: 4204200   LVL 8
Code: 3011143   LVL 8

INT★
Code: 2020707   LVL 10
Code: 1032222   LVL 10
Code: 6061294   LVL 10
Code: 1010489   LVL 10
Code: 6010701   LVL 10
Address: Elscaro-z-1234  LVL 8

AGI★
Code: 7162029    LVL 10
Code: 4010228    LVL 8

ACCURACY★
Code: 4261111    LVL 10
Code: 1010013    LVL 9

MAGICAL RESIST★
Code: 1010004   LVL 10
Code: 4080087   LVL 9
Code: 7227777   LVL 9

PHYSICAL RESIST★
Code: 1020001   LVL 10
Code: 1100000   LVL 10
Code: 1018989   LVL 9
Code: 1100000   LVL 9

FRACTIONAL BARRIER★
Code: 1222002   LVL 8
Code: 6181999   LVL 8

+AGGRO%★
Code: 3030110   LVL 10
Code: 1264321   LVL 10
Code: 6262000   LVL 9
Code: 1190069   LVL 9
Code: 1016646   LVL 10
Code: 1014230   LVL 9
Code: 1013000   LVL 9
Address: Sofya-A-4510 LVL 9

-AGGRO%★
Code: 1010038   LVL 10
Address: Sofya-A-2   LVL 10
Code: 3061206   LVL 8

DTE EARTH★
Code: 3210103   LVL 9
Code: 2022222   LVL 8
Code: 2020202   LVL 8
Code: 4083005   LVL 8 
Code: 2099876   LVL 7
Code: 1010174   LVL 7 
Code: 5240001   LVL 7
Code: 3011143   LVL 7
Code: 1016646   LVL 7
Code: 1010002   LVL 6

DTE WIND★
Code: 3210101   LVL 9
Code: 3030303   LVL 8
Code: 1010055   LVL 7 
Code: 4099876   LVL 7   
Code: 1010055   LVL 7

DTE WATER★
Code: 3210100   LVL 9
Code: 7150030   LVL 9
Code: 3062111   LVL 8
Code: 7011001   LVL 8
Code: 1110007   LVL 7
Code: 3226325   LVL 6

DTE FIRE★
Code: 3210106   LVL 9
Code: 7011001   LVL 8
Code: 1010799   LVL 7
Code: 1012610   LVL 5

DTE LIGHT★
Code: 3210105   LVL 9
Code: 1020345   LVL 9
Code: 4046666   LVL 8
Code: 4016699   LVL 6

DTE DARK★
Code: 3210104   LVL 9
Code: 5010092   LVL 9
Code: 6010003   LVL 8
Code: 1010006   LVL 7
Code: 1016646   LVL 7
Code: 1091111   LVL 7
Code: 3030069   LVL 7

DTE NEUTRAL★		
Code: 3210102   LVL 9
Code: 3099876   LVL 7
Code: 1011902   LVL 7
Code: 6061294   LVL 7
Code: 1019696   LVL 6
Code: 1032727   LVL 5

Drop Rate★		
Code: 4196969	LVL 6

> *Mau buff kakak Chizu cantumkan disini? PM Chizu aja*`;
  },
  
  async kamusToram() {
    return `*Chizuru-chan🌸*
		
Silakan dicari berdasarkan abjad

1H/OHS/P1T: Pedang 1 Tangan
2H/THS/P2T: Pedang 2 Tangan
Aggro: Ketertarikan musuh untuk menyerang kamu
AMPR: Attack MP Recovery (Bonus MP pulih pada setiap basic attack)
App: Tampilan barang
Arm: Armor (Zirah)
B): Buy (Beli)
brb: be right back (Saya akan kembali)
BS: Blacksmith/Black Shadow (Sesuai Konteks)
bwing: bird wing (sayap burung)
CF: Cross fire (skill bow)
DC: Draconic charge (skill tombak)
DT: Dragon tooth (skill tombak)
DPS: Damage per second (Pemberi damage ke musuh)
DS: Dual Sword (Pedang ganda)
DTE: Damage to element (Bonus damage jika elemen sesuai)
Dye: Pewarna barang
fb: full break (mendapatkan semua pemecahan bagian)
fk: fast kill
gtg: got to go (Saya harus pergi)
guild: Serikat
lfm: looking for member (Mencari anggota regu)
lfp: looking for party (Mencari regu)
Lock: Skill Padu Item
Mats: Poin Material (Logam, kayu, dll.)
MD: Magic Device (Pesawat Sihir)
mk: mass kill (membunuh lawan jumlah banyak)
MQ: Main Quest (Misi Utama)
NP: No Problem
Prof: Proffiency (Kemahiran)
pt: Party/Point (Sesuai Konteks)
Reff: Refine
RTE: Resist to element
S): Sell (Jual)
SH: Soul Hunter (Skill buku kegelapan)
t4: Skill lvl 4 (terbuka di lvl 150)
t5: Skill lvl 5 (Terbuka di lvl 250)
T): Trade (Barter)
thunt: treasure hunt (mencari harta karun)
typt: Thanks Party (Wajib ucapkan saat keluar regu)
UCB: Under Consignment Board (Lebih murah dari harga papan)
xcht: salah chat
Xtall: Crysta

Chat Chizuru kalau ada yang mau ditambahkan (ﾉ◕ヮ◕)ﾉ*.✧`;
  },

  async petLvling() {
    return `*Chizuru-chan🌸*

Tips Leveling Pet:
1. Pastikan cinta nya 100%
2. Ajak ke boss dengan syarat agar exp masuk
a. Pet harus dalam keadaan hidup saat pertempuran berakhir. 
b. Pet udah nyentuh bossnya dengan hit/nge skill tanpa miss, atau pet mp regen.

Lvling Pet:
- 01-40 Masked Normal 
- 40-46 Masked Hard 
- 46-72 Masked NM
- 72-95 Masked Ulti 
- 95-102 Cerberus NM
- 102-160 Cerberus Ulti
- 150-160 Venena1 NM
- 160-220 Venena1 Ulti
- 160-175 Pilz Erosi NM
- 180-220 Pilz Erosi Ulti
- 188-220 Titan Kristal 
- 190-220 Finstern Ulti
- 210-260 Venena meta Ulti
- 210-230 Kuzto Ulti
- 210-240 Gravicep Ulti
- 220-270 Ferzen Naga Batu Ulti
- 250- 270 Walican NM
- 260-290 Naga Penyamar Mimyugon Ulti

Versi Singkat: 
- 1-70 Masked NM
- 70-100 Masked Ulti 
- 100-160 Cerberus Ulti 
- 160-220 Venena1 Ulti
- 200-cap Venena meta Ulti 

Jalur Miniboss:
- 1-50 Big Mask (Map:  Ngarai Haotas)
- 51-81 Metal Stinger (Map: Gurun Akaku: Area 2)
- 81-110 Don Yeti (Map: Lembah Es Polde)
- 111-160 Jamur Super Mampus (Map: Hutan Monster: Jalan Hewan)
- 161-210 Violangkara (Map: Bongkahan Morthell: Area 3)
- 211-248 Ketua Bandit Gurun (Map: Gurun Pasir Geist: Area 3)
- 245-300 Trus (Map: Zona Mekanisme Penggerak: Tangki Daya )
- 250-300 Lilicarolla (Map: Air Terjun Beku: Area 1)

Credits to: PET TORAM ONLINE INDO`;
  },

  async arrowElemental() {
    return `*Chizuru-chan🌸*

*API*
🔥 Panah Api (Sunion [Cermin Kegelapan])
-> Base ATK: 43 (20%)
🔥 Panah Cinta (Event Valentine)
-> Base ATK: 71 (20%) 
🔥 Panah Kaisar Iblis (Venena Metacoenubia [Neo Plastida])
-> Base ATK: 120 (10%)

*AIR*
💧 Panah Cermin Cinta (Quest Arwah Peneliti - Lv 78 [Halaman Awal Mula])
-> Base ATK: 37 (20%)
💧 Panah Tangis Langit (Floragonet [Distrik Fractum: Area 1])
-> Base ATK: 84 (20%)
💧 Panah Samudra (Event Summer)
-> Base ATK: 110 (10%)

*ANGIN*
🌪️ Panah Topan (Forestia [Tanah Kaos])
-> Base ATK: 12 (15%)
🌪️ Panah Apel (Coryn [Distrik Dikkit])
-> Base ATK: 92 (15%)
🌪️ Panah Ratu Lebah (Event Valentine)
-> Base Atk : 150 (20%)

*BUMI*
🌏 Pointed Ore Arrow (Tikus Gua [Reruntuhan Singolare : Lantai 1])
-> Base ATK: 43 (20%)
🌏 Panah Cacao (Event Valentine)
-> Base ATK: 50 (20%)
🌏 Guardian Forest Arrow (Arbogazella [Guardian Forest: Lost Woods])
-> Base ATK: 163 (20%)

*GELAP*
🖤 Panah Duri (Ivy [Kuil Naga Kegelapan: Bawah])
-> Base ATK: 79 (20%)
🖤 Panah Sakura Senja (Amalgam [Event Hanami])
-> Base ATK: 100 (20%)
🖤 Specter Arrow (Manomare [Event Halloween])
-> Base ATK: 120 (20%)

*CAHAYA*
⚡ Flash Volt (Quest Npc Juan - Lvl68 [El Scaro])
-> Base ATK: 3 (15%)
⚡ Panah Seni Permen (Event White Day)
-> Base ATK: 56 (20%)
⚡ Panah Pohon Suci (Santabby [Event Natal])
-> Base ATK: 100 (20%)

*NETRAL*
⚪ Dreamy Arrow (Dreamy Scarlet Sakura [Hanami Event])
-> Base ATK: 136 (20%)
⚪ Driver Bolt (Inspector Golem [Event Natal])
-> Base ATK: 200 (20%)`;
  },

  async buildToram() {
    return `*Chizuru-chan🌸*

Build disini hanya sekedar referensi. Semua skill, combo, regislet, dan eq, menyesuaikan dengan playstyle.
Build pribadi by: R e v a n d a
Jenis: Tier 5 Build (Lv 290)
https://drive.google.com/drive/folders/1CtXe-jDXEfsrpSwvrDbfBaA5un6X00ge`;
  },

  async mtTerbaru() {
    const response = await toramnews.fetchLatestNews();
    return response;
  },

  async cariAnime({ args }) {
    if (args.length < 1) {
      return "Tuliskan judul anime yang ingin dicari setelah /carianime.";
    } else {
      const query = args.join(" ");
      const response = await moeApi.searchAnime(query);
      return response;
    }
  },

  async cariManga({ args }) {
    if (args.length < 1) {
      return "Tuliskan judul manga yang ingin dicari setelah /carimanga.";
    } else {
      const query = args.join(" ");
      const response = await moeApi.searchManga(query);
      return response;
    }
  },

  async anime({ args }) {
    if (args.length < 1) {
      return "Format tidak lengkap. /anime recommendations/top/random";
    } else if (args[0] === "recommendations" || args[0] === "random" || args[0] === "top") {
      const query = args[0];
      const response = await moeApi.getAnime(query);
      return response;
    } else {
      return "Format tidak dikenali. /anime recommendations/top/random";
    }
  },

  async manga({ args }) {
    if (args.length < 1) {
      return "Format tidak lengkap. /manga recommendations/top/random";
    } else if (args[0] === "recommendations" || args[0] === "random" || args[0] === "top") {
      const query = args[0];
      const response = await moeApi.getManga(query);
      return response;
    } else {
      return "Format tidak dikenali. /manga recommendations/top/random";
    }
  },
  
  async cariRegistlet({ args }) {
    if (args.length < 1) {
      return "Tuliskan nama registlet yang ingin dicari setelah /cariregistlet.";
    }
    const query = args.join(" ");
    try {
      const response = await axios.get(`https://torampedia.my.id/api/registlet/search/${query}`);
      const data = response.data;
      if (data.length === 0) {
          return "Tidak ada hasil yang ditemukan untuk pencarian ini.";
      }
      let resultMessage = "*Chizuru-chan🌸*\nSiap kak, ajak member lain kalau mau Stoodie:\n";
      data.forEach((item, index) => {
          resultMessage += `\n*Nama:* ${item.name_en}\n`;
          resultMessage += `*Max Lv:* ${item.max}\n`;
          resultMessage += `*Efek:* ${item.effect_en}\n`;
          resultMessage += `*Dari:* Stoodie ${item.froms}\n`;
      });
      return resultMessage;
  } catch (error) {
      console.error('Error fetching registlet data:', error.message);
      return 'Terjadi kesalahan dalam pencarian registlet.';
  }
  },
  async ongoingAnime() {
    const response = await moeApi.ongoingAnime();
    return response;
  },

  async randomQuote() {
    try {
      const response = await axios.get(`https://katanime.vercel.app/api/getrandom`);
      const quotes = response.data.result;
      const formattedQuotes = quotes.map(quote => {
        return `_"${quote.indo}"_   
  *~${quote.character} (${quote.anime})*
  `;
      });
      return `*Chizuru-chan🌸*
      
  ${formattedQuotes.join("\n")}`;
    } catch (error) {
      console.error('Terjadi kesalahan:', error.message);
      return 'Terjadi kesalahan dalam pencarian.';
    }
  },

  async reqFitur({ device, args }) {
    if (args.length < 1) {
      return "Tuliskan fitur yang ingin di request setelah /reqfitur.";
    } else {
      const query = args.join(" ");
      try {
        await axios.post(`${process.env.WA_BOT_URL}/send-message`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: 6285159199040,
          message: `Request fitur: ${query}`
        });
        return "Fitur berhasil direquest ke owner. Terima kasih.";
      } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        return 'Terjadi kesalahan dalam request fitur.';
      }
    }
  },

  async infoBot() {
    return `*Chizuru-chan🌸*

Create with love by Revanda,
Bot ini dibuat untuk membantumu dalam mencari informasi seputar Toram Online.
Bot ini masih terus dikembangkan, jadi mohon maaf jika masih ada beberapa fitur yang belum berjalan dengan baik.
Jika kamu memiliki saran atau pertanyaan, silakan chat Chizuru-chan.
Terima kasih sudah menggunakan Chizuru-chan🌸

Katalog bot: https://revandastore.com/katalog/11
Owner Chizuru: https://github.com/yogadev1990`;
  },

  async help() {
    return `*Chizuru-chan🌸*

Panduan dasar penggunaan Chizuru Bot by Revanda:
1. Untuk melihat menu, ketik *menu*.
2. Selalu gunakan huruf kecil untuk setiap command.
Contoh: *mt terbaru*, *info dye*
3. Bila ada tanda [ ] artinya command dinamis. Masukan perintah *tanpa menulis* [ ].
Contoh: *harga slot ohs*, *cari item proto*
4. Bila ada tanda / (slash) artinya pilih salah satu.
Contoh: *lvling char miniboss 200*
5. Untuk *stikerin*, kirim gambar dahulu, lalu balas gambar tersebut dengan *stikerin*.
6. Menu admin hanya boleh diakses admin grup.
7. Admin dapat custom pesan welcome, hubungi Revanda.
8. Bantuan owner, [Revanda] 085159199040.`;
  },
  
  async ai({ from, args }) {
    if (!args || args.length === 0) {
      return "Tuliskan pesan Anda setelah /ai.";  // Prompt if no input is provided
    }
  
    const message = args.join(" ");  // Join arguments into a single message
    const response = await GeminiAi.run(from, message);  // Pass 'from' and the message to Gemini AI
    return response;  // Return the AI's response
  },  

  async tiktok({ args }) {
    if (args.length < 1) {
      return "Tuliskan link video yang ingin di download setelah /tiktok.";
    } else {
      const url = args[0];
      const response = await dowloaderAPI.tiktok(url);
      return response;
    }
  },

  async fb({ args }) {
    if (args.length < 1) {
      return "Tuliskan link video yang ingin di download setelah /fb.";
    } else {
      const url = args[0];
      const response = await dowloaderAPI.facebook(url);
      return response;
    }
  },

  async ig({ args }) {
    if (args.length < 1) {
      return "Tuliskan link video yang ingin di download setelah /ig.";
    } else {
      const url = args[0];
      const response = await dowloaderAPI.instagram(url);
      return response;
    }
  },

  async add({ admin, botadmin, args, from, device }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
    
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
    
    if (args.length < 1) {
      return "Tuliskan nomor HP yang ingin ditambahkan setelah /add.";
    }
  
    const number = args[0] + "@s.whatsapp.net";
    const grupid = from + "@g.us";
    try {
      await axios.post(`${process.env.WA_BOT_URL}/participant`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: number,
          group_id: grupid,
          action: "add",
        });}
        catch (error) {
          console.error("Error menambahkan peserta:", error);
          return "Gagal menambahkan peserta.";
        }
  },
  
  async kick({ admin, botadmin, args, from, device }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
    
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
    
    if (args.length < 1) {
      return "Tuliskan nomor HP/Tag orang yang ingin dikeluarkan setelah /kick.";
    }
  
    const number = args[0];
    const mention = number.replace(/@/g, "") + "@s.whatsapp.net";
    const grupid = from + "@g.us";

    axios.post(`${process.env.WA_BOT_URL}/participant`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: mention,
          group_id: grupid,
          action: "remove",
        });
        
        return `Mengeluarkan nomor ${number} dari grup...`; // Ganti dengan logika yang sesuai
  },

  async promote({ admin, botadmin, args, from, device }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
    
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
    
    if (args.length < 1) {
      return "Tuliskan nomor HP/Tag orang yang ingin di promote setelah /promote.";
    }
  
    const number = args[0];
    const mention = number.replace(/@/g, "") + "@s.whatsapp.net";
    const grupid = from + "@g.us";

    axios.post(`${process.env.WA_BOT_URL}/participant`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: mention,
          group_id: grupid,
          action: "promote",
        });
        
        return `Nomor ${number} berhasil di promote dari grup...`; // Ganti dengan logika yang sesuai
  },

  async demote({ admin, botadmin, args, from, device }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
    
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
    
    if (args.length < 1) {
      return "Tuliskan nomor HP/Tag orang yang ingin demote setelah /demote.";
    }
  
    const number = args[0];
    const mention = number.replace(/@/g, "") + "@s.whatsapp.net";
    const grupid = from + "@g.us";

    axios.post(`${process.env.WA_BOT_URL}/participant`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: mention,
          group_id: grupid,
          action: "demote",
        });
        
        return `Nomor ${number} berhasil di demote dari grup...`; // Ganti dengan logika yang sesuai
  },

  async antiToxic({ admin, botadmin, args, from }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
    
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
      try {
        await saveGroupSettings(from, {
          antiToxic: true,
        });
        return `Anti toxic diaktifkan.`;
      } catch (error) {
        console.error("Error mengaktifkan pesan keluar:", error);
        return "Gagal mengaktifkan Anti toxic.";
      } 
    } else if (status === "off") {
      try {
        await saveGroupSettings(from, {
          antiToxic: false,
        });
        return "Anti toxic dimatikan.";
      } catch (error) {
        console.error("Error mematikan pesan keluar:", error);
        return "Gagal mematikan Anti toxic.";
      }
    } else {
      return "Tuliskan *on* atau *off* setelah /antitoxic.";
    } // Ganti dengan logika yang sesuai
  },

  async antiLink({ admin, botadmin, args, from }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
    
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
  
    const status = args[0]?.toLowerCase();

    if (status === "on") {
      try {
        await saveGroupSettings(from, {
          antiLink: true,
        });
        return `Anti link diaktifkan.`;
      } catch (error) {
        console.error("Error mengaktifkan pesan keluar:", error);
        return "Gagal mengaktifkan Anti link.";
      } 
    } else if (status === "off") {
      try {
        await saveGroupSettings(from, {
          antiLink: false,
        });
        return "Anti link dimatikan.";
      } catch (error) {
        console.error("Error mematikan pesan keluar:", error);
        return "Gagal mematikan Anti link.";
      }
    } else {
      return "Tuliskan *on* atau *off* setelah /antilink.";
    } // Ganti dengan logika yang sesuai
  },

  async welcomeMsg({ admin, botadmin, args, from }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
  
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
  
    const status = args[0]?.toLowerCase();
    const customMessage = args.slice(1).join(" "); // Pesan opsional setelah 'on' atau 'off'
  
    if (status === "on") {
      try {
        await saveGroupSettings(from, {
          welcome: true,
          welcomeMsg: customMessage || "Selamat datang di grup!",
        });
        return `Pesan selamat datang diaktifkan. Pesan: "${customMessage || "Selamat datang di grup!"}"`;
      } catch (error) {
        console.error("Error mengaktifkan pesan selamat datang:", error);
        return "Gagal mengaktifkan pesan selamat datang.";
      } 
    } else if (status === "off") {
      try {
        await saveGroupSettings(from, {
          welcome: false,
        });
        return "Pesan selamat datang dimatikan.";
      } catch (error) {
        console.error("Error mematikan pesan selamat datang:", error);
        return "Gagal mematikan pesan selamat datang.";
      }
    } else {
      return "Tuliskan *on* atau *off* setelah /welcomemsg. Opsional: tambahkan pesan setelah 'on'.";
    }
  },  

  async outMsg({ admin, botadmin, args, from }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
  
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
  
    const status = args[0]?.toLowerCase();
    const customMessage = args.slice(1).join(" ");
  
    if (status === "on") {
      try {
        await saveGroupSettings(from, {
          out: true,
          outMsg: customMessage || "Selamat tinggal!",
        });
        return `Pesan keluar diaktifkan.`;
      } catch (error) {
        console.error("Error mengaktifkan pesan keluar:", error);
        return "Gagal mengaktifkan pesan keluar.";
      } 
    } else if (status === "off") {
      try {
        await saveGroupSettings(from, {
          out: false,
        });
        return "Pesan keluar dimatikan.";
      } catch (error) {
        console.error("Error mematikan pesan keluar:", error);
        return "Gagal mematikan pesan keluar.";
      }
    } else {
      return "Tuliskan *on* atau *off* setelah /outmsg. Opsional: tambahkan pesan setelah 'on'.";
    }
  },

  async rulesedit({ admin, botadmin, args, from }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
  
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }
  
    const customMessage = args.slice(0).join(" "); // Pesan opsional setelah 'on' atau 'off'
      try {
        await saveGroupSettings(from, {
          rules: customMessage || "Rules belum diatur.",
        });
        return `Rules diaktifkan. Pesan: "${customMessage || "Rules belum diatur."}"`;
      } catch (error) {
        console.error("Error mengaktifkan rules:", error);
        return "Gagal mengaktifkan rules.";
      }
  },

  async rules({ from }) {
    const {groupSettings} = await checkSubscription(from);
    return groupSettings.rules || "Rules belum diatur.";
  },

  async alltag({ admin, botadmin, args, from, device }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
  
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }

    if (args.length < 1) {
      return "Tuliskan pesan yang ingin disampaikan setelah /alltag.";
    }

    const customMessage = args.slice(0).join(" ");
    const grupid = from + "@g.us";
      try {
        await axios.post(`${process.env.WA_BOT_URL}/tagall`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: grupid,
          message: customMessage,
        });
      } catch (error) {
        console.error("Error mengaktifkan tags:", error);
        return "Gagal mengaktifkan tags.";
      }
  },

  async randomtag({ admin, botadmin, from, device }) {
    if (!botadmin) {
      return "Maaf, bot belum diangkat menjadi admin.";
    }
  
    if (!admin) {
      return "Maaf, perintah ini hanya bisa diakses oleh admin grup.";
    }

    const grupid = from + "@g.us";
      try {
        await axios.post(`${process.env.WA_BOT_URL}/tagrandom`, {
          api_key: process.env.WA_BOT_API_KEY,
          sender: device,
          number: grupid,
        });
      } catch (error) {
        console.error("Error mengaktifkan tags:", error);
        return "Gagal mengaktifkan tags.";
      }
  },

  async fillstats(parsedmessage) {
    const response = await fillStat.fillStat(parsedmessage);
    return response;
  },

  async broadcast({args, device}) {
    if (args.length < 1) {
      return "Tuliskan pesan yang ingin disampaikan setelah /broadcast.";
    }
  
    const customMessage = args.slice(0).join(" ");
    const allGroups = await loadSubscriptions();
  
    // Filter hanya grup dengan langganan aktif
    const now = new Date();
    const activeGroups = allGroups.filter((group) => new Date(group.expiryDate) > now);
  
    if (activeGroups.length === 0) {
      return "Tidak ada grup yang aktif untuk menerima broadcast.";
    }
  
    try {
      for (const group of activeGroups) {
        await axios.post(`${process.env.WA_BOT_URL}/send-message`, {
          api_key: process.env.WA_BOT_API_KEY,
          number: group.from + "@g.us",
          sender: process.env.WA_BOT_DEVICE,
          message: customMessage,
        });
      }
      return `Broadcast berhasil dikirim ke ${activeGroups.length} grup.`;
    } catch (error) {
      console.error("Error mengaktifkan broadcast:", error);
      return "Gagal mengaktifkan broadcast.";
    }
  },

  async default() {
    return "Maaf, perintah tidak ditemukan. Ketik */menu* untuk melihat daftar perintah.";
  },
};

function bonusexp(exp, PlayerLv, BossLv) {
  if (BossLv <= PlayerLv + 5 && PlayerLv - 5 <= BossLv) return exp * 11;
  if (BossLv <= PlayerLv + 6 && PlayerLv - 6 <= BossLv) return exp * 10;
  if (BossLv <= PlayerLv + 7 && PlayerLv - 7 <= BossLv) return exp * 9;
  if (BossLv <= PlayerLv + 8 && PlayerLv - 8 <= BossLv) return exp * 7;
  if (BossLv <= PlayerLv + 9 && PlayerLv - 9 <= BossLv) return exp * 3;
  return exp;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function bosstemplate(RawData) {
  return `╠➥ *${RawData.name.id} [${RawData.mode}]*\n║ Level: ${RawData.level}\n║ EXP: ${formatNumber(RawData.bonusExp)}\n║ HP: ${formatNumber(RawData.hp)}\n║ 📌 ${RawData.map.name_id}`;
}

module.exports = handlers;
