const axios = require("axios");

class SatuSehatAPI {
  constructor() {
    this.token = "bkwAaLO5bMKLnmUeNsDwHRDUuQAA";
    this.baseURL = "https://api-satusehat-stg.dto.kemkes.go.id/kfa-v2/products/all";
  }

  async search(query) {
    const auth = { headers: { Authorization: `Bearer ${this.token}` } };

    try {
      const response = await axios.get(`${this.baseURL}?page=1&size=10&product_type=farmasi&keyword=${query}`, auth);
      const items = response.data.items.data;

      let itemDetails = `*Amamiya-San*\n`;

      items.forEach((item) => {
        const itemName = item.name;
        const itemLink = item.kfa_code;
        const itemStat = item.dosage_form?.name || "Tidak tersedia";
        const namadagang = item.nama_dagang || "Tidak tersedia";
        const dosisperunit = item.dose_per_unit || "Tidak tersedia";
        const volume = item.volume || "Tidak tersedia";
        const satuan = item.volume_uom_name || "Tidak tersedia";

        itemDetails += `\n*Nama Obat:* ${itemName}\n`;
        itemDetails += `*Kode Obat:* ${itemLink}\n`;
        itemDetails += `*Bentuk Sediaan:* ${itemStat}\n`;
        itemDetails += `*Banyaknya:* ${volume} ${satuan}\n`;
        itemDetails += `*Dosis per Unit:* ${dosisperunit}\n`;
        itemDetails += `*Nama dagang:* ${namadagang}\n`;
      });

      return itemDetails;
    } catch (error) {
      console.error("Error fetching item data:", error.message);
      console.error("Error stack trace:", error.stack);
      return "Terjadi kesalahan dalam pencarian item.";
    }
  }
}

// Export class agar bisa digunakan di file lain
module.exports = SatuSehatAPI;
