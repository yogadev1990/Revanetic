class Iklan {
    constructor(pesanArray = []) {
      this.pesanArray = pesanArray.length ? pesanArray : [
        `> Mang bajirot jalan ke hora  
> Bajirot pergi, sedihlah minato
> Nyari tempat Top Up Terpercaya?
> Ya cuma di Revanda Store bro`,
        `👥 : Siapa namamu tuan? 
👤 : Namaku Dis!
👥 : Dis apa?
👤 : Disini! Revanda Store tempat Top up Game Termurah & Terpercaya, serba otomatis, anti drama clone & scam🔥`,
        `> Jalan-jalan ke penjara cuervo
> Ke cuervo mengajak adala
> Hari gini masih kena scam bro?
> Top up di web Revanda Store aja laa`,
        `> Iri dengan temen yang punya banyak skin? Tenang, kamu juga bisa kok. Top up termurah, legal, dan terpercaya hanya di Revanda Store🔥`,
        `> Ke kota naga membeli Crysta
> Crysta dibeli, spina habis
Ga itu bukan pantun, cuma mau bilang: Spina mu abis? gasin ke Revanda Store, Anti drama scam & clone🔥`
      ];
      this.cachedIklan = null;
    }
  
    generateIklan() {
      const waktu = new Date();
      const waktuJakarta = new Date(waktu.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const hari = waktuJakarta.toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'Asia/Jakarta' });
      const jam = waktuJakarta.getHours().toString().padStart(2, '0');
      const menit = waktuJakarta.getMinutes().toString().padStart(2, '0');
      const pesanAcak = this.pesanArray[Math.floor(Math.random() * this.pesanArray.length)];
  
      return `🎮 𝐑𝐞𝐯𝐚𝐧𝐝𝐚 𝐒𝐭𝐨𝐫𝐞: 𝐓𝐨𝐫𝐚𝐦 𝐎𝐧𝐥𝐢𝐧𝐞 🎮

${pesanAcak}

𝐁𝐮𝐲/𝐒𝐞𝐥𝐥 𝐥𝐢𝐬𝐭:
- Buy Spina PM Rate, terima ecer
- Sell Spina & Top up Orb Via Login (https://revandastore.com/games/toram-online)
- Sell Akun 1k stack SS II / SS I

𝐋𝐚𝐲𝐚𝐧𝐚𝐧 𝐋𝐚𝐢𝐧:
- Top Up ML, FF, PUBG, Genshin, dll. termurah di revandastore.com
- Sewa bot GC WA Guild Toram (https://revandastore.com/katalog/11)

⚠ torampedia.my.id/scammerlist
╔ >> ${hari}, ${jam}:${menit} WIB <<
╚〘 𝐑𝐞𝐯𝐚𝐧𝐝𝐚 𝐒𝐭𝐨𝐫𝐞 〙`;
    }
  
    getIklan() {
      if (!this.cachedIklan) {
        this.cachedIklan = this.generateIklan();
      }
      return this.cachedIklan;
    }
  }
  module.exports = Iklan;