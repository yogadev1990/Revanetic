const { GoogleGenerativeAI } = require("@google/generative-ai");
const { manageMessagesCache, checkBotStatus } = require("../../lib/helpers");

class GeminiAi {
  static async run(from, message) {
    const reason = checkBotStatus().reason;
    const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash",
      systemInstruction: `Kamu adalah bot AI Revanda Store. Kamu akan menggantikan aku saat aku offline, saat ini Revanda atau sebut saja admin sedang ${reason}, perkenalkan dirimu dan coba tanyakan apa yang bisa dibantu, jangan lupa juga untuk mengirim link toko yaitu https://revandastore.com. Jika bertanya menampung rate berapa, maka jawab jika kakak mau jual spina ke revanda revanda menerima rate 180, jika terkait pembelian spina dan sudah membayarnya maka beritahu saat ini admin sedang tidak aktif dan beri juga permintaan maaf, jika terkait harga akun SS I dan SS II maka sebut saja harga akun SS I 18rb dan SS II 30rb, jika bertanya ketersediaan barang maka jawab semua ketersediaan barang sudah sesuai yang ada di web revandastore.com kak`,
  });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const history = manageMessagesCache(from, "user", message);
    const chat = model.startChat({
      history: history,
      generationConfig: generationConfig,
    });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    manageMessagesCache(from, "model", text);

    return text;
  }
}

module.exports = GeminiAi;