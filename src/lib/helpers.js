const fs = require("fs");
const pathDelayed = `${__dirname}/../data/delayed.json`;
const pathSubscription = `${__dirname}/../data/subscriptions.json`;
const pathOwner = `${__dirname}/../data/owner.json`;

// Fungsi untuk memuat data dari owner.json
const loadOwnerData = () => {
  if (!fs.existsSync(pathOwner)) {
    // Jika file tidak ada, buat file dengan data default
    const defaultData = {
      BOT_ACTIVE: "off",
      BOT_REASON: "",
    };
    fs.writeFileSync(pathOwner, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  const fileBuffer = fs.readFileSync(pathOwner, "utf-8");
  return JSON.parse(fileBuffer);
};

// Fungsi untuk menyimpan data ke owner.json
const saveOwnerData = (key, value) => {
  const ownerData = loadOwnerData();
  ownerData[key] = value; // Update data
  fs.writeFileSync(pathOwner, JSON.stringify(ownerData, null, 2));
};

// Fungsi untuk memeriksa status bot
const checkBotStatus = () => {
  const ownerData = loadOwnerData();
  const isActive = ownerData.BOT_ACTIVE === "on";
  const reason = ownerData.BOT_REASON;
  return { isActive, reason };
};

// Fungsi untuk mengubah status bot ke "on" atau "off"
const setBotStatus = (status, reason = "") => {
  if (status !== "on" && status !== "off") {
    throw new Error("Status harus 'on' atau 'off'");
  }
  saveOwnerData("BOT_ACTIVE", status);
  saveOwnerData("BOT_REASON", reason);
};

const setON = async (reason) => {
  setBotStatus("on", reason); // Menggunakan fungsi setBotStatus
};

const setOFF = async () => {
  setBotStatus("off", "Bot dimatikan oleh OWNER"); // Alasan default
};

const loadSubscriptions = async () => {
  if (!fs.existsSync(pathSubscription)) {
    fs.writeFileSync(pathSubscription, JSON.stringify([]));
  }
  const fileBuffer = fs.readFileSync(pathSubscription, "utf-8");
  return JSON.parse(fileBuffer);
};

// Menyimpan data langganan dan pengaturan grup
const saveSubscription = async (from, durationInDays, groupSettings = {}) => {
  const subscriptions = await loadSubscriptions();
  const now = new Date();
  const existing = subscriptions.find((item) => item.from === from);

  if (existing) {
    existing.startDate = now;
    existing.expiryDate = new Date(now.getTime() + durationInDays * 24 * 60 * 60 * 1000);
    existing.groupSettings = { 
      rules: groupSettings.rules || existing.groupSettings.rules || "Tidak ada aturan.",
      antiLink: groupSettings.antiLink ?? existing.groupSettings.antiLink ?? false,
      antiToxic: groupSettings.antiToxic ?? existing.groupSettings.antiToxic ?? false,
      welcome: groupSettings.welcome ?? existing.groupSettings.welcome ?? false,
      out: groupSettings.out ?? existing.groupSettings.out ?? false,
      welcomeMsg: groupSettings.welcomeMsg || existing.groupSettings.welcomeMsg || "Selamat datang di grup!",
      outMsg: groupSettings.outMsg || existing.groupSettings.outMsg || "Selamat tinggal!",
    };
  } else {
    subscriptions.push({
      from,
      startDate: now,
      expiryDate: new Date(now.getTime() + durationInDays * 24 * 60 * 60 * 1000),
      groupSettings: {
        rules: groupSettings.rules || "Tidak ada aturan.",
        antiLink: groupSettings.antiLink ?? false,
        antiToxic: groupSettings.antiToxic ?? false,
        welcome: groupSettings.welcome ?? false,
        out: groupSettings.out ?? false,
        welcomeMsg: groupSettings.welcomeMsg || "Selamat datang di grup!",
        outMsg: groupSettings.outMsg || "Selamat tinggal!",
      },
    });
  }
  fs.writeFileSync(pathSubscription, JSON.stringify(subscriptions, null, 2));
};

const checkSubscription = async (from) => {
  const subscriptions = await loadSubscriptions();
  const existing = subscriptions.find((item) => item.from === from);

  if (!existing) {
    return {
      isActive: false,
      remainingTime: "Tidak ada langganan",
      groupSettings: null,
    };
  }

  const now = new Date();
  const expiryDate = new Date(existing.expiryDate);
  const isActive = now <= expiryDate;
  const remainingTimeInMs = expiryDate - now;

  if (!isActive) {
    return {
      isActive: false,
      remainingTime: "Langganan sudah berakhir",
      groupSettings: existing.groupSettings,
    };
  }

  const seconds = Math.floor((remainingTimeInMs / 1000) % 60);
  const minutes = Math.floor((remainingTimeInMs / (1000 * 60)) % 60);
  const hours = Math.floor((remainingTimeInMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remainingTimeInMs / (1000 * 60 * 60 * 24));
  const remainingTime = `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;

  return {
    isActive,
    remainingTime,
    groupSettings: existing.groupSettings,
  };
};

// Menyimpan pengaturan grup
const saveGroupSettings = async (from, newGroupSettings) => {
  try {
    const subscriptions = await loadSubscriptions();
    const existing = subscriptions.find((item) => item.from === from);

    if (!existing) {
      throw new Error(`Langganan untuk ${from} tidak ditemukan.`);
    }

    existing.groupSettings = {
      ...existing.groupSettings, // Pengaturan lama
      ...newGroupSettings,      // Pengaturan baru
    };

    fs.writeFileSync(pathSubscription, JSON.stringify(subscriptions, null, 2));
    console.log(`Pengaturan grup untuk ${from} berhasil diperbarui.`);
    return existing.groupSettings;
  } catch (error) {
    console.error("Gagal menyimpan pengaturan grup:", error);
    throw new Error("Gagal menyimpan pengaturan grup.");
  }
};


const loadDelayed = async () => {
  if (!fs.existsSync(pathDelayed)) {
    fs.writeFileSync(pathDelayed, JSON.stringify([]));
  }
  const fileBuffer = fs.readFileSync(pathDelayed, "utf-8");
  return JSON.parse(fileBuffer);
};

const saveDelayed = async (from) => {
  const delayedData = await loadDelayed();
  const now = new Date();
  const existing = delayedData.find((item) => item.from === from);

  if (existing) {
    existing.lastSent = now;
  } else {
    delayedData.push({ from, lastSent: now });
  }

  fs.writeFileSync(pathDelayed, JSON.stringify(delayedData));
};

// Cek apakah pesan sudah bisa dikirim (4 jam delay)
const checkDelay = async (from) => {
  const delayedData = await loadDelayed();
  const existing = delayedData.find((item) => item.from === from);

  if (!existing) {
    return true; // Jika belum ada, boleh kirim
  }

  const lastSent = new Date(existing.lastSent);
  const now = new Date();
  const fourHours = 4 * 60 * 60 * 1000;

  return now - lastSent >= fourHours; // Jika sudah lebih dari 4 jam, boleh kirim
};

module.exports = {
  loadDelayed,
  saveDelayed,
  checkDelay,
  loadSubscriptions,
  saveSubscription,
  checkSubscription,
  checkBotStatus,
  setON, // Tambahkan ini ke ekspor
  setOFF, // Tambahkan ini ke ekspor
  saveGroupSettings,
};
