const { Profanity, CensorType } = require('@2toad/profanity');

const profanity = new Profanity({
    languages: ["id"],
    wholeword: false,
});

const link = [
    ".com",
    ".net",
    ".org",
    ".edu",
    ".gov",
    ".mil",
    ".int",
    ".biz",
    ".info",
    ".name",
    ".pro",
    ".aero",
    ".coop",
    ".museum",
    ".mobi",
    ".asia",
    ".cat",
    ".jobs",
    ".tel",
    ".travel",
    ".xxx",
    ".post",
    ".geo",
    ".nato",
    ".example",
    ".invalid",
    ".localhost",
    ".test",
    ".bitnet",
    ".io",
    ".ai",
    ".csnet",
    ".ip",
    ".local",
    ".onion",
    ".uucp",
    ".arpa",
    ".root",
    ".mail",
    ".home",
    ".corp",
    ".dev",
    ".site",
    ".app",
    ".web",
    ".store",
    ".cloud",
    ".online",
    ".tech",
    ".space",
    ".press",
    ".digital",
    ".world",
    ".media",
    ".news",
    ".blog",
    ".life",
    ".today",
    ".center",
    ".company",
    ".email",
    ".group",
    ".guru",
    ".info",
    ".network",
    ".services",
    ".solutions",
    ".id",
    "http"
] ;

class Validator {
    async containsLink(message) {
        const lowerCasedMessage = message.toLowerCase(); // Konversi ke huruf kecil untuk pemeriksaan
        return link.some((word) => lowerCasedMessage.includes(word));
    }

    async containsBadWords(message) {
        const censored = profanity.exists(message); // Sensor pesan
        return censored;
    }

    async BadWords(args, add) {
        if (!Array.isArray(args) || args.length === 0) {
            return "Tidak ada kata untuk diproses.";
        }
        if (add) {
            profanity.addWords(args);
            return "Kata-kata kotor berhasil ditambahkan.";
        } else {
            profanity.removeWords(args);
            return "Kata-kata kotor berhasil dihapus.";
        }
    }

    async whitelist(args, add) {
        if (!Array.isArray(args) || args.length === 0) {
            return "Tidak ada kata untuk diproses.";
        }
        if (add) {
            profanity.whitelist.addWords(args);
            return "Kata-kata berhasil ditambahkan ke whitelist.";
        } else {
            profanity.whitelist.removeWords(args);
            return "Kata-kata berhasil dihapus dari whitelist.";
        }
    }
}
module.exports = Validator;
