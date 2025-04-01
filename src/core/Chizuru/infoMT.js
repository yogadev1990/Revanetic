const axios = require("axios");
const cheerio = require("cheerio");

class ToramNews {
  constructor() {
    this.url = "https://id.toram.jp/?type_code=update";
  }

  async scrapeCategory() {
    try {
      const response = await axios.get(this.url);
      const html = response.data;
      const $ = cheerio.load(html);
      const newsList = [];

      $("li.news_border").each((index, element) => {
        const title = $(element).find(".news_title").text().trim();
        const link = $(element).find("a").attr("href");
        newsList.push({ title, link });
      });

      return newsList;
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil kategori berita:", error.message);
      return [];
    }
  }

  async scrapeLatestNews(newsUrl) {
    try {
      const response = await axios.get(newsUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      const title = $(".smallTitle.news_title.yellow").text().trim();
      const content = $("div.useBox")
        .clone() // Duplikat elemen
        .find("a, p, h1, script") // Cari elemen tertentu untuk dihapus
        .remove() // Hapus elemen yang tidak perlu
        .end()
        .text() // Ambil teks bersih
        .trim();

      return { title, content };
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil berita terbaru:", error.message);
      return null;
    }
  }

  // Fungsi utama untuk menggabungkan proses scraping
  async fetchLatestNews() {
    const newsList = await this.scrapeCategory();
    if (newsList.length === 0) {
      return "Tidak ada berita terbaru yang tersedia.";
    }

    const latestNewsUrl = `https://id.toram.jp/${newsList[0].link}`;
    const latestNews = await this.scrapeLatestNews(latestNewsUrl);

    if (!latestNews) {
      return "Terjadi kesalahan saat mengambil berita terbaru.";
    }

    return `*Chizuru-chan🌸*

${latestNews.title}
══════════════
${latestNews.content}
══════════════`;
  }
}

module.exports = ToramNews;
