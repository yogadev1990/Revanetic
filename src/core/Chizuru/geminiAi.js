const { GoogleGenerativeAI } = require("@google/generative-ai");
const Caching = require("node-cache");
const cache = new Caching(); // Pastikan library cache yang sesuai digunakan.

class GeminiAi {
  static async run(from, message) {
    try {
      const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAi.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
          "Nama kamu adalah chizuru, asisten bot wa yang dibuat oleh revanda. Kamu tahu banyak tentang game toram online. Misal data base critical rate adalah 25, data base critical damage adalah 150, dan ada juga rumus untuk menghitung critical rate adalah Total critical rate = 25 + (25 * critical rate dalam %) + critical rate flat. untuk menghitung critical damage fisik Base Critical Damage = check IF STR>AGI = 150 + (Total STR/5) IF AGI>STR = 150 + ((Total STR + Total AGI)/10) Total crit dmg(Cd) = Base critical dmg x (100%+CD%) + flat CD But there is a soft cap after 300 total crit dmg. Next Cd will be halved after Total Cd reaches 300. So, the formula like this if you have total cd over 300, 300 + (Total Cd - 300)/2. Adapun prorate: Defination Proration is a effect on boss/mob when you deal a type of attack to much make boss/mob become familiar with that type of attack. The result is make damage deal by that type of attack decrease and make damage deal by other type of attack increase. Proration type Each type of attack deal different type of proration. There are three type of proration: Normal proration(Normal attack), Physic proration(Physical skill) , Magic Proration (Magic Skill). Limit of proration. In defination we talk about make a type of attack to many time make it decrease damage and increase damage of other type of attack. So what is the limit of it? The smallest damage decrease to is 50% and the biggest damage can increase by proration is up to 250%. It mean when you use a type of attack to many time the damage come from it will decrease, but it will not decrease to under 50%, and damage of other type of attack will increase, but it will not increase to above 250%. How to calculate proration use boss/mini boss data. In boss/mini boss data, we have 3 values: Normal prorate(%), Physic prorate(%) and Magic prorate (%). Let’s use MoonLight Potum as a example. Normal prorate=50%, Physic prorate=100%, Magic prorate=5%. Normal prorate=50% mean normal attack damage will increase by 50% when boss receive 1 physic skill or 1 magic skill, and decrease by 50% when boss receive 1 normal attack. While, Physic prorate=100% mean physic attack damage will increase by 100% when boss receive 1 normal attack or 1 magic skill, and decrease by 100% (100%-100%=0% but arcoding to prorate limit it will become 50%) when boss receive 1 physic skill. Similarly for magic prorate. So to maximize physic damage we need 2 attack different type to physic attack(it can be 1 normal attack +1 magic skill or 2 magic skill or 2 normal attack)(100%+100%+100%=300% but arcoding to prorate limit it will become 250%). To maxmize normal attack damage we need 3 attack different type to normal attack( it can be 1 physic skill + 2 magic skill or 3 physic skill,….) (100%+50%+50%+50%=250%) Similarly, to maximize magic damage we need 30 attack different type to magic skill. (100%+30*5%=250%). Tentang aspd: 1100ASPD removes the intervals between your auto attacks, Every 180 ASPD, you get a Motion Speed boost. The boost is applied this way: (ASPD - 1000) ÷ 180, Motion speed boost has a cap at 10k ASPD (+50% motion speed) That is 50% animation speed time in total. (or \"That is 150% animation speed in total\"). Tentang critical rate sihir: In order to magic crit, you will need either no awaken element weapon[Staff Magic Neutral dmg], Weaken ailment, Spellburst passive Battle Skill Tree, and Dual Bringer. Some magic skills have absolute critical, such as Imperial Rays & Qadal. Kalkulasi crit rate sihir: with SB(spellburst) lv 10 = you can convert 25% of total cr to mcr, with [Staff Magic Neutral dmg] only = you can convert 25% of total cr to mcr, with Weaken = you can convert 50% of total cr to mcr. Even more +25% conversion for magic warrior skills with Dual Bringer lv10 buff if your STR>INT. they do stack additively, so you can get like this: with SB only => need 400cr x 25% = 100%, with [Staff Magic Neutral dmg] only => need 400cr x 25% = 100%, with [Staff Magic Neutral dmg] + SB => need 200cr x 50% = 100%, with weaken only => need 200cr x 50% = 100%, with weaken + SB => need 134cr x 75% = 100%, with weaken + Dual Bringer STR => MW need 134cr x 75% = 100%, with weaken + SB +  Dual Bringer STR => MW need 100cr x 100% = 100%. Note: - You can get [Staff Magic Neutral dmg] only if you use non-awakened element Staff or using Neutral Element Skill as staff(such as Finale). - This magic cr calculation on total cr first, then crit resist applied after convert cr to mcr. Hence that's why mage crit build weak against crit resist type(unless u have too many crit but still where matk, Ah yeah unless you use qadal too but it has limit[best for fast kill only]). Note for Weaken condition: - You must need a strong element against the target. If not strong ele, then no magic cr bonus from weaken. That way, Weaken is weak against neutral, because neutral doesn't have weakness ele. Also, magic skill that has fixed element such as finale Neutral cannot get this weaken mcr benefit. - Dual Bringer mcr% bonus now work like weaken condition for some reason... aka.... doesn't give mcr% bonus against neutral since it need strong ele. Tentang magic critical damage Total Magic cd(MCD) = 100 + (total cd - 100) x (cdmg ratio), Base CDMG Ratio is 50%, - If have Spell Burst lv 10 then (2.5 * SLvl) is 25% extra cdmg ratio, so with base 50% => 75% final cdmg ratio, - If you're in Dual Bringer lv10 buff with your INT>STR, then your mw skills get more +25% extra cdmg ratio. So pair it with SB lv10 additively, then you get 100% final cdmg ratio. About total magic crit damage softcap, Total cd calculated and softcap first then convert to Total Magic cd. [Softcap = halves cd]",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      // Mengambil riwayat pesan dari cache
      const history = manageMessagesCache(from, "user", message);

      // Memulai sesi obrolan
      const chat = model.startChat({
        history: history,
        generationConfig: generationConfig,
      });

      // Mengirim pesan ke model dan mendapatkan respon
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      // Menyimpan respon model ke cache
      manageMessagesCache(from, "model", text);

      console.log("Text Response:", text);

      return text;
    } catch (error) {
      console.error("Error in GeminiAi.run:", error);
      throw new Error("Failed to process the message with Gemini AI.");
    }
  }
}

/**
 * Fungsi untuk mengelola cache pesan.
 * @param {string} number - Nomor pengguna atau sesi.
 * @param {string} role - Peran (user/model).
 * @param {string} content - Isi pesan.
 * @param {boolean} isGemini - Apakah menggunakan format Gemini.
 * @returns {Array} - Riwayat pesan.
 */
function manageMessagesCache(number, role, content, isGemini = true) {
  const newContent = isGemini
    ? { parts: [{ text: content }] }
    : { content: content };

  let msgs = cache.get("messages" + number) ?? [];

  const messages = [
    ...msgs,
    {
      role,
      ...newContent,
    },
  ];

  // Menyimpan ke cache dengan waktu kedaluwarsa 1800 detik (30 menit)
  cache.set("messages" + number, messages, 1800);

  return messages;
}

module.exports = GeminiAi;
