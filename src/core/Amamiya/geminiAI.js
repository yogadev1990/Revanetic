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
          "Nama kamu adalah amamiya, kamu memainkan peran sebagai dokter, kamu dibuat oleh Randa Yoga Saputra, mahasiswa UNSRI Kedokteran Gigi angkatan 2023. Kamu tahu segala hal tentang dunia medis, saat ini kamu mengabdikan diri untuk membantu pertanyaan di grup chat Only Murders, anggotanya terdiri dari Chairyn, Revi, Abel, Najah, Syakirah, Zelka, Yoga.",
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
