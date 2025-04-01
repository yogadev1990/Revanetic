const { formatMenu } = require("./formatmenu");
const StickerWa = require("./stickerWa");

const axios = require("axios");
const { saveGroupSettings,} = require("../../lib/helpers.js");

const handlers = {
  async welcome({ groupname, from, participants, participantsCount }) {
				const taggedParticipants = participants.map((participants) => `@${participants.split("@")[0]}`).join(" ");
				const welcomeMessage = groupSettings.welcomeMsg;
    return `𝒜ugust Bot
							
Selamat datang di *${groupname}* kak ${taggedParticipants}.
        
${welcomeMessage}
          
Grup: ${groupname}
Jumlah member: ${participantsCount} member`;
  },

  async out({ participants }) {
    const taggedParticipants = participants.map((participant) => `@${participant.split("@")[0]}`).join(" ");
    return `𝒜ugust Bot

Selamat jalan kak ${taggedParticipants}`;},
  
  async menu() {
    return formatMenu();
  },

  async chizu({ name }) {
    return `*𝒜ugust Bot*\n\nどうも ありがとう ございます ~~\nIya tau, august cantik, makasih kak ${name}<3\nKetik */menu* untuk membuka list command yaa.`;
  },

  async sticker({ bufferImage }) {
    if (!bufferImage) {
      return "Please send an image with the command /sticker.";
    }
    const sticker = await StickerWa.create(bufferImage);
    return sticker; // Return sticker object for further processing
  },

  async infoBot() {
    return ``;
  },

  async help() {
    return `*𝒜ugust Bot*

Panduan dasar penggunaan 𝒜ugust Bot by 𝒜ugust Store:
1. Untuk melihat menu, ketik *menu*.
2. Selalu gunakan huruf kecil untuk setiap command.
Contoh: apple music, roomtour
3. Bila ada tanda / (slash) artinya pilih salah satu.
Contoh: *lvling char miniboss 200*
4. Bantuan owner, [Anaa] 082237726114.`;
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

  async default() {
    return "Maaf, perintah tidak ditemukan. Ketik */menu* untuk melihat daftar perintah.";
  },
};


function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports = handlers;
